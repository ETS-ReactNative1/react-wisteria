import React, { useEffect } from 'react';
import { useWisteriaState } from './useWisteriaState';
import StoreContext from './context';

const LogToWindow = ({ store, name }) => {
    const { context, setContext } = useWisteriaState(store);

    useEffect(() => {
        window.ReactWisteriaStores = window.ReactWisteriaStores || {};
        window.ReactWisteriaStoresUpdaters = window.ReactWisteriaStoresUpdaters || {};
        window.ReactWisteriaStores[name] = context;
        window.ReactWisteriaStoresUpdaters[name] = setContext;

        return () => {
            window.ReactWisteriaStores[name] = null;
            window.ReactWisteriaStoresUpdaters[name] = null;
        }
    }, [context, name, setContext]);

    return null;
};

const Provider = ({
    name,
    store,
    effects = []
}) => {
  
    const EffectComponents = effects.map((effect, idx) => {
        const Comp = () => {
            effect();

            return null;
        }

        Comp.displayName = `${idx + 1} - ${effect.name} (${name})`;

        return Comp;
    });

    return (
        <>
            {EffectComponents.map((Effect) => (
                <Effect key={Effect.displayName}/>
            ))}
            <LogToWindow name={name} store={store}/>
        </>
    );
}

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
