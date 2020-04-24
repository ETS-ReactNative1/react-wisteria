import React from 'react';
import ReactFpContext from '../../src';
import NestedRelationContext from './context';
import Child from './Child';
import derivedA from './syncers/a';
import derivedB from './syncers/b';
import derivedC from './syncers/c';

const App = () => {
    const { context } = React.useContext(NestedRelationContext);

    return (
        <div className="App">
            <h1>a: {context.a}</h1>
            <h1>b: {context.b}</h1>
            <h1>c: {context.c}</h1>
            <h1>d: {context.d}</h1>
            <Child/>
      </div>
      );
};

export default ReactFpContext({
    Context: NestedRelationContext,
    derivedStateSyncers: [derivedA, derivedB, derivedC]
})(App);
