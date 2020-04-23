const blueOnEvenRedInOdd = ({ context, prevContext, setContext, force }) => {
    const { count } = context;
    const { count: prevCount } = prevContext;

    if (count === prevCount && !force) { return; }

    setContext('color', count % 2 === 0 ? 'blue' : 'red');
};

export default blueOnEvenRedInOdd;
