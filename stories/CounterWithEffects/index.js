import React from 'react';
import { StoreProvider, useCreateStores } from '../../src';
import Display from './Display';
import Controls from './Controls';
import useRequestReportOnTen from './effects/useRequestReportOnTen';
import useFirst from './effects/first';
import useSecond from './effects/second';
import useThird from './effects/theird';
import useForth from './effects/fourth';
import './style.scss';

const effects = [useRequestReportOnTen, useFirst, useSecond, useThird, useForth];

const Counter = (props) => {
    const stores = useCreateStores([{ name: 'my-store', initialState: props, effects: effects }]);

    return (
        <StoreProvider stores={stores}>
            <div className="counter">
                <Display/>
                <Controls/>
            </div>
        </StoreProvider>
    );
};

export default Counter;
