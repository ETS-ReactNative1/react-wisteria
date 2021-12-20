import React from 'react';
import { useWisteriaStateSlice, useWisteriaStateUpdater } from '../../../src/useWisteriaState';
import { connect, useWisteriaStore } from '../../../src';
import './style.scss';

const Controls = ({ onAddition, onDecrement, onConsole }) => {
    return (
        <>
            <div className="controls">
                <div className="control" onClick={onAddition}>+</div>
                <div className="control" onClick={onDecrement}>-</div>
            </div>
            <h4 onClick={onConsole}>Alert other state value</h4>
        </>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const countx = useWisteriaStateSlice(store, 'countx');
    const setContext = useWisteriaStateUpdater(store);

    const onAddition = () => {
        setContext('count', (count) => count + 1)
    };

    const onDecrement = () => {
        setContext('count', (count) => count - 1)
    };

    const onConsole = () => {
        alert(countx);
    };

    return {
        onAddition,
        onDecrement,
        onConsole
    }
};

export default connect(useStateToProps)(Controls);
