import React from 'react';
import ReactWisteriaProvider from '../../src';
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

export default ReactWisteriaProvider({
    Context: CounterContext,
    effects: [useRequestReportOnTen]
})(Counter);
