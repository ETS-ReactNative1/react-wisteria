import React from 'react';
import { useWisteriaStore } from '../../../src';
import connect from '../../../src/connect';
import { useWisteriaStateSlice, useWisteriaStateUpdater } from '../../../src/useWisteriaState';

const Strange = ({ countx, onClick }) => {
    return (
        <button onClick={onClick}>
            Update some value that Table do not refer to - current: {countx}
        </button>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const countx = useWisteriaStateSlice(store, 'countx');
    const setContext = useWisteriaStateUpdater(store);

    const onClick = () => {
        setContext('countx', 'id: ' + Math.random());
    };

    return {
        countx,
        onClick
    }
};

export default connect(useStateToProps)(Strange);
