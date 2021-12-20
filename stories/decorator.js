import React from 'react';
import { addDecorator } from '@storybook/react';

export const ParentContext = React.createContext();

const Parent = ({ children }) => {
    const [state, setState] = React.useState({ count: 1 });
    const [toggled, setToggled] = React.useState(true);

    return (
        <ParentContext.Provider value={state}>
            <button onClick={() => setToggled((x) => !x)}>Toggle Wisteria</button>
            <div>Parent Count: {state.count}</div>
            <button onClick={() => setState(({ count }) => ({ count: count + 1}))}>Increment</button>
            {toggled ? children : null}
        </ParentContext.Provider>
    );
};

addDecorator((storyFn) => (
    <React.StrictMode>
        <Parent>
            {storyFn()}
        </Parent>
    </React.StrictMode>
));

window.isWisteriaDebugModeForced = true;
