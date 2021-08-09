import { useEffect } from 'react';

const useRequestReportOnTen = ({ context }) => {
    const { count } = context;

    useEffect(() => {
        if (count !== 10) { return; }

        alert('Got ten and sending to the backend!');
    }, [count]);
};

export default useRequestReportOnTen;
