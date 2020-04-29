import isFunction from 'lodash/fp/isFunction';
import update from 'lodash/fp/update';
import set from 'lodash/fp/set';
import traceUpdates from './traceUpdates';

const computeDerivedStates = ({ prevState, state, derivedStateSyncers, debug }) => {
    let lastCurrentState = state;
    let lastPrevState = prevState;
    let updates = [];

    const _setContext = (path, value) => {
        if (debug) {
            traceUpdates({ path, value });
        }

        updates.push({ path, value });
    };

    do {
        updates = [];

        derivedStateSyncers.forEach((d) => d({
            context: lastCurrentState,
            prevContext: lastPrevState,
            setContext: _setContext
        }));

        let stateBeforeUpdates = lastCurrentState;

        updates.forEach(({ path, value }) => {
            const updateFunction = isFunction(value) ? update : set;
            lastCurrentState = updateFunction(path, value, lastCurrentState);
        });

        lastPrevState = stateBeforeUpdates;
    } while(updates.length > 0);

    return lastCurrentState;
};

export default computeDerivedStates;
