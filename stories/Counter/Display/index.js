import React from 'react';
import CounterContext from '../context';
import './style.scss';

const Display = () => {
    const { context } = React.useContext(CounterContext);
    const { count } = context;

    return (
        <div className="display">
            {count}
        </div>
    )
};

export default Display;
