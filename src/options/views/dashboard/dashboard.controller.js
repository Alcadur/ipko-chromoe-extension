'use strict';

import { RECIPIENTS_LIST } from '../../options-urls.js';
import { viewNavigatorProvider } from '../../view-navigator.js';

export class DashboardController {
    /**
     * @param {ViewNavigator} viewNavigator
     */
    constructor(viewNavigator) {
        viewNavigator.moveToOnClick('#recipients', RECIPIENTS_LIST());
    }
}

export function dashboardControllerFactory() { return new DashboardController(
    viewNavigatorProvider(),
); }
