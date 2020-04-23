import React from 'react';
import ContextProvider from '../../src';
import CounterContext from './context';
import Display from './Display';
import Controls from './Controls';
import blueOnEvenRedInOdd from './derivedStateSyncers/blueOnEvenRedInOdd';
import './style.scss';

const Counter = () => {

    return (
        <div className="counter">
            <Display/>
            <Controls/>
        </div>
    );
};

export default ContextProvider({
    Context: CounterContext,
    derivedStateSyncers: [blueOnEvenRedInOdd]
})(Counter);
