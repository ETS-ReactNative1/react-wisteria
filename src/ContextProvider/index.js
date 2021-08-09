import React, { useEffect, memo, useRef, useState, createContext } from 'react';
import shallowEqual from 'shallowequal';
import useStateManagement from '../useStateManagement';

export const TreeContext = createContext();

const ContextProvider = ({
    name = parseInt(1000 + Math.random() * 1000),
    Context,
    initialPropsMapper = (x) => x,
    hooks = [],
}) => (Component) => memo((props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const initialStateRef = useRef();
    if (!initialStateRef.current) {
        initialStateRef.current = initialPropsMapper(props);
    }

    const [context, setContext] = useStateManagement(initialStateRef.current, name);
    const [prevState, setPrevState] = useState({ context: {} });
    const prevPropsRef = useRef({});
    const elementsCacheRef = useRef();
    hooks.forEach((hook) => hook({ context, setContext, prevContext: prevState.context }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        window.ReactWisteriaStores = window.ReactWisteriaStores || {};
        window.ReactWisteriaStores[name] = context;

        return () => {
            window.ReactWisteriaStores[name] = undefined;
        }
    }, [context]);

    if (
        !shallowEqual(prevState, { context, setContext }) ||
        !shallowEqual(prevPropsRef.current, props)
    ) {
        setPrevState({ context, setContext });
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
