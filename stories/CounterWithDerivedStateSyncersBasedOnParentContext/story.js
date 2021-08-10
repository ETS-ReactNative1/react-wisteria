import React from 'react';
import Counter from '.';

export default { title: 'Counter With Derived State Syncers based on Parent Context - blue on even, red on odd' };

export const Default = () => {
    return (<Counter count={0}/>);
};
