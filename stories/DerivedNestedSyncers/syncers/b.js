const derivedB = ({ context, prevContext, force, setContext }) => {
    const { b } = context;
    const { b: prevB } = prevContext;
  
    if (b === prevB && !force) {
      return;
    }
  
    setContext("c", b + 1);
  };
  
  export default derivedB;
  