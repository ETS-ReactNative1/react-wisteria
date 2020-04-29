import React from 'react';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import isFunction from 'lodash/fp/isFunction';
import computeDerivedStates from './computeDerivedStates';
import traceUpdates from './traceUpdates';

/**
 * The state management core.
 * We use functional lodash in order to identify easily if any changes happened at any level in the state
 * and to do an easier way of updating the state.
 *
 * @param initialState
 * @param derivedStateSyncers
 * @returns getter/setter to the context
 */
const useStateManagement = (initialState, derivedStateSyncers, debug) => {
    const [state, setState] = React.useState(initialState);
    const [initState, setInitState] = React.useState(true);

    const setContext = React.useCallback((path, value) => {
        if (debug) {
            traceUpdates({ path, value });
        }

        const updateFunction = isFunction(value) ? update : set;

        setState((state) => {
            const newState = updateFunction(path, value, state);
            const stateAfterDerived = computeDerivedStates({ prevState: state, state: newState, derivedStateSyncers, debug });
            return stateAfterDerived;
        });
    }, [derivedStateSyncers, debug]);

    if (initState) {
        const stateAfterDerived = computeDerivedStates({ prevState: {}, state, derivedStateSyncers, debug });
        setState(stateAfterDerived);
        setInitState(false);
    }

    return [state, setContext];
};

export default useStateManagement;
