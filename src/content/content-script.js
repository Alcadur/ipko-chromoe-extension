'use strict';

class ContentScript {
    lastPage = null;
    titleSelector = 'h1.TTPMB';
    pageChangeHandlerBind = this.pageChangeHandler.bind(this);

    /**
     * @param {Wait} wait
     * @param {Query} query
     * @param {ContentResolver} contentResolver
     */
    constructor(wait, query, contentResolver) {
        this.wait = wait;
        this.query = query;
        this.contentResolver = contentResolver;

        document.addEventListener('click', () => this.pageClickHandler());
        document.addEventListener('DOMContentLoaded ', this.pageChangeHandlerBind)
    }

    async pageClickHandler() {
        const trialLimit = 10;

        document.removeEventListener('click', this.pageChangeHandlerBind);
        try {
            await wait.for(this.titleSelector, trialLimit);
            this.pageChangeHandler();
        } catch (e) {
        }
        document.addEventListener('click', this.pageChangeHandlerBind);
    }

    pageChangeHandler() {
        const newPage = (this.query.one(this.titleSelector) || {}).innerText || '';
        if (newPage !== this.lastPage) {
            this.lastPage = newPage;
            this.contentResolver.updatePageContent(newPage);
        }
    }
}

/**
 * @returns {ContentScript}
 */
function contentScriptFactory() { return new ContentScript(waitFactory(), queryFactory(), contentResolverFactory())}

/**
 * @type {ContentScript}
 */
const contentScript = contentScriptFactory();
