import React, { useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
    connect,
    useWisteriaStateSlice,
    useWisteriaStateUpdater,
    useCreateStores,
    StoreProvider,
    useWisteriaStore
} from '.';

configure({ adapter: new Adapter() });

jest.spyOn(console, 'groupCollapsed').mockImplementation(() => null);
jest.spyOn(console, 'log').mockImplementation(() => null);
jest.spyOn(console, 'error').mockImplementation(() => null);
jest.spyOn(console, 'trace').mockImplementation(() => null);
jest.spyOn(console, 'groupEnd').mockImplementation(() => null);

let wrapper;
let currentContext;
let currentSetContext;

const ContextInspector = ({ context, setContext }) => {
    currentContext = context;
    currentSetContext = setContext;

    return null;
};

const MY_APP_STORE_KEY = 'my-app';

const useStateToProps = () => {
    const myAppStore = useWisteriaStore(MY_APP_STORE_KEY);
    const context = useWisteriaStateSlice(myAppStore);
    const setContext = useWisteriaStateUpdater(myAppStore);

    return {
        context,
        setContext
    };
}

const ConnectedContextInspector = connect(useStateToProps)(ContextInspector);

const App = ({ children, stores, ...rest }) => {
    const mainAppStoreConfig = { ...rest, name: MY_APP_STORE_KEY };
    const strs = useCreateStores(stores ? [mainAppStoreConfig, ...stores] : [mainAppStoreConfig]);

    return (
        <StoreProvider stores={strs}>
            {children}
            <ConnectedContextInspector/>
        </StoreProvider>
    );
};

beforeEach(() => {
    currentContext = null;
    currentSetContext = null;
});

afterEach(() => {
    try {
        wrapper.unmount();
    } catch (err) {
        //
    }
});

it('should build initial context value based on initial props', () => {
    const config = { initialState: { count: 1, name: 'islam' } };
    wrapper = mount(<App {...config}/>);

    expect(currentContext).toEqual({ count: 1, name: 'islam' });
});

it('should build initial context value based on the initialPropsMapper if supplied', () => {
    const config = { initialState: { count: 1, name: 'islam' }, initialPropsMapper: (state) => ({ ...state, isInitialRender: true }) };
    wrapper = mount(<App {...config}/>);

    expect(currentContext).toEqual({ count: 1, name: 'islam', isInitialRender: true });
});

it('should update context value when calling setContext with a value for a specific path', () => {
    const config = { initialState: { count: 1, name: 'islam' } };
    wrapper = mount(<App {...config}/>);

    act(() => {
        currentSetContext('count', 2);
    });

    expect(currentContext).toEqual({ count: 2, name: 'islam' });
});

it('should update context value when calling functional setContext for a specific path', () => {
    const config = { initialState: { count: 1, name: 'islam' } };
    wrapper = mount(<App {...config}/>);

    act(() => {
        currentSetContext('count', (count) => count + 1);
    });

    expect(currentContext).toEqual({ count: 2, name: 'islam' });
});

it('should give effects to inspect and update state', () => {
    const effectTextGenerator = (count) => `useSomething consoled count {${count}}`;

    const useSomething = () => {
        const myAppStore = useWisteriaStore(MY_APP_STORE_KEY);
        const count = useWisteriaStateSlice(myAppStore, 'count');
        const setContext = useWisteriaStateUpdater(myAppStore);

        useEffect(() => {
            if (!window.effectResponse) {
                window.effectResponse = effectTextGenerator(count);
                setContext('count', count + 1);
            }
        }, [count, setContext]);
    };

    const config = { initialState: { count: 0 }, effects: [useSomething] };
    wrapper = mount(<App {...config}/>);

    expect(window.effectResponse).toBe(effectTextGenerator(0));
    expect(currentContext.count).toBe(1);
});

it('should not re-render when connect state slice do not change', () => {
    let renderedChild = 0;

    const Child = ({ count }) => {  
        renderedChild++;  
        return count;
    };

    const useStateToProps = () => {
        const myAppStore = useWisteriaStore(MY_APP_STORE_KEY);
        const count = useWisteriaStateSlice(myAppStore, 'count');

        return {
            count
        }
    };

    const ConnectedChild = connect(useStateToProps)(Child);

    const config = { initialState: { count: 0 } };

    wrapper = mount(
        <App {...config}>
            <ConnectedChild/>
        </App>
    );

    expect(renderedChild).toBe(1);
    act(() => {
        currentSetContext('count', (count) => count + 1);
    });

    expect(renderedChild).toBe(2);

    act(() => {
        currentSetContext('color', 'purple');
    });

    expect(renderedChild).toBe(2); // Do not re-render
});

it('should throw an error when using an existing store name', () => {
    const Component = () => {
        useCreateStores([
            { name: 'store-x', initialState: {} },
            { name: 'store-x', initialState: {} }
        ]);
    
        return (
            <div/>
        );
    };

    expect(() => {
        mount(<Component/>);
    }).toThrow('"store-x" was already assigned for another store');
});

it('should throw an error when store name is missing', () => {
    const Component = () => {
        useCreateStores([
            { initialState: {} }
        ]);
    
        return (
            <div/>
        );
    };

    expect(() => {
        mount(<Component/>);
    }).toThrow('"name" is required option for Wisteria Store');
});

it('should update second store if gets updated by first store in effects', () => {
    const useUpdateBOnCountZero = () => {
        const storeA = useWisteriaStore('store-a');
        const storeB = useWisteriaStore('store-b');

        const countA = useWisteriaStateSlice(storeA, 'count');
        const storeAUpdater = useWisteriaStateUpdater(storeA);
        const storeBUpdater = useWisteriaStateUpdater(storeB);

        React.useEffect(() => {
            if (countA === 0) {
                storeAUpdater('count', '1');
                storeBUpdater('count', '1');
            }
        }, [countA, storeAUpdater, storeBUpdater]);
    }

    const stores = [
        { name: 'store-a', initialState: { count: 0 }, effects: [useUpdateBOnCountZero] },
        { name: 'store-b', initialState: { count: 0 } }
    ];

    wrapper = mount(
        <App stores={stores}>
            Child
        </App>
    );

    wrapper.update();

    expect(window.ReactWisteriaStores['store-a'].count).toBe('1');
    expect(window.ReactWisteriaStores['store-b'].count).toBe('1');
});
