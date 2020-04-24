const derivedC = ({ context, prevContext, force, setContext }) => {
    const { c } = context;
    const { c: prevC } = prevContext;
  
    if (c === prevC && !force) {
      return;
    }
  
    setContext("d", c + 1);
  };
  
  export default derivedC;
  