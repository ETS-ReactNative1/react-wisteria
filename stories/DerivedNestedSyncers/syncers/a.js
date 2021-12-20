const derivedA = (stores) => {
    const { context, prevContext, setContext } = stores.get('my-store');
    const { a } = context;
    const { a: prevA } = prevContext;
  
    if (a === prevA) {
      return;
    }
  
    setContext('b', a + 1);
  };
  
  export default derivedA;
  