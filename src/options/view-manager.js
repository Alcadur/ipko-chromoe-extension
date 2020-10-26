/**
 * @typedef Fetch
 * @function
 * @param {Request|string} input
 * @param {RequestInit} [init]
 */

/**
 * @typedef DynamicUrl
 * @property {RegExp} urlPattern
 * @property {String} url
 * @property {[{name: String, index: Number}]} variables
 */

export class ViewManager {
    /** @private */VIEW_DIR = 'views'
    /** @private */USE_SCRIPTS_COMMEND = '<!--include scripts-->';
    /** @private
     * @type DynamicUrl[]*/dynamicUrls = []

    /**
     * @param {Fetch} fetch
     * @param {Query} query
     */
    constructor(fetch, query) {
        /** @private
         * @type Fetch*/
        this.fetch = fetch;
        /** @private
         * @type Query */
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
        const templatePath = this.getTemplatePath(viewName);
        return this.fetchTemplate(templatePath).then((htmlString) => {
            this.query.one(htmlContainerSelector).innerHTML = htmlString;

            if (htmlString.split('\n')[0] === this.USE_SCRIPTS_COMMEND) {
                this.fetchScripts(templatePath, scriptsContainerSelector);
            }
        });
    }

    /**
     * @private
     * @param {String} viewName
     * @return {String}
     */
    getTemplatePath(viewName) {
        const dynamicUrl = this.findDynamicUrl(viewName);

        return !!dynamicUrl ? dynamicUrl.url : viewName;
    }

    /**
     * @private
     * @param {String} viewName
     * @return {DynamicUrl|null}
     */
    findDynamicUrl(viewName) {
        return this.dynamicUrls.find(dynamicUrl => dynamicUrl.urlPattern.test(viewName));
    }

    /**
     * @param {string} viewName
     * @return {Promise<string>}
     */
    fetchTemplate(viewName) {
        const templatePath = `${this.VIEW_DIR}/${viewName}/template.html`.replace(/\/\//g, '/');
        return this.fetch(templatePath)
            .then(response => response.text());
    }

    /**
     * @private
     * @param {string} viewName
     * @param {string} scriptContainerSelector
     */
    fetchScripts(viewName, scriptContainerSelector) {
        const scriptPath = `${this.VIEW_DIR}/${viewName}/scripts.js?${Date.now()}`;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptPath;

        const container = this.query.one(scriptContainerSelector);
        container.innerHTML = '';
        container.appendChild(script);
    }

    /**
     * @param {String} urlPattern
     */
    addDynamicUrlPattern(urlPattern) {
        const urlPartsWithVariables = urlPattern.split('/');
        const urlParts = [];
        const variablesPosition = [];
        let regexString = '';
        urlPartsWithVariables.forEach((urlPart, index) => {
            if (urlPart.substr(0, 1) === '$') {
                variablesPosition.push({ name: urlPart.substr(1), index });
                regexString += '.+\/';
            } else {
                urlParts.push(urlPart);
                regexString += urlPart + '\/';
            }
        });
        regexString += '?';

        this.dynamicUrls.push({
            urlPattern: new RegExp(regexString),
            url: urlParts.join('/'),
            variables: variablesPosition
        });
    }

    /**
     * @return {*}
     */
    getPathVariables() {
        const path = location.hash.substr(1);
        const pathParts = path.split('/')
        const matchDynamicUrl = this.findDynamicUrl(path);
        const variables = {};
        matchDynamicUrl.variables.forEach(variableInfo => variables[variableInfo.name] = decodeURI(pathParts[variableInfo.index]));

        return variables;
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
