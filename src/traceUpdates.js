import { TOKEN_HASH } from 'golden-path';

const isInDebugMode = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (window.isWisteriaDebugModeForced) {
        return true;
    }

    const search = window?.location?.search || '';
    return search.includes('debugWisteria');
};

const traceUpdates = ({ name, path, value, isChanged }) => {
    if (!isInDebugMode()) { return; }

    const cleanPath = path.replace(new RegExp(TOKEN_HASH, 'g'), '');
    console.groupCollapsed(`%c react-wisteria :: ${name} setContext Path "${cleanPath}"`, `color:${isChanged ? '#1dbf73' : '#93a3b4'}`);
    console.log({ value });
    console.trace();
    console.groupEnd();
};

export default traceUpdates;
