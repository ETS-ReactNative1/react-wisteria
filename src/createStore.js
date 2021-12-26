import { useRef } from 'react';
import traceUpdates from './traceUpdates';
import { update } from 'golden-path';

export const StoresSymbols = {};

const MAX_STACK_DEEP_COUNT = 100;

const INFINITE_UPDATES_ERROR_MSG = `One of your derivedStateSyncers is infinitely calling setContext. Reached Max limit: ${MAX_STACK_DEEP_COUNT}.
Pass the "debugWisteria" query param to the url in order to see the state updates.`;

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

    const setState = (path, value, isInitialRender, stackDeep = 0) => {
        if (stackDeep === 1000) {
            throw new Error(INFINITE_UPDATES_ERROR_MSG);
        }

        traceUpdates({ path, value, name });

        const { state } = StoresSymbols[symbol][name].getSnapshot();
        const newState = update(path, value, state);

        if (state !== newState || isInitialRender) {
            externalState = { state: newState, prevState: isInitialRender ? {} : state, setState };
            StoresSymbols[symbol][name].dirty = true;

            let updates = [];
            let trackDeps = [];

            const stores = {
                get: (name) => {
                    trackDeps.push(name);
                    const s = StoresSymbols[symbol][name];
                    const { state: context, prevState: prevContext } = s.getSnapshot();

                    return {
                        context,
                        prevContext,
                        setContext: (path, value) => {
                            traceUpdates({ path, value, name });
                            updates.push([name, path, value]);
                        }
                    }
                }
            }

            updates = [];

            Object.values(StoresSymbols[symbol]).forEach((store) => {
                store._options.derivedStateSyncers.forEach((d) => {
                    trackDeps = [];
                    if (!d._storesDeps || d._storesDeps.includes(name)) {
                        d(stores);
                    }

                    if (!d._storesDeps) {
                        d._storesDeps = trackDeps;
                    }
                });
            });

            externalState = { state: newState, prevState: newState, setState };

            updates.forEach(([ name, path, value ]) => {
                const { setState } = StoresSymbols[symbol][name].getSnapshot();
                setState(path, value, false, stackDeep + 1);
            });

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
            .map(({ name, initialState = {}, derivedStateSyncers = [], effects = [], initialPropsMapper = (x) => x }) => ({
                name, initialState: initialPropsMapper(initialState), derivedStateSyncers, effects
            }))
            .map((opt) => createStore({ ...opt, symbol }));
        storesRef.current.forEach((store) => {
            const { setState } = store.getSnapshot();
            setState('', (v) => v, true);
        });
    }

    return storesRef.current;
};
