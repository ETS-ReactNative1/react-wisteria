import React, { createContext, useContext, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { connect, Provider } from '../dist';
import { CONNECT_WITHOUT_PROVIDER_ERROR_MSG } from './connect';

configure({ adapter: new Adapter() });

jest.spyOn(console, 'groupCollapsed').mockImplementation(() => null);
jest.spyOn(console, 'log').mockImplementation(() => null);
jest.spyOn(console, 'error').mockImplementation(() => null);
jest.spyOn(console, 'trace').mockImplementation(() => null);
jest.spyOn(console, 'groupEnd').mockImplementation(() => null);

let currentContext;
let currentSetContext;
let renderedTimes;

const Context = createContext();

const ContextInspector = ({ context, setContext }) => {
    currentContext = context;
    currentSetContext = setContext;
    renderedTimes++;

    return null;
};

const ConnectedContextInspector = connect((x) => x)(ContextInspector);

const App = (options) => Provider(options)(ConnectedContextInspector);

beforeEach(() => {
    currentContext = null;
    currentSetContext = null;
    renderedTimes = 0;
});

it('should build initial context value based on initial props', () => {
    const Spec = App({ Context });
    mount(<Spec count={1} name="islam"/>);

    expect(currentContext).toEqual({ count: 1, name: 'islam' });
});

it('should update context value when calling setContext with a value for a specific path', () => {
    const Spec = App({ Context });
    mount(<Spec count={1} name="islam"/>);

    act(() => {
        currentSetContext('count', 2);
    });

    expect(currentContext).toEqual({ count: 2, name: 'islam' });
});

it('should build context nested non-exists value when calling setContext non exist path', () => {
    const Spec = App({ Context });
    mount(<Spec count={1} name="islam"/>);

    act(() => {
        currentSetContext('path.not.found.here', 2);
    });

    expect(currentContext).toEqual({
        count: 1,
        path: { not: { found: { here: 2 } } },
        name: 'islam'
    });
});

it('should build context nested non-exists array value when calling setContext non exist path', () => {
    const Spec = App({ Context });
    mount(<Spec count={1} name="islam"/>);

    act(() => {
        currentSetContext('path.not.found.here.0', 1);
        currentSetContext('path.not.found.here.1', 2);
    });

    expect(currentContext).toEqual({
        count: 1,
        path: { not: { found: { here: [ 1,2 ] } } },
        name: 'islam'
    });
});

it('should update context value when calling functional setContext for a specific path', () => {
    const Spec = App({ Context });
    mount(<Spec count={1} name="islam"/>);

    act(() => {
        currentSetContext('count', (count) => count + 1);
    });

    expect(currentContext).toEqual({ count: 2, name: 'islam' });
});

it('should build initial context value once at initial render based on initialPropsMapper if get passed', () => {
    const initialPropsMapper = jest.fn().mockImplementation(({ count, name }) => ({ namespace: { count, name, address: '' } }));

    const Spec = App({ Context, initialPropsMapper });
    mount(<Spec count={1} name="islam"/>);

    expect(currentContext).toEqual({ namespace: { count: 1, name: 'islam', address: '' } });
    expect(initialPropsMapper).toHaveBeenCalledTimes(1);
});

it('should derive state value if hook calls setContext immediately with one render cycle', () => {
    const blueColorOnEvenRedOnOdd = ({ context, prevContext, setContext }) => {
        if (context.count === prevContext.count) { return; }

        setContext('color', context.count % 2 === 0 ? 'blue' : 'red');
    };

    const Spec = App({ Context, hooks: [blueColorOnEvenRedOnOdd] });
    mount(<Spec count={0}/>);
    expect(renderedTimes).toBe(1);
    expect(currentContext).toEqual({ count: 0, color: 'blue' });

    act(() => {
        currentSetContext('count', 3);
    });

    expect(renderedTimes).toBe(2);
    expect(currentContext).toEqual({ count: 3, color: 'red' });
});

it('should throw error if hook calls setContext infinitely', () => {
    const infiniteHook = ({ context, setContext }) => {
        // We always call setContext without being wrapped in conditions.
        setContext('color', context.count % 2 === 0 ? 'blue' : 'red');
    };

    const Spec = App({ Context, hooks: [infiniteHook] });

    expect(() => {
        mount(<Spec count={0}/>);
    }).toThrow('Too many re-renders. React limits the number of renders to prevent an infinite loop.');
});

it('should execute hooks when get passed on each update', () => {
    const fun = jest.fn();

    const Spec = App({ Context, hooks: [fun] });
    mount(<Spec count={0}/>);

    expect(fun).toHaveBeenCalledTimes(2);

    act(() => {
        currentSetContext('count', 4);
    });

    expect(fun).toHaveBeenCalledTimes(4);
});

it('should batch multiple setContext calls in sync hooks', () => {
    const hook = jest.fn().mockImplementation(({ context, setContext, prevContext }) => {
        if (context.count === 1 && prevContext.count === 0) {
            setContext('a', 1);
            setContext('b', 2);
        }
    });

    const Spec = App({ Context, hooks: [hook] });
    mount(<Spec count={0}/>);

    hook.mockClear();

    act(() => {
        currentSetContext('count', 1);
    });

    expect(hook).toHaveBeenCalledTimes(3);
    expect(hook).toHaveBeenCalledWith({ context: { count: 1 }, prevContext: { count: 0 }, setContext: expect.any(Function) });
    expect(hook).toHaveBeenCalledWith({ context: { count: 1, a: 1, b: 2 }, prevContext: { count: 1 }, setContext: expect.any(Function) });
    expect(hook).toHaveBeenCalledWith({ context: { count: 1, a: 1, b: 2 }, prevContext: { count: 1, a: 1, b: 2 }, setContext: expect.any(Function) });
});

it('should not re-render when connect state slice do not change', () => {
    const ContextInspector = ({ count, setContext }) => {
        currentSetContext = setContext;
        renderedTimes++;
    
        return count;
    };

    const ConnectedContextInspector = connect(({ context: { count }, setContext }) => ({ count, setContext }))(ContextInspector);
    const Spec = Provider({ Context })(ConnectedContextInspector);

    mount(<Spec count={0}/>);
    expect(renderedTimes).toBe(1);
    act(() => {
        currentSetContext('count', (count) => count + 1);
    });

    expect(renderedTimes).toBe(2);

    act(() => {
        currentSetContext('color', 'purple');
    });

    expect(renderedTimes).toBe(2); // Do not re-render
});

it('should throw error when using connect without Provider', () => {
    const ContextInspector = ({ count, setContext }) => {
        currentSetContext = setContext;
        renderedTimes++;
    
        return count;
    };

    const ConnectedContextInspector = connect(({ context: { count }, setContext }) => ({ count, setContext }))(ContextInspector);

    expect(() => {
        mount(<ConnectedContextInspector count={0}/>);
    }).toThrow(CONNECT_WITHOUT_PROVIDER_ERROR_MSG);
});

it('should not call hooks when parent update (memoized wisteria provider)', () => {
    const hook = jest.fn();
    const Spec = App({ Context, hooks: [hook] });

    const Parent = () => {
        const [count, setCount] = useState(0);

        return (
            <div>
                <Spec count={1} name="islam"/>
                <button type="button" onClick={() => setCount((x) => x + 1)}>
                    Update Parent State. {count}
                </button>
            </div>
        );
    };

    const wrapper = mount(<Parent/>);
    hook.mockClear();

    act(() => {
        wrapper.find('button').simulate('click');
        wrapper.update();
    });
    expect(hook).not.toHaveBeenCalled();
});

// This can happen when our hooks is consuming a high rate updating context from some parent.
it('should not call connectors when wisteria context did not changed when upper update happens', () => {
    const ParentContext = createContext();

    const useEffect = () => {
        useContext(ParentContext);
    };

    const NullishChild = () => null;
    const useStateToPropsMock = jest.fn().mockReturnValue({});
    const ConnectedInspector = connect(useStateToPropsMock)(NullishChild);
    const Spec = Provider({ Context, hooks: [useEffect] })(ConnectedInspector);

    const Parent = () => {
        const [count, setCount] = useState(0);

        return (
            <ParentContext.Provider value={count}>
                <Spec count={1} name="islam"/>
                <button type="button" onClick={() => setCount((x) => x + 1)}>
                    Update Parent State. {count}
                </button>
            </ParentContext.Provider>
        );
    };

    const wrapper = mount(<Parent/>);
    useStateToPropsMock.mockClear();

    act(() => {
        wrapper.find('button').simulate('click');
        wrapper.update();
    });
    expect(useStateToPropsMock).not.toHaveBeenCalled();
});
