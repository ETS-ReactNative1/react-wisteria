const derivedA = ({ context, prevContext, force, setContext }) => {
    const { a } = context;
    const { a: prevA } = prevContext;
  
    if (a === prevA && !force) {
      return;
    }
  
    setContext("b", a + 1);
  };
  
  export default derivedA;
  