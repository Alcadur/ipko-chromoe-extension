import { viewManagerProvider } from '../../../view-manager.js';

const viewManager = viewManagerProvider();
console.log('path variables', viewManager.getPathVariables());
