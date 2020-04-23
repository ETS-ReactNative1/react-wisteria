import React from 'react';

const useBlueOnEvenRedOnOdd = ({ context, setContext }) => {
    const { count, color } = context;

    // This code below can totally replaced with:
    //
    // React.useEffect(() => {
    //     setContext('color', count % 2 === 0 ? 'blue' : 'red');
    // }, [count, setContext]);
    //
    // But I want to console.log the unsynced state that we've at some point in effects.
    React.useEffect(() => {
        console.log({ count, color });
        const newColor = count % 2 === 0 ? 'blue' : 'red';

        if (newColor === color) { return; }

        setContext('color', newColor);
    }, [count, setContext, color]);
};

export default useBlueOnEvenRedOnOdd;
