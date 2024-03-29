import { useRef } from 'react';
import traceUpdates from './traceUpdates';
import { update, clearPathResolverCache } from 'golden-path';

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

    const notifySubscribersIfStateWasChanged = (storeName, state, newState) => {
        if (state !== newState) {
            storesGroupSymbol[symbol][storeName]._subscriptions.forEach((s) => s());
        }
    };

    const setState = (path, value, notifySubscribers = true) => {
        const { state } = storesGroupSymbol[symbol][name].getSnapshot();
        const newState = update(path, value, state);
        traceUpdates({ path, value, name, isChanged: state !== newState });
        externalState = { state: newState, prevState: state, setState };

        if (notifySubscribers) {
            notifySubscribersIfStateWasChanged(name, state, newState);
        }

        return newState;
    };

    setState.batchUpdates = (updates) => {
        const { state } = storesGroupSymbol[symbol][name].getSnapshot();
        let newState = state;

        updates.forEach(([ path, value ]) => {
            newState = setState(path, value, false);
        });

        notifySubscribersIfStateWasChanged(name, state, newState, false);
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
    store._notifySubscribersIfStateWasChanged = notifySubscribersIfStateWasChanged;

    storesGroupSymbol[symbol][name] = store;
    return store;
};

export const useCreateStores = (storesConfig) => {
    const symbol = Symbol('Wisteria Stores Group');
    const storesGroupSymbolRef = useRef({});
    const storesRef = useRef();

    if (!storesRef.current) {
        clearPathResolverCache();
        storesRef.current = storesConfig
            .map(({ name, initialState = {}, effects = [], initialPropsMapper = (x) => x }) => ({
                name, initialState: initialPropsMapper(initialState), effects
            }))
            .map((opt) => createStore(storesGroupSymbolRef.current, { ...opt, symbol }));
    }

    return storesRef.current;
};
