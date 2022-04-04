# React Wisteria

**react-wisteria** is a library that utilize the [Golden Path](https://github.com/Attrash-Islam/golden-path) Functional setter API into a multiple state stores that makes it easier to work with state. Get your state and update it without the need for selectors, actions, reducers, types, etc.

## Wisteria

Wisteria is a genus of flowering plants in the legume family, Fabaceae, that includes ten species of woody climbing bines that are native to China.

![image](https://user-images.githubusercontent.com/7091543/82143581-9e106600-984d-11ea-9baf-426d1adf4174.png)


## Installation

```js
npm i react-wisteria --save
```

## Usage

Let's build a counter application

![Apr-23-2020 11-48-06](https://user-images.githubusercontent.com/7091543/80079053-708b1200-8558-11ea-92d8-7756ac7d855e.gif)

This application has 3 components (`Counter`, `Display` and `Controls`) with `<Display/>` and `<Controls/>` being the children of `<Counter/>` (the Root component of our app).

First we wrap our **Root component** (`<Counter/>`) like this:

```js
import { useCreateStore, StoreProvider } from 'react-wisteria';

const Counter = (props) => {
    // Here we create our global store. Wisteria goes with a "store per feature" way of doing things
    // because of that we've stores in the naming but one can create a single store and pass it.
    // All the stores creation should be in the higher level component (aka <App/>).
    const stores = useCreateStores([{ name: 'my-store', initialState: props }]);

    return (
        // Here we pass the store to the `StoreProvider`
        <StoreProvider stores={stores}>
            <div className="counter">
                <Display/>
                <Controls/>
            </div>
        </Provider>
    );
};

export default Counter;
```

As you can see, the context is being sent to Provider as part of its options.

Let us now render our Root component with its initial props (only the current counter value):

```js
export const CounterAt_0 = () => {
    return (<Counter count={0}/>);
};
```

The `<Display/>` component, which is a child of Root, can now reach the state easily.

```js
import { connect, useWisteriaStore, useWisteriaStateSlice } from 'react-wisteria';

const Display = ({ count }) => {
    return (
        <div className="display">
            {count}
        </div>
    )
};

const useStateToProps = () => {
    const myStore = useWisteriaStore('my-store'); // Worth using constants so you can track dependencies between stores easily.

    // Passing only one param will get the whole context but it's not preferred due to performance issues.
    // Also you can do a deep access to properties (e.g. count.value.a) - The component will render only if this deep path has changed.
    const count = useWisteriaStateSlice(myStore, 'count');

    return {
        count
    }
};

export default connect(useStateToProps)(Display);
```

In our second child, `<Controls/>`, we want to update the state:

```js
import { connect, useWisteriaStore, useWisteriaStateUpdater } from 'react-wisteria';

const Controls = ({ onAddition, onDecrement }) => {
    return (
        <div className="controls">
            <div className="control" onClick={onAddition}>+</div>
            <div className="control" onClick={onDecrement}>-</div>
        </div>
    )
};

const useStateToProps = () => {
    const myStore = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(myStore);

    const onAddition = () => {
        setContext('count', (count) => count + 1);
    };

    const onDecrement = () => {
        setContext('count', (count) => count - 1);
    };

    return {
        onAddition,
        onDecrement
    };
}

export default connect(useStateToProps)(Controls);
```

**Please note:** Multiple `setContext` calls will be batched based on React.setState batching whilst having only one render phase. Still you can use setContext.batchUpdates in order to queue multiple updates like this:

```js
setContext.batchUpdates([
    ['firstPath', 'x'],
    ['secondPath', 'y']
]);
```

We've another hook that can perform batch updates on **multiple** stores as well and it's called `useWisteriaBatchUpdater` and we can use it as so:

```js
import { useWisteriaBatchUpdater } from 'react-wisteria';

const useStateToProps = () => {
    const batchUpdater = useWisteriaBatchUpdater();

    const onClick = () => {
        batchUpdater([
            ['first-store', 'count', 100],
            ['second-store', 'count', 200]
        ]);
    };

    return {
        onClick
    };
}

```

Also, `setContext` is using [golden-path](https://github.com/Attrash-Islam/golden-path) syntax under the hood which means that you can update nested paths and arrays easily.

It's also important to remember to wrap dynamic data in the v function from golden-path in case it might have special tokens that might break the Golden Path parser.

```js
import { v } from 'golden-path';

setContext('name', 'newName');
setContext(`peoples.0.id`, 12);
setContext(`peoples[id=1].name`, 'person name with id=1');
setContext(`peoples[name="Alex"]`, { name: 'Alex2' });

// For dynamic data it's recommended to wrap with v() in order to not break the parser.
// Same are relevant to decimal point as well (e.g. 2.2)
const nameFromServer = '[]&4%45.';
setContext(`peoples[name="${v(nameFromServer)}"].age`, 20);

// Greedy path to update all males
setContext(`peoples*[sex="male"].isMale`, true);

// Multiple condition - Not greedy (first match)
setContext(`peoples[id=1][age>=20]`, {});

// Multiple condition - Greedy (All matches)
setContext(`peoples*[id=1][age>=20].kind`, true);
```

Up until now, we can see that the Context we passed into the options of the library has wrapped the values of the Root props and we can inspect the state by extracting `{ context }` and update it by extracting `{ setContext }`.

(We can even compare objects by referential equality (===) since updates break the reference in the changed object up to the upper parent reference, so we can distinguish changes in each level without having to do expensive diffing.)

## effects Option

There are two other major principles of `react-wisteria` - the handling of effects and derived states.

Let's say that we have an effect (General browsers API related stuff) that pops an alert message (or triggers a service request) if a specific condition is met (e.g. once the counter hits 10). In order to do this, we need access to `context` and `setContext` in our `effects` which allows us to inspect and respond with updates:

```js
import React from 'react';

const useRequestReportOnTen = () => {
    const myStore = useWisteriaStore('my-store');
    const count = useWisteriaStateSlice(myStore, 'count');

    React.useEffect(() => {
        if (count !== 10) { return; }

        alert('Got ten and sending to the backend!');
    }, [count]);
};

export default useRequestReportOnTen;
```

First we define our hook - then we inject it into our options:

```js
import { StoreProvider, useCreateStores } from 'react-wisteria';

const Counter = (props) => {
    const stores = useCreateStores([{ name: 'my-store', initialState: props, effects: [useRequestReportOnTen] }]);

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
```

## debugging

You can debug and trace your state updates by adding to the url the `?debugWisteria` query param, or by setting `window.isWisteriaDebugModeForced` to `true`, You can also inspect your stores state last value by using `window.ReactWisteriaStores` and update them by using `window.ReactWisteriaStoresUpdaters`.

Doing `?debugWisteria=changed` will console only real updates with different value than the current one, with only `?debugWisteria` you might see unchanged updates and this might spam your console.

![image](https://user-images.githubusercontent.com/7091543/80594046-f6143380-8a2a-11ea-86ea-222984922cd7.png)
