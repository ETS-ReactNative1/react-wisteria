import React from 'react';
import { useWisteriaStateSlice, useWisteriaStore } from '../../../src';

const useRequestReportOnTen = () => {
    const myStore = useWisteriaStore('my-store');
    const count = useWisteriaStateSlice(myStore, 'count');

    React.useEffect(() => {
        if (count !== 10) { return; }

        alert('Got ten and sending to the backend!');
    }, [count]);
};

export default useRequestReportOnTen;
