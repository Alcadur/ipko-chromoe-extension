import { viewManagerProvider } from './view-manager.js';

const viewManager = viewManagerProvider();

viewManager.load(location.hash.substring(1) || 'recipients');

window.addEventListener('hashchange', () => {
    const view = location.hash.substring(1);

    viewManager.load(view);

}, false)
