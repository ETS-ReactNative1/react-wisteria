import { useState, useCallback } from 'react';
import isInDebugMode from '../isInDebugMode';
import traceUpdates from '../traceUpdates';
import updater from '../updater';

/**
 * The state management core.
 *
 * @param initialState
 * @returns getter/setter to the context
 */
const useStateManagement = (initialState, name) => {
    const [state, setState] = useState(initialState);

    const setContext = useCallback((path, value) => {
        if (isInDebugMode()) {
            traceUpdates({ name, path, value });
        }

        setState((state) => {
            const newState = updater(path, value, state);
            return newState;
        });
    }, [name]);

    return [state, setContext];
};

export default useStateManagement;
