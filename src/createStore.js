import { useRef } from 'react';
import traceUpdates from './traceUpdates';
import { update } from 'golden-path';

export const StoresSymbols = {};

export const createStore = (options) => {
    const { initialState, name, symbol } = options;

    if (!name) {
        throw new Error('"name" is required option for Wisteria Store');
    }

    if (!StoresSymbols[symbol]) {
        StoresSymbols[symbol] = {};
    }

    if (StoresSymbols[symbol][name]) {
        throw new Error(`"${name}" was already assigned for another store`);
    }

    const _subscriptions = [];

    const setState = (path, value, isInitialRender) => {
        traceUpdates({ path, value, name });

        const { state } = StoresSymbols[symbol][name].getSnapshot();
        const newState = update(path, value, state);

        if (state !== newState || isInitialRender) {
            externalState = { state: newState, prevState: isInitialRender ? {} : state, setState };
            StoresSymbols[symbol][name].dirty = true;

            Object.values(StoresSymbols[symbol]).forEach((store) => {
                if (store.dirty) {
                    store._subscriptions.forEach((s) => s());
                    store.dirty = false;
                }
            });
        }
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

    StoresSymbols[symbol][name] = store;
    return store;
};

export const useCreateStores = (storesConfig) => {
    const symbol = Symbol('Wisteria Stores Group');
    const storesRef = useRef();

    if (!storesRef.current) {
        storesRef.current = storesConfig
            .map(({ name, initialState = {}, effects = [], initialPropsMapper = (x) => x }) => ({
                name, initialState: initialPropsMapper(initialState), effects
            }))
            .map((opt) => createStore({ ...opt, symbol }));
        storesRef.current.forEach((store) => {
            const { setState } = store.getSnapshot();
            setState('', (v) => v, true);
        });
    }

    return storesRef.current;
};
