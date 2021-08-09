# React Wisteria

**react-wisteria** is a library that wraps the [React Context](https://reactjs.org/docs/context.html) with the [Golden Path](https://github.com/Attrash-Islam/golden-path) Functional setter API that makes it easier to work with state. Get your state and update it without the need for selectors, actions, reducers, types, etc.

## Background

The idea arose during a Hackathon in [Fiverr](https://github.com/fiverr) (the company I work for) where @igor-burshtein and I had to develop a full React project over the course of just 2 days. With such a fast turnaround, there was no time to set up the usual structure with actions, selectors, reducers, etc, but we still found ourselves in need of a quick & easy way to manage state. And, so, enter this library.

(BTW we won in the Hackathon!)

## Wisteria

Wisteria is a genus of flowering plants in the legume family, Fabaceae, that includes ten species of woody climbing bines that are native to China.

![image](https://user-images.githubusercontent.com/7091543/82143581-9e106600-984d-11ea-9baf-426d1adf4174.png)


## Installation

```js
npm i react-wisteria --save
```

## Options
| **Option** | **Description** | **Default Value** |
| --- | --- | --- |
| **name** | A name to be shown for the store when debugging | *Required*
| **Context** | A React Context as the state container | *Required*
| **initialPropsMapper?** | A mapper to map the Root Component props to a different state shape | *_.identity*
| **hooks?** | Store hooks | *[]*

## Important Notice

React Context and useContext is often used to avoid prop drilling, however it's known that there's a performance issue. When a context value is changed, **all components that useContext** will re-render even those who consume a slice of the context that didn't changed. (react-redux maintainers have talked about this pain [in a big discussion](https://github.com/reduxjs/react-redux/issues/1177)).

React team have talked about introducing something called [Context Selectors](https://github.com/reactjs/rfcs/pull/119) to solve this issue where component only re-render if and only if the selector returns a different value of that slice. Unfortunately, this is something that will need a refactor in React infrastructure and a multi-month project.

Once the Context Selector proposal land we'll add Hooks as another way to get/update the state as well as keeping the `connect` for backward compatibility.

## Usage

This library exposes a ContextProvider-like HOC that can be passed configurations & the Root component we have in our app.

As an example, let's use a standard Counter application where we can increment/decrement a counter whilst the value is being displayed.

![Apr-23-2020 11-48-06](https://user-images.githubusercontent.com/7091543/80079053-708b1200-8558-11ea-92d8-7756ac7d855e.gif)

This application has 3 components (`Counter`, `Display` and `Controls`) with `<Display/>` and `<Controls/>` being the children of `<Counter/>` (the Root component of our app).

First step is to create the context:

```js
import React from 'react';

const CounterContext = React.createContext();
export default CounterContext;
```

then we wrap our **Root component** (`<Counter/>`) like this:

```js
import { Provider } from 'react-wisteria';
import CounterContext from './CounterContext';

const Counter = () => {
    return (
        <div className="counter">
            <Display/>
            <Controls/>
        </div>
    );
};

export default Provider({
    name: 'My Store',
    Context: CounterContext
})(Counter);
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
import { connect } from 'react-wisteria';

const Display = ({ count }) => {
    return (
        <div className="display">
            {count}
        </div>
    )
};

const useStateToProps = ({ context }) => ({
    count: context.count
});

export default connect(useStateToProps)(Display);
```

In our second child, `<Controls/>`, we want to update the state:

```js
import { connect } from 'react-wisteria';

const Controls = ({ onAddition, onDecrement }) => {
    return (
        <div className="controls">
            <div className="control" onClick={onAddition}>+</div>
            <div className="control" onClick={onDecrement}>-</div>
        </div>
    )
};

const useStateToProps = ({ context, setContext }) => {
    const { count } = context;

    // NOTE: All the inline functions MUST be wrapped with React.useCallback,
    // so we can take the benefit of `useMemo` that we use in order to not re-render unnecessary components.
    // without this, inline function will get reference on each render and our `connect` can't do the performance optimization
    const onAddition = React.useCallback(() => {
        setContext('count', count + 1);
    }, [setContext, count]);

    const onDecrement = React.useCallback(() => {
        setContext('count', count - 1);
    }, [setContext, count]);

    return {
        onAddition,
        onDecrement
    };
}

export default connect(useStateToProps)(Controls);
```

**Please note:** Multiple `setContext` calls will be batched based on React.setState batching whilst having only one render phase. Also, `setContext` is using [golden-path](https://github.com/Attrash-Islam/golden-path) syntax under the hood which means that you can update nested paths and arrays easily.

It's also important to rememeber to wrap dynamic data in the v function from golden-path.

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

## initialPropsMapper Option

But what if we need to map the Root props to a different state structure? Easy. We just pass another option (`initialPropsMapper`):

```js
import { Provider } from 'react-wisteria';
import CounterContext from './CounterContext';

const Counter = () => {
    return (
        <div className="counter">
            <Display/>
            <Controls/>
        </div>
    );
};

export default Provider({
    name: 'My Store',
    Context: CounterContext,
    initialPropsMapper: ({ count }) => ({ mystate: { count }})
})(Counter);

```

If you console log your Context, you'll see that it now received the new shape.

(We can even compare objects by referental equality (===) since updates break the reference in the changed object upto the upper parent reference, so we can distinguish changes in each level without having to do expensive diffing.)

## hooks Option

Let's say that we have to implement an effect that pops an alert message (or triggers a service request) if a specific condition is met (e.g. once the counter hits 10). In order to do this, we need access to `context` and `setContext` which allows us to inspect and respond with updates so since `alert` is a Browser API that can run in server env then we wrap it with `useEffect` (if you want to intercept the render so you can call `setContext` in sync way which will cause the Provider to render - Generally this is helpful for building data-relation on
the data level not inside higher abstractions):

```js
import React from 'react';

const useRequestReportOnTen = ({ context }) => {
    const { count } = context;

    React.useEffect(() => {
        if (count !== 10) { return; }

        alert('Got ten and sending to the backend!');
    }, [count]);
};

export default useRequestReportOnTen;
```

First we define our hook - then we inject it into our options:

```js
import { Provider } from 'react-wisteria';
import CounterContext from './CounterContext';

const Counter = () => {
    return (
        <div className="counter">
            <Display/>
            <Controls/>
        </div>
    );
};

export default Provider({
    name: 'My Store',
    Context: CounterContext,
    hooks: [useRequestReportOnTen]
})(Counter);
```

## debugging

You can debug and trace your state updates by adding to the url the `debugWisteria` query param, or by setting `window.isWisteriaDebugModeForced` to `true`, You can also inspect your stores state last value by using `window.ReactWisteriaStores`.

![image](https://user-images.githubusercontent.com/7091543/80594046-f6143380-8a2a-11ea-86ea-222984922cd7.png)
