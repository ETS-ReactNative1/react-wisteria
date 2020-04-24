import React from 'react';
import CounterContext from '../context';
import './style.scss';

const Display = () => {
    const { context } = React.useContext(CounterContext);
    const { count, color } = context;

    console.log('rendered Display', { count, color });

    return (
        <div className="display" style={{ color }}>
            {count}
        </div>
    )
};

export default Display;
