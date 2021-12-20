const derivedC = (stores) => {
    const { context, prevContext, setContext } = stores.get('my-store');
    const { c } = context;
    const { c: prevC } = prevContext;
  
    if (c === prevC) {
      return;
    }
  
    setContext('d', c + 1);
  };
  
  export default derivedC;
  