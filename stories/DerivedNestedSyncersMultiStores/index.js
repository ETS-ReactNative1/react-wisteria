import React from 'react';
import { StoreProvider, useCreateStores, useWisteriaStateSlice } from '../../src';
import Child from './Child';
import derivedA from './syncers/a';
import derivedB from './syncers/b';
import derivedC from './syncers/c';

const App = () => {
    const stores = useCreateStores([
        { name: 'store1', initialState: { a: 1 }, derivedStateSyncers: [derivedA] },
        { name: 'store2', initialState: { b: 0 }, derivedStateSyncers: [derivedB] },
        { name: 'store3', initialState: { c: 0 }, derivedStateSyncers: [derivedC] },
        { name: 'store4', initialState: { d: 0 }, derivedStateSyncers: [] },
    ]);

    const a = useWisteriaStateSlice(stores[0], 'a');
    const b = useWisteriaStateSlice(stores[1], 'b');
    const c = useWisteriaStateSlice(stores[2], 'c');
    const d = useWisteriaStateSlice(stores[3], 'd');

    return (
        <StoreProvider stores={stores}>
            <div className="App">
                <h1>
                    Derived rules:<br/>
                    b = a + 1;<br/>
                    c = b + 1;<br/>
                    d = c + 1;<br/>
                </h1>
                <h2>a: {a}</h2>
                <h2>b: {b}</h2>
                <h2>c: {c}</h2>
                <h2>d: {d}</h2>
                <Child/>
            </div>
        </StoreProvider>
      );
};

export default App;
