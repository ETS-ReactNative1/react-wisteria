import React from 'react';

const connect = (useStateToProps) => (Component) => (ownProps) => {
    const connectProps = useStateToProps(ownProps);

    // Merge connect props with ownProps.
    const props = {
        ...ownProps,
        ...connectProps
    };

    return (
        <Component {...props}/>
    );
};

export default connect;
