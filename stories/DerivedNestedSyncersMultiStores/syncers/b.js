const derivedB = (stores) => {
    const { context, prevContext } = stores.get('store2');
    const { setContext } = stores.get('store3');
    const { b } = context;
    const { b: prevB } = prevContext;
  
    if (b === prevB) {
      return;
    }
  
    setContext('c', b + 1);
  };
  
  export default derivedB;
  