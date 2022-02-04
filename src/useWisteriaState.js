import { get } from 'golden-path';
import { useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import StoreContext from './context';

export const useWisteriaState = (store) => {
    const {
        state: context,
        setState: setContext,
        prevState: prevContext
    } = useSyncExternalStore(store.subscribe, store.getSnapshot);
    return { context, setContext, prevContext };
};

export const useWisteriaStateSlice = (store, select = '') => {
    const selector = typeof select === 'string' ? get(select) : select;
    const stateSlice = useSyncExternalStore(store.subscribe, () => selector(store.getSnapshot().state));
    return stateSlice;
};

export const useWisteriaStateUpdater = (store) => {
    const setState = useSyncExternalStore(store.subscribe, () => store.getSnapshot().setState);
    return setState;
};

export const useWisteriaBatchUpdater = () => {
    const stores = useContext(StoreContext);

    return (updates) => {
        const storesAfterUpdates = updates.reduce((acc, [ name, path, value ]) => {
            const store = stores[name];

            if (!acc[name]) {
                acc[name] = {
                    name,
                    state: store.getSnapshot().state
                };
            }

            const setState = store.getSnapshot().setState;
            acc[name].newState = setState(path, value, false, false);

            if (acc[name].newState !== acc[name].state) {
                acc[name].changed = true;
            }

            acc[name]._notifySubscribersIfStateWasChanged = store._notifySubscribersIfStateWasChanged;

            return acc;
        }, {});

        Object.values(storesAfterUpdates).forEach(({ name, state, newState, changed, _notifySubscribersIfStateWasChanged }) => {
            if (!changed) { return; }

            _notifySubscribersIfStateWasChanged(name, state, newState);
        });
    };
};
