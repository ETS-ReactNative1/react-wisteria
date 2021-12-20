const derivedA = (stores) => {
    const { context, prevContext } = stores.get('store1');
    const { setContext } = stores.get('store2');

    const { a } = context;
    const { a: prevA } = prevContext;
  
    if (a === prevA) {
      return;
    }
  
    setContext('b', a + 1);
  };
  
  export default derivedA;
  