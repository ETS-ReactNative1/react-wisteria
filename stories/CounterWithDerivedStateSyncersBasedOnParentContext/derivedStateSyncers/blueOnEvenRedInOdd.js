import React from 'react';
import { ParentContext } from '../../decorator';

const useBlueOnEvenRedInOdd = ({ setContext }) => {
    const { count } = React.useContext(ParentContext);

    setContext('color', count % 2 === 0 ? 'blue' : 'red');
};

export default useBlueOnEvenRedInOdd;
