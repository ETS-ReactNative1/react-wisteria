import React, { createContext, useState, StrictMode } from 'react';
import { addDecorator } from '@storybook/react';

export const ParentContext = createContext();

const Parent = ({ children }) => {
    const [state, setState] = useState({ count: 1 });

    return (
        <ParentContext.Provider value={state}>
            <div>Parent Count: {state.count}</div>
            <button onClick={() => setState(({ count }) => ({ count: count + 1}))}>Increment</button>
            {children}
        </ParentContext.Provider>
    );
};

addDecorator((storyFn) => (
    <StrictMode>
        <Parent>
            {storyFn()}
        </Parent>
    </StrictMode>
));

window.isWisteriaDebugModeForced = true;
