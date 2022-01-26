import React from 'react';
import { connect, useWisteriaStateSlice, useWisteriaStore } from '../../../src';
import './style.scss';

const Display = ({ count, x, y, z, w }) => {
    return (
        <div className="display">
            {count}
            <ul>
                <li>
                    x: {x}
                </li>
                <li>
                    y: {y}
                </li>
                <li>
                    z: {z}
                </li>
                <li>
                    w: {w}
                </li>
            </ul>
        </div>
    )
};

const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const count = useWisteriaStateSlice(store, 'count');
    const x = useWisteriaStateSlice(store, 'x');
    const y = useWisteriaStateSlice(store, 'y');
    const z = useWisteriaStateSlice(store, 'z');
    const w = useWisteriaStateSlice(store, 'w');

    return {
        count,
        x,
        y,
        z,
        w
    };
};

export default connect(useStateToProps)(Display);
