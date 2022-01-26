import { useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const useSecond = () => {
    const myStore = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(myStore);
    const x = useWisteriaStateSlice(myStore, 'x');

    if (x === 1) {
        setContext('x', (x = 0) => x + 1);
        setContext('y', (y = 0) => y + 1);
    }
};

export default useSecond;
