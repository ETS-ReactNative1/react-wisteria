import React from 'react';
import { StoreProvider, useCreateStores, useWisteriaStateSlice } from '../../src';
import Child from './Child';
import derivedA from './syncers/a';
import derivedB from './syncers/b';
import derivedC from './syncers/c';

const derivedStateSyncers = [derivedA, derivedB, derivedC];

const App = (props) => {
    const stores = useCreateStores([{ name: 'my-store', initialState: props, derivedStateSyncers: derivedStateSyncers }]);
    const context = useWisteriaStateSlice(stores[0]);

    return (
        <StoreProvider stores={stores}>
            <div className="App">
                <h1>
                    Derived rules:<br/>
                    b = a + 1;<br/>
                    c = b + 1;<br/>
                    d = c + 1;<br/>
                </h1>
                <h2>a: {context.a}</h2>
                <h2>b: {context.b}</h2>
                <h2>c: {context.c}</h2>
                <h2>d: {context.d}</h2>
                <Child/>
            </div>
        </StoreProvider>
      );
};

export default App;
