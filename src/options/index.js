import { viewManagerProvider } from './view-manager.js';

const viewManager = viewManagerProvider();

viewManager.load('recipients');
