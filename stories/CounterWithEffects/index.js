import React from 'react';
import ReactFpContext from '../../src';
import CounterContext from './context';
import Display from './Display';
import Controls from './Controls';
import useRequestReportOnTen from './effects/useRequestReportOnTen';
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
    Context: CounterContext,
    effects: [useRequestReportOnTen]
})(Counter);
