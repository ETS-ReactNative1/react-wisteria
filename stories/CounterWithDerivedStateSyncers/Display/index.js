import React from 'react';
import { connect, useWisteriaStateSlice, useWisteriaStore } from '../../../src';
import './style.scss';

const Display = ({ count, color }) => {
    console.log('rendered Display', { count, color });

    return (
        <div className="display" style={{ color }}>
            {count}
        </div>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const count = useWisteriaStateSlice(store, 'count');
    const color = useWisteriaStateSlice(store, 'color');

    return {
        count,
        color
    }
}

export default connect(useStateToProps)(Display);
