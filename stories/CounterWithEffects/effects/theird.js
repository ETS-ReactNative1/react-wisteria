import { useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const useThird = () => {
    const myStore = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(myStore);
    const y = useWisteriaStateSlice(myStore, 'y');

    if (y === 1) {
        setContext('y', (y = 0) => y + 1);
        setContext('z', (z = 0) => z + 1);
    }
};

export default useThird;
