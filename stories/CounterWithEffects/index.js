import React from 'react';
import { StoreProvider, useCreateStores } from '../../dist/es';
import Display from './Display';
import Controls from './Controls';
import useRequestReportOnTen from './effects/useRequestReportOnTen';
import './style.scss';

const effects = [useRequestReportOnTen];

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
