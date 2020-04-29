import React from 'react';
import NestedRelationContext from '../context';

const Child = () => {
    const { context, setContext } = React.useContext(NestedRelationContext);
    console.log('will render only once with all the state being synced');
    console.log({ context: JSON.stringify(context) });
  
    return (
      <div onClick={() => setContext('a', a => a + 1)}>
        <b>CLICK HERE</b> to change only the (a) value
      </div>
    );
  };
  
  export default Child;
  