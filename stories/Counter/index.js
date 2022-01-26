import React from 'react';
import { StoreProvider, useCreateStores } from '../../src';
import Display from './Display';
import Controls from './Controls';
import Strange from './Strange';
import './style.scss';

const PureOne = () => {
    console.log('re-render');

    return (
      <p>Pure One</p>
    )
};

const ConnectedCounter = (props) => {
    const stores = useCreateStores([{ name: 'my-store', initialState: props }]);

    return (
        <StoreProvider stores={stores}>
            <div className="counter">
                <Controls/>
                <Strange/>
                <PureOne/>
                <Display/>
            </div>
        </StoreProvider>
    );
};

export default ConnectedCounter;
