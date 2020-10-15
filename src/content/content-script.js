'use strict';

/**
 * @typedef {Object} PopupMessage
 * @property {string} actionName
 * @property {[]} args
 */

class ContentScript {
    /** @type {string|null} */lastPage = null;
    titleSelector = 'h1.TTPMB';
    selectedTabSelector = '._15ytj';

    /**
     * @param {Wait} wait
     * @param {Query} query
     * @param {ContentResolver} contentResolver
     * @param {CollectData} collectData
     * @param {MessageService} messageService
     */
    constructor(
        wait,
        query,
        contentResolver,
        collectData,
        messageService
    ) {
        this.wait = wait;
        this.query = query;
        this.contentResolver = contentResolver;

        document.addEventListener('click', () => this.pageClickHandler().then());
        messageService.addMessageActionListener(MessageActionType.getRecipients, () => { collectData.collect().then(); })
        messageService.addMessageActionListener(MessageActionType.getLastPage, (responder) => responder(this.lastPage))
    }

    async pageClickHandler() {
        const trialLimit = 10;
        try {
            await this.wait.for(this.titleSelector, trialLimit);
        } catch (e) {
        } finally {
            await this.wait.untilLoaderGone();
            this.pageChangeHandler();
        }
    }

    /**
     * @private
     */
    pageChangeHandler() {
        const emptyElement = { innerText: '' };
        const newTab = (this.query.one(this.selectedTabSelector) || emptyElement).innerText || '';
        const newPage = ((this.query.one(this.titleSelector) || emptyElement).innerText + newTab) || '' ;

        if (newPage !== this.lastPage) {
            this.lastPage = newPage;
            this.contentResolver.updatePageContent(newPage);
        }
    }
}

/**
 * @returns {ContentScript}
 */
function contentScriptFactory() { return new ContentScript(waitFactory(), queryFactory(), contentResolverFactory(), collectDataFactory(), messageServiceFactory())}

/**
 * @type {ContentScript}
 */
const contentScript = contentScriptFactory();
