const traceUpdates = ({ path, value }) => {
    console.groupCollapsed(`%c react-fp-context::setContext Path "${path}"`, 'color:#1dbf73');
    console.log({ value });
    console.trace();
    console.groupEnd();
};

export default traceUpdates;
