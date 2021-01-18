import { viewManagerProvider } from './view-manager.js';
import { DASHBOARD, EDIT_RECIPIENT } from './options-urls.js';

const DEFAULT_VIEW = DASHBOARD();
const viewManager = viewManagerProvider();

viewManager.addDynamicUrlPattern(EDIT_RECIPIENT.pattern);

viewManager.load(location.hash.substring(1) || DEFAULT_VIEW);

window.addEventListener('hashchange', () => {
    const view = location.hash.substring(1) || DEFAULT_VIEW;

    viewManager.load(view);
}, false)
