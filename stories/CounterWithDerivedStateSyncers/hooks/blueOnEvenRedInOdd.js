import { useContext, useState } from 'react';
import { ParentContext } from '../../decorator';

const useBlueOnEvenRedInOdd = ({ setContext }) => {
    const { count } = useContext(ParentContext);
    const [prevState, setPrevState] = useState({});

    if (count === prevState.count) { return; }

    setContext('color', count % 2 === 0 ? 'blue' : 'red');
    setPrevState({ count });
};

export default useBlueOnEvenRedInOdd;
