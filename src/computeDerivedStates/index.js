import isInDebugMode from '../isInDebugMode';
import traceUpdates from '../traceUpdates';
import updater from '../updater';

const computeDerivedStates = ({ name, prevState, state, derivedStateSyncers, syncerStatus }) => {
    let newState = state;
    let updates = [];

    const _setContext = (syncer) => (path, value) => {
        if (syncerStatus.done) {
            console.error(`derived state syncer: "${syncer.name}" should be synchronous. Got asynchronous update for path: "${path}" with the value: ${value}`);
            return;
        }

        if (isInDebugMode()) {
            traceUpdates({ name, path, value });
        }

        updates.push({ path, value });
    };

    derivedStateSyncers.forEach((d) => d({
        context: state,
        prevContext: prevState,
        setContext: _setContext(d)
    }));

    updates.forEach(({ path, value }) => {
        newState = updater(path, value, newState);
    });

    return newState;
};

export default computeDerivedStates;
