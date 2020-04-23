# React FP Context

**react-fp-context** is a library that wraps the React Context with a functional API that can make your life easier while getting/setting your state! only one way to get your state and one way to update it (no selectors/actions/reducers/types/connectors!)

## Background

The concept was kicked off when I was in one of the Hackathons in [Fiverr](https://github.com/fiverr) (The company I work in) where we started (Me & Igor Burshtein) coding a React project and we had only two days to finish the things! Two days that prevents us from creating (actions - selectors - reducers - types - connectors) files all over the place! We needed a fast and quick state management library... And BTW we won in the hackathon!

## Installation

```js
npm i react-fp-context
```

## Usage

This library expose only one thing which is a ContextProvider-like (A Higher Order Component) that we pass to it some configurations and the Root component we've in our app.

Suppose that we've a **RootComponent** and some **ChildComponent** (not necessary a direct child).. Let's talk about Counter application where we can increment/decrement a counter with the value being displayed.

![Apr-23-2020 11-48-06](https://user-images.githubusercontent.com/7091543/80079053-708b1200-8558-11ea-92d8-7756ac7d855e.gif)

Let's suppose that this application have 3 components (`Counter`/`Display`/`Controls`) whereas `<Display/>` and `<Controls/>` are the children of `<Counter/>` (The Root component of our app).

First step is to wrap our **root component** (Counter in this case) as so:

![image](https://user-images.githubusercontent.com/7091543/80080101-c9a77580-8559-11ea-8372-2d03156c5c5d.png)

You can see that we send over the context in the options object.

Now let's render our Root component first with its initial props (currently only the current counter value) as so:

![image](https://user-images.githubusercontent.com/7091543/80080315-21de7780-855a-11ea-93dd-af03d24decce.png)

Now children can reach the state easily (in here, we show the `<Display/>` component) and **this is the ONLY way to read state using react-fp-context**:

![image](https://user-images.githubusercontent.com/7091543/80080459-55b99d00-855a-11ea-9776-f7fbf23f6206.png)

So now our second child `<Controls/>` want to control the state so to control the state we can do as so:

![image](https://user-images.githubusercontent.com/7091543/80080862-dbd5e380-855a-11ea-9735-2402fba0d506.png)

**Pay attention:** That multiple `setContext` will be batched based on React setState batching with having only one render phase!

Until now, we can see that the Context we passed in into the options of the library has wrapped the values of the Root props and we can inspect the state by extracting `{ context }` and update it by extracting `{ setContext }`.

What if we need to map the Root props to a different structure of state? Pretty easy. We just pass another option (`initialPropsMapper`) as so:

![image](https://user-images.githubusercontent.com/7091543/80081841-27d55800-855c-11ea-9cf0-8818b761b64a.png)

if you console log your context you'll see that it received the new shape!

Updating nested paths is so easy since `react-fp-context` is using `lodash/fp` API behind the scene so the update should look something like this:

```js
setContext('mystate.count', 5);

// you can also create new paths that doesn't exist into your state exactly as we do it in lodash/fp:
// setContext('newValue', 5);
// setContext('newValue.nested.path.value', 5);
```

Another two major principles of `react-fp-context` is the handling of effects and derived states.

Let's suppose that we've an effect that alerts some message (or do a request to some service) on a specific condition (e.g. Once we hit 10 in the counter) then we need access to the `context` and `setContext` into our `effects` in order to inspect and respond with updates and we can do it as so:

![image](https://user-images.githubusercontent.com/7091543/80083626-7daaff80-855e-11ea-8a65-18134701a0b6.png)

We define our hook first and then we inject it into our options as so:

![image](https://user-images.githubusercontent.com/7091543/80083970-e6927780-855e-11ea-8e6b-96fcabee89dd.png)

Pay attention that our library will inject all these `effects` array with `({ context, setContext })` so we can do our best out there!

The next thing is the syncing of derived states.. See why we need derived state handling different than `effects` when we can use `effects` and get it done?!

I'm presenting the `effects` solution of syncing states and we'll discuss it later. I want to color the even numbers with blue and the odd numbers with red in the `<Display/>` component. (I know that you think that it can be computed in the render phase but I want to see it in another place so I need it into the state).

![Apr-23-2020 13-20-45](https://user-images.githubusercontent.com/7091543/80088505-4855e000-8565-11ea-8a07-54d71ad6f255.gif)

Have a look on the effect implementation below:

![image](https://user-images.githubusercontent.com/7091543/80084792-04141100-8560-11ea-9176-dd4bcd59d052.png)

That's really nice! whenever the count changes we update the color in the `useEffect`! But there's something missing in this implementation. Let's implement it in another way while consoling some logs!

See the implmentation below:

![image](https://user-images.githubusercontent.com/7091543/80085049-64a34e00-8560-11ea-92cd-de6157b6518b.png)

If we run this and click on some control **only once** we get these logs:

![image](https://user-images.githubusercontent.com/7091543/80085215-96b4b000-8560-11ea-9aaf-d846616db610.png)

Pay attention that we're rendering twice since the `count` got changed and the sync only starts in `useEffect` which means after the render phase (Unnecessary multiple renders) but that's not the toughest case! Pay attention that we got at some point in our effect unsynced state of number 1 being blue first and after that the sync comes which means that we can't be sure that our state is synced in our effects always which is bad and makes our life harder.

How we can solve this situation? Since we're syncing states and we don't do any Browser API (DOM Mutations/Async Operations) then we've another options to pass for derivedState syncing called `derivedStateSyncers`! First we define some function with the following decleration:

![image](https://user-images.githubusercontent.com/7091543/80085765-5e61a180-8561-11ea-96f8-554599fc9116.png)

This function receives the context, setContext, prevContext, force (boolean) and updates (exactly in the same way we did so far) the `color` based on changes in the `count`.

**Pay attention:** That you need to consider `force` in your equal operation since we run all the syncers at initial render with `force` as `true` where we send the context as the prevContext!

After that we define this syncer in our syncers list as so:

![image](https://user-images.githubusercontent.com/7091543/80086301-2c047400-8562-11ea-9ea5-074196ae358b.png)

Not only we get synced state at each point of time in our `effects` but we also have only one render (with the two changes - `count` and `color`) thanks to React setState batching.

One of the derived states I enjoyed is related to using [`fiverr/passable`](https://github.com/fiverr/passable) package (You're invited to see this adorable validation package!) to validate my state. I used then the `initialPropsMapper` in order to scope my state below `mystate` and then all my updates where below this `mystate` namespace and in my dervied state syncer I was only checking if the reference of `mystate` has been broken (changed) and if so then execute the validations again with passing the state! I don't really care how and where it got changed since `lodash/fp` backing this library break the parent reference upper to the change so I can distungish changes in upper levels without going into the details!
