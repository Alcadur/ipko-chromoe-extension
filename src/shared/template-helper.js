class TemplateHelper {

    constructor(query) {
        this.query = query;
    }

    /**
     * @param {string} selector
     * @param {HTMLElement} [parent = document.body]
     * @return {HTMLElement}
     */
    getFirstTemplateNode(selector, parent = document.body) {
        return /** @type HTMLElement */this.query.one(selector, parent)
            .content
            .firstElementChild
            .cloneNode(true);
    }
}

function templateHelperFactory() { return new TemplateHelper(queryFactory()) }
