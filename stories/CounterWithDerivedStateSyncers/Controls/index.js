import React, { useCallback } from 'react';
import { connect } from '../../../src';
import './style.scss';

const Controls = ({ onAddition, onDecrement }) => {
    return (
        <div className="controls">
            <div className="control" onClick={onAddition}>+</div>
            <div className="control" onClick={onDecrement}>-</div>
        </div>
    )
};

const useStateToProps = ({ context, setContext }) => {
    const { count } = context;

    const onAddition = useCallback(() => {
        setContext('count', count + 1);
    }, [setContext, count]);

    const onDecrement = useCallback(() => {
        setContext('count', count - 1);
    }, [setContext, count]);


    return {
        onAddition,
        onDecrement
    };
};

export default connect(useStateToProps)(Controls);
