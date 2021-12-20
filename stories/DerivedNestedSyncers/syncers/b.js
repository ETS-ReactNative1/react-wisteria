const derivedB = (stores) => {
    const { context, prevContext, setContext } = stores.get('my-store');
    const { b } = context;
    const { b: prevB } = prevContext;
  
    if (b === prevB) {
      return;
    }
  
    setContext('c', b + 1);
  };
  
  export default derivedB;
  