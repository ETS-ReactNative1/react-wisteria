import React from 'react';
import Counter from '.';

export default { title: 'Basic' };

export const CounterAt_0 = () => {
    return (<Counter count={0}/>);
};

export const CounterAt_10 = () => {
    return (<Counter count={10}/>);
};
