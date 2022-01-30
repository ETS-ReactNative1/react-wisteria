import { useEffect } from 'react';
import { useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const useForth = () => {
    const myStore = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(myStore);
    const z = useWisteriaStateSlice(myStore, 'z');

    if (z === 1) {
        setContext('z', (z = 0) => z + 1);
        setContext('w', (w = 0) => w + 1);
    }

    useEffect(() => {
        setInterval(() => {
            setContext('someValueThatHooksDontReferTo', Math.random());
        }, 1000);
    }, [setContext]);
};

export default useForth;
