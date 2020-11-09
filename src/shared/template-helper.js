class TemplateHelper {

    constructor(query) {
        this.query = query;
    }

    /**
     * @param {string} selector
     * @param {Element} [parent = document.body]
     * @return {Element}
     */
    getFirstTemplateNode(selector, parent = document.body) {
        return /** @type {Element} */this.query.one(selector, parent)
            .content
            .firstElementChild
            .cloneNode(true);
    }
}

function templateHelperFactory() { return new TemplateHelper(queryFactory()) }
