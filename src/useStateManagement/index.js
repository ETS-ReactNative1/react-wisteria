import React from 'react';
import computeDerivedStates from '../computeDerivedStates';
import isInDebugMode from '../isInDebugMode';
import traceUpdates from '../traceUpdates';
import updater from '../updater';

/**
 * The state management core.
 *
 * @param initialState
 * @param derivedStateSyncers
 * @returns getter/setter to the context
 */
const useStateManagement = (initialState, derivedStateSyncers, name) => {
    const [state, setState] = React.useState(initialState);
    const [prevState, setPrevState] = React.useState({});

    const syncerStatus = {};
    syncerStatus.done = false;
    const syncedState = computeDerivedStates({ name, prevState, state, derivedStateSyncers, syncerStatus });
    syncerStatus.done = true;

    const doneSync = syncedState === state && state === prevState;

    if (!doneSync) {
        setState(syncedState);
        setPrevState(state);
    }

    const setContext = React.useCallback((path, value) => {
        if (isInDebugMode()) {
            traceUpdates({ name, path, value });
        }

        setState((state) => updater(path, value, state));
    }, [name]);

    return [state, setContext];
};

export default useStateManagement;
