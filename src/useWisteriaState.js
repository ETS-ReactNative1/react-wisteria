import { get } from 'golden-path';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

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

export const useWisteriaPrevStateSlice = (store, select = '') => {
    const selector = typeof select === 'string' ? get(select) : select;
    const stateSlice = useSyncExternalStore(store.subscribe, () => selector(store.getSnapshot().prevState));
    return stateSlice;
};

export const useWisteriaStateUpdater = (store) => {
    const setState = useSyncExternalStore(store.subscribe, () => store.getSnapshot().setState);
    return setState;
};
