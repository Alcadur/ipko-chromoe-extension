import { viewManagerProvider } from './view-manager.js';
import { EDIT_RECIPIENT, RECIPIENTS_LIST } from './options-urls.js';

const viewManager = viewManagerProvider();

viewManager.addDynamicUrlPattern(EDIT_RECIPIENT.pattern);

viewManager.load(location.hash.substring(1) || RECIPIENTS_LIST());

window.addEventListener('hashchange', () => {
    const view = location.hash.substring(1);

    viewManager.load(view);

}, false)
