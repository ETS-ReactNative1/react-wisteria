import { useEffect } from 'react';
import { useWisteriaState } from './useWisteriaState';

const LogToWindow = ({ store, name }) => {
    const { context, setContext } = useWisteriaState(store);

    useEffect(() => {
        window.ReactWisteriaStores = window.ReactWisteriaStores || {};
        window.ReactWisteriaStoresUpdaters = window.ReactWisteriaStoresUpdaters || {};
        window.ReactWisteriaStores[name] = context;
        window.ReactWisteriaStoresUpdaters[name] = setContext;

        return () => {
            window.ReactWisteriaStores[name] = null;
            window.ReactWisteriaStoresUpdaters[name] = null;
        }
    }, [context, name, setContext]);

    return null;
};

export default LogToWindow;
