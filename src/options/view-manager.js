/**
 * @typedef Fetch
 * @function
 * @param {Request|string} input
 * @param {RequestInit} [init]
 */

export class ViewManager {
    /** @private */VIEW_DIR = 'views'
    /** @private */USE_SCRIPTS_COMMEND = '<!--include scripts-->';

    /**
     * @param {Fetch} fetch
     * @param {Query} query
     */
    constructor(fetch, query) {
        /** @private @type Fetch*/
        this.fetch = fetch;
        /** @private @type Query */
        this.query = query;
    }

    /**
     *
     * @param {string} viewName
     * @param {string} [htmlContainerSelector]
     * @param {string} [scriptsContainerSelector]
     * @return {Promise<string> | Promise<void>}
     */
    load(viewName, { htmlContainerSelector = '#viewContainer', scriptsContainerSelector = '#scripts' } = {
        htmlContainerSelector: '#viewContainer', scriptsContainerSelector: '#scripts'
    }) {
        return this.fetchTemplate(viewName).then((htmlString) => {
            this.query.one(htmlContainerSelector).innerHTML = htmlString;

            if (htmlString.split('\n')[0] === this.USE_SCRIPTS_COMMEND) {
                this.fetchScripts(viewName, scriptsContainerSelector);
            }
        });
    }

    /**
     * @private
     * @param {string} viewName
     * @return {Promise<string>}
     */
    fetchTemplate(viewName) {
        return this.fetch(`${this.VIEW_DIR}/${viewName}/template.html`)
            .then(response => response.text());
    }

    /**
     * @private
     * @param {string} viewName
     * @param {string} scriptContainerSelector
     */
    fetchScripts(viewName, scriptContainerSelector) {
        const scriptPath = `${this.VIEW_DIR}/${viewName}/scripts.js`;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptPath;

        const container = this.query.one(scriptContainerSelector);
        container.innerHTML = '';
        container.appendChild(script);
    }
}

/**
 * @type ViewManager
 */
export function viewManagerFactory() {
    return new ViewManager(fetch.bind(window), queryFactory());
}

export const viewManagerProvider = (function () {
    /**
     * @type {ViewManager}
     */
    let instance = null;

    return () => {
        if (!instance) {
            instance = viewManagerFactory();
        }

        return instance;
    };
})();
