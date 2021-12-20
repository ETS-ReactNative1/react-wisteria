import { useContext } from 'react';
import StoreContext from './context';

const useWisteriaStore = (storeName) => {
    if (typeof storeName !== 'string') {
        throw new Error(`useWisteriaStore expect a store name as string. Got ${storeName}`);
    }

    const stores = useContext(StoreContext);
    const store = stores[storeName];
    
    if (!store) {
        throw new Error(`Wisteria store with the name: ${storeName} doesn't exist`);
    }

    return store;
};

export default useWisteriaStore;
