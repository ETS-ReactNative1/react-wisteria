import React from 'react';
import { useCreateStores } from '../../src';
import Display from './Display';
import Controls from './Controls';
import blueOnEvenRedInOdd from './derivedStateSyncers/blueOnEvenRedInOdd';
import StoreProvider from '../../src/StoreProvider';
import './style.scss';

const derivedSyncers = [blueOnEvenRedInOdd];

const Counter = (props) => {
    const stores = useCreateStores([{ name: 'my-store', initialState: props, derivedStateSyncers: derivedSyncers }]);

    return (
        <StoreProvider stores={stores}>
            <div className="counter">
                <Display/>
                <Controls/>
            </div>
        </StoreProvider>
    );
};

export default Counter;

// export default Provider({
//     Context: CounterContext,
//     derivedStateSyncers: [blueOnEvenRedInOdd]
// })(Counter);
