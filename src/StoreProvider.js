import React from 'react';
import Effects from './Effects';
import StoreContext from './context';

const Provider = ({
    name,
    store,
    effects = []
}) => (
    <Effects name={name}
        store={store}
        effects={effects}/>
);

const StoreProvider = ({ children, stores }) => {
    if (!Array.isArray(stores)) {
        throw new Error(`<StoreProvider> component expect 'stores' prop as an array`);
    }

    const storesHash = stores.reduce((acc, current) => {
        const { _options: { name } } = current;

        acc[name] = current;
        return acc;
    }, {});

    return (
        <StoreContext.Provider value={storesHash}>
            {stores.map((store) => (
                <Provider key={store.name} store={store} {...store._options}/>
            ))}
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;
