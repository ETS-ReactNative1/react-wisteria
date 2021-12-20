const blueOnEvenRedInOdd = (stores) => {
    const { context, setContext, prevContext } = stores.get('my-store');
    const { count } = context;
    const { count: prevCount } = prevContext;

    if (count === prevCount) { return; }

    setContext('color', count % 2 === 0 ? 'blue' : 'red');
};

export default blueOnEvenRedInOdd;
