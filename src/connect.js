import React, { useRef } from 'react';
import shallowEqual from 'shallowequal';

const connect = (useStateToProps) => (Component) => (ownProps) => {
    const prevPropsRef = useRef({});
    const elementsCacheRef = useRef();
    const connectProps = useStateToProps(ownProps);

    // Merge connect props with ownProps.
    const props = {
        ...ownProps,
        ...connectProps
    };

    if (!shallowEqual(prevPropsRef.current, props)) {
        prevPropsRef.current = props;
        elementsCacheRef.current = (
            <Component {...props}/>
        );
    }

    return elementsCacheRef.current;
};

export default connect;
