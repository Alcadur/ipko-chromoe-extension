'use strict';

import { RECIPIENTS_LIST } from '../../options-urls.js';

export class DashboardController {
    /**
     * @param {Query} query
     * @param {Location} location
     */
    constructor(query, location) {
        query.one('#recipients').addEventListener('click', () => {
            location.hash = RECIPIENTS_LIST();
        });
    }
}

export function dashboardControllerFactory() { return new DashboardController(
    queryFactory(),
    location
); }
