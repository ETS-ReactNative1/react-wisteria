import React, { useRef } from 'react';
import StoreContext from './context';
import LogToWindow from './LogToWindow';

const Provider = ({
    name,
    store,
    effects = []
}) => {
    const effectsComponentsRef = useRef();
    if (!effectsComponentsRef.current) {
        effectsComponentsRef.current = effects.map((effect, idx) => {
            const Comp = () => {
                effect();
    
                return null;
            }
    
            Comp.displayName = `${idx + 1} - ${effect.name} (${name})`;
    
            return Comp;
        });
    }

    const EffectComponents = effectsComponentsRef.current;

    return (
        <>
            <LogToWindow store={store} name={name}/>
            {EffectComponents.map((Effect) => (
                <Effect key={Effect.displayName}/>
            ))}
        </>
    )
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
