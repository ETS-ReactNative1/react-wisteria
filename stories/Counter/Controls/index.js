import React from 'react';
import { useWisteriaStateSlice, connect, useWisteriaStore, useWisteriaBatchUpdater } from '../../../src';
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
    const batchUpdater = useWisteriaBatchUpdater();
    // const setContext = useWisteriaStateUpdater(store);

    const onAddition = () => {
        batchUpdater([
            ['my-store', 'count', (count) => count + 1],
            ['my-store', 'count', (count) => count + 1],
            ['my-store', 'somethingElse', Math.random()]
        ]);
    };

    const onDecrement = () => {
        batchUpdater([
            ['my-store', 'count', (count) => count - 1],
            ['my-store', 'somethingElse', Math.random()]
        ]);
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
