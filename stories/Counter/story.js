import React from 'react';
import Counter from '.';

export default { title: 'Counter Example' };

export const CounterAt0 = () => {
    return (<Counter count={0}/>);
};

export const CounterAt10 = () => {
    return (<Counter count={10}/>);
};
