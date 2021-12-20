import React from 'react';
import { connect, useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const Child = ({ context, setContext }) => {
    console.log('will render only once with all the state being synced');
    console.log({ context: JSON.stringify(context) });
  
    return (
      <div onClick={() => setContext('a', a => a + 1)}>
        <b>CLICK HERE</b> to change only the (a) value
      </div>
    );
  };
  
  const useStateToProps = () => {
    const store = useWisteriaStore('my-store');
    const context = useWisteriaStateSlice(store);
    const setContext = useWisteriaStateUpdater(store);

    return {
      context,
      setContext
    };
  };

  export default connect(useStateToProps)(Child);
  