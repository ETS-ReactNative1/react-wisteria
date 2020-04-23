import React from 'react';
import ReactFpContext from '../../src';
import Display from './Display';
import Controls from './Controls';
import CounterContext from './context';
import './style.scss';

const Counter = () => {
    return (
        <div className="counter">
            <Display/>
            <Controls/>
        </div>
    );
};

export default ReactFpContext({
    Context: CounterContext
})(Counter);
