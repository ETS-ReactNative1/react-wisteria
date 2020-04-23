import React from 'react';
import CounterContext from '../context';
import './style.scss';

const Controls = () => {
    const { setContext } = React.useContext(CounterContext);

    const onAddition = () => {
        setContext('count', (count) => count + 1);

        // We can also do it as so:
        // const { context, setContext } = React.useContext(CounterContext);
        // const { count } = context;
        // setContext('count', count + 1);
    };

    const onDecrement = () => {
        setContext('count', (count) => count - 1);
    };

    return (
        <div className="controls">
            <div className="control" onClick={onAddition}>+</div>
            <div className="control" onClick={onDecrement}>-</div>
        </div>
    )
};

export default Controls;
