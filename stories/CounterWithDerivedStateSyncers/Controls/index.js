import React from 'react';
import { connect, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';
import './style.scss';

const Controls = ({ onAddition, onDecrement }) => {
    return (
        <div className="controls">
            <div className="control" onClick={onAddition}>+</div>
            <div className="control" onClick={onDecrement}>-</div>
        </div>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(store);

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
};

export default connect(useStateToProps)(Controls);
