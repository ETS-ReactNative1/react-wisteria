import { useEffect } from 'react';
import { useWisteriaState } from './useWisteriaState';

const Effects = ({ name, effects, store }) => {
    const { context, setContext } = useWisteriaState(store);

    effects.forEach((effect) => effect());

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

export default Effects;
