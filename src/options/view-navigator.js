export class ViewNavigator {
    /**
     * @param {Query} query
     * @param {Location} location
     */
    constructor(query, location) {
        this.location = location;
        this.query = query;
    }

    /**
     * @param {(HTMLElement | string)} element
     * @param {string} view
     */
    moveToOnClick(element, view) {
        if (typeof element === 'string') {
            element = this.query.one(element);
        }

        element.addEventListener('click', () => {
            this.moveTo(view);
        });
    }

    /**
     * @param {string} view
     */
    moveTo(view) {
        this.location.hash = view;
    }
}

/**
 * @return {ViewNavigator}
 */
export function viewNavigatorFactory() { return new ViewNavigator(queryFactory(), location); }

/**
 * @type {function(): ViewNavigator}
 */
export const viewNavigatorProvider = providerGenerator(viewNavigatorFactory);
