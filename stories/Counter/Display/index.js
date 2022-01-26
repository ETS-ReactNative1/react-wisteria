import React, { Profiler } from 'react';
import { range } from 'lodash';
import { connect, useWisteriaStore, useWisteriaStateSlice } from '../../../dist/es';
import './style.scss';

const callback = (id, phase, actualTime, baseTime, startTime, commitTime) => {
    console.log(`${id}'s ${phase} phase:`);
    console.log(`Actual time: ${actualTime}`);
    console.log(`Base time: ${baseTime}`);
    console.log(`Start time: ${startTime}`);
    console.log(`Commit time: ${commitTime}`);
};

const Display = ({ count }) => {
    return (
        <Profiler id="DisplayPerformance" onRender={callback}>
            <div className="display">
                <table>
                    {range(100).map((i) => (
                        <tr key={i}>
                            {range(100).map((j) => (
                                <td key={j}>{count}</td>
                            ))}
                        </tr>
                    ))}
                </table>
            </div>
        </Profiler>
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
