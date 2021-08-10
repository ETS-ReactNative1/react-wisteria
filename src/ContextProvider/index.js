import React, { useEffect, memo, useRef } from 'react';
import shallowEqual from 'shallowequal';
import useStateManagement from '../useStateManagement';

export const TreeContext = React.createContext();

const ContextProvider = ({
    name = parseInt(1000 + Math.random() * 1000),
    Context,
    initialPropsMapper = (x) => x,
    derivedStateSyncers = [],
    effects = [],
}) => (Component) => memo((props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initialStateRef = useRef();

    if (!initialStateRef.current) {
        initialStateRef.current = initialPropsMapper(props);
    }

    const [context, setContext] = useStateManagement(initialStateRef.current, derivedStateSyncers, name);
    const prevStateRef = useRef({});
    const prevPropsRef = useRef({});
    const elementsCacheRef = useRef();
    effects.forEach((effect) => effect({ context, setContext }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        window.ReactWisteriaStores = window.ReactWisteriaStores || {};
        window.ReactWisteriaStores[name] = context;
    }, [context]);

    if (
        !shallowEqual(prevStateRef.current, { context, setContext }) ||
        !shallowEqual(prevPropsRef.current, props)
    ) {
        prevStateRef.current = { context, setContext };
        prevPropsRef.current = props;
        elementsCacheRef.current = (
            <TreeContext.Provider value={Context}>
                <Context.Provider value={{ context, setContext }}>
                    <Component {...props}/>
                </Context.Provider>
            </TreeContext.Provider>
        );
    }

    return elementsCacheRef.current;
});

export default ContextProvider;
