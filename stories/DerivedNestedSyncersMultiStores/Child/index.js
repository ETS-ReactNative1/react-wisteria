import React from 'react';
import { connect, useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const Child = ({ a, b, c, d, setContext }) => {
    console.log('will render only once with all the state being synced');
    console.log({ context: JSON.stringify({ a, b, c, d }) });
  
    return (
      <div onClick={() => setContext('a', a => a + 1)}>
        <b>CLICK HERE</b> to change only the (a) value
      </div>
    );
  };
  
  const useStateToProps = () => {
    const store1 = useWisteriaStore('store1');
    const store2 = useWisteriaStore('store2');
    const store3 = useWisteriaStore('store3');
    const store4 = useWisteriaStore('store4');

    const a = useWisteriaStateSlice(store1, 'a');
    const b = useWisteriaStateSlice(store2, 'b');
    const c = useWisteriaStateSlice(store3, 'c');
    const d = useWisteriaStateSlice(store4, 'd');

    const setContext = useWisteriaStateUpdater(store1);

    return {
      a,
      b,
      c,
      d,
      setContext
    };
  };

  export default connect(useStateToProps)(Child);
  