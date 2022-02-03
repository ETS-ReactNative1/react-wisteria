import { useRef } from 'react';
import traceUpdates from './traceUpdates';
import { update } from 'golden-path';

export const createStore = (storesGroupSymbol, options) => {
    const { initialState, name, symbol } = options;

    if (!name) {
        throw new Error('"name" is required option for Wisteria Store');
    }

    if (!storesGroupSymbol[symbol]) {
        storesGroupSymbol[symbol] = {};
    }

    if (storesGroupSymbol[symbol][name]) {
        throw new Error(`"${name}" was already assigned for another store`);
    }

    const _subscriptions = [];

    const notifySubscribersIfRelevant = (state, newState, isInitialRender) => {
        if (state !== newState || isInitialRender) {
            externalState = { state: newState, prevState: isInitialRender ? {} : state, setState };
            storesGroupSymbol[symbol][name].dirty = true;

            Object.values(storesGroupSymbol[symbol]).forEach((store) => {
                if (store.dirty) {
                    store._subscriptions.forEach((s) => s());
                    store.dirty = false;
                }
            });
        }
    };

    const setState = (path, value, isInitialRender) => {
        traceUpdates({ path, value, name });
        const { state } = storesGroupSymbol[symbol][name].getSnapshot();
        const newState = update(path, value, state);
        notifySubscribersIfRelevant(state, newState, isInitialRender);
    };

    setState.batchUpdates = (updates) => {
        const { state } = storesGroupSymbol[symbol][name].getSnapshot();
        let newState = state;

        updates.forEach(([ path, value ]) => {
            traceUpdates({ path, value, name });
            newState = update(path, value, newState);
        });

        notifySubscribersIfRelevant(state, newState, false);
    };

    let externalState = { state: initialState, prevState: {}, setState };

    const getSnapshot = () => externalState;

    const subscribe = (cb) => {
        _subscriptions.push(cb);

        return () => {
            const index = _subscriptions.indexOf(cb);
            _subscriptions.splice(index, 1);
        }
    }

    // API for useSyncExternalStore
    const store = {
        subscribe,
        getSnapshot
    };

    store._options = options;
    store._subscriptions = _subscriptions;

    storesGroupSymbol[symbol][name] = store;
    return store;
};

export const useCreateStores = (storesConfig) => {
    const symbol = Symbol('Wisteria Stores Group');
    const storesGroupSymbolRef = useRef({});
    const storesRef = useRef();

    if (!storesRef.current) {
        storesRef.current = storesConfig
            .map(({ name, initialState = {}, effects = [], initialPropsMapper = (x) => x }) => ({
                name, initialState: initialPropsMapper(initialState), effects
            }))
            .map((opt) => createStore(storesGroupSymbolRef.current, { ...opt, symbol }));
        storesRef.current.forEach((store) => {
            const { setState } = store.getSnapshot();
            setState('', (v) => v, true);
        });
    }

    return storesRef.current;
};
