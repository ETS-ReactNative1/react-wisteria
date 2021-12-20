const derivedC = (stores) => {
    console.log('derivedC called');
    const { context, prevContext } = stores.get('store3');
    const { setContext } = stores.get('store4');
    const { c } = context;
    const { c: prevC } = prevContext;
  
    if (c === prevC) {
      return;
    }
  
    setContext('d', c + 1);
  };
  
  export default derivedC;
  