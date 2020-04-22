import React from 'react';
import identity from 'lodash/identity';
import useStateManagement from './useStateManagement';

const ContextProvider = ({
    Context,
    initialPropsMapper = identity,
    derivedStateSyncers = [],
    hooks = []
}) => (Component) => (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [context, setContext] = useStateManagement(initialPropsMapper(props), derivedStateSyncers);
    hooks.forEach((h) => h({ context, setContext }));

    return (
        <Context.Provider value={{ context, setContext }}>
            <Component {...props}/>
        </Context.Provider>
    );
};

export default ContextProvider;
