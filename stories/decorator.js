import React from 'react';
import { addDecorator } from '@storybook/react';

export const ParentContext = React.createContext();

const Parent = ({ children }) => {
    const [state, setState] = React.useState({ count: 1 });

    return (
        <ParentContext.Provider value={state}>
            <div>Parent Count: {state.count}</div>
            <button onClick={() => setState(({ count }) => ({ count: count + 1}))}>Increment</button>
            {children}
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
