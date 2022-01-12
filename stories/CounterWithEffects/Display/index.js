import React from 'react';
import { connect, useWisteriaStateSlice, useWisteriaStore } from '../../../dist/es';
import './style.scss';

const Display = ({ count }) => {
    return (
        <div className="display">
            {count}
        </div>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const count = useWisteriaStateSlice(store, 'count');

    return {
        count
    };
};

export default connect(useStateToProps)(Display);
