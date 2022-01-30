import { useWisteriaStateSlice, useWisteriaStateUpdater, useWisteriaStore } from '../../../src';

const useFirst = () => {
    console.log('hook useFirst was called');
    const myStore = useWisteriaStore('my-store');
    const setContext = useWisteriaStateUpdater(myStore);
    const count = useWisteriaStateSlice(myStore, 'count');

    if (count === 2) {
        setContext('count', (count = 0) => count + 1);
        setContext('x', (x = 0) => x + 1);
    }
};

export default useFirst;
