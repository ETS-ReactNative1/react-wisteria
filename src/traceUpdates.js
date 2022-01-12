import { get } from 'golden-path';
import { TOKEN_HASH } from 'golden-path';

const isInDebugMode = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    if (window.isWisteriaDebugModeForced) {
        return true;
    }

    const search = get('location.search', window) || '';
    return search.includes('debugWisteria');
};

const traceUpdates = ({ name, path, value }) => {
    if (!isInDebugMode()) { return; }

    const cleanPath = path.replace(new RegExp(TOKEN_HASH, 'g'), '');
    console.groupCollapsed(`%c react-wisteria :: ${name} setContext Path "${cleanPath}"`, 'color:#1dbf73');
    console.log({ value });
    console.trace();
    console.groupEnd();
};

export default traceUpdates;
