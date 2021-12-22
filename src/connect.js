import React, { memo } from 'react';

const connect = (useStateToProps) => (Component) => memo((ownProps) => {
    const connectProps = useStateToProps(ownProps);

    // Merge connect props with ownProps.
    const props = {
        ...ownProps,
        ...connectProps
    };

    return <Component {...props}/>;
});

export default connect;
