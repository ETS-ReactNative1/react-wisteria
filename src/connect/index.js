import React, { useRef, useContext } from 'react';
import shallowEqual from 'shallowequal';
import { TreeContext } from '../ContextProvider';

export const CONNECT_WITHOUT_PROVIDER_ERROR_MSG = 'Are you trying to use ReactWisteria\'s connect() without a Provider?';

const connect = (useStateToProps) => (Component) => (ownProps) => {
    const prevPropsRef = useRef({});
    const cachedElementsRef = useRef();
    const Context = useContext(TreeContext);

    if (!Context) {
        throw new Error(CONNECT_WITHOUT_PROVIDER_ERROR_MSG);
    }

    const { context, setContext } = useContext(Context);
    const connectProps = useStateToProps({ context, setContext }, ownProps);

    // Merge connect props with ownProps.
    const props = {
        ...ownProps,
        ...connectProps
    };

    // Check if the props is not identical to the memoized props in order to force update
    // and to update the memo to recent props.
    if (!shallowEqual(props, prevPropsRef.current) || !cachedElementsRef.current) {
        prevPropsRef.current = props;
        cachedElementsRef.current = <Component {...props}/>;
    }

    return cachedElementsRef.current;
};

export default connect;
