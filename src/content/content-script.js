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
        const topMenuPaymentButtonSelector = '.QcltV [data-text="Płatności"]';
        const recipientListButtonSelector = '[href="#INT_RECIPIENTS_NORMAL"]';

        document.addEventListener('click', () => this.pageClickHandler().then());
        messageService.addMessageActionListener(MessageActionType.getRecipients, () => {
            if (this.lastPage === 'OdbiorcyKrajowi') {
                return collectData.collect();
            }

            this.query.one(topMenuPaymentButtonSelector).click();
            this.wait.for(recipientListButtonSelector)
                .then(
                    /** @type {HTMLElement} */
                    (recipientListButton) => recipientListButton.click()
                )
                .then(() => collectData.collect())
        });
        messageService.addMessageActionListener(MessageActionType.getLastPage, (responder) => responder(this.lastPage));
        messageService.addMessageActionListener(MessageActionType.isGetRecipientFinished, (responder) => responder(!collectData.isWorking()));
        messageService.addMessageActionListener(MessageActionType.isLoggedIn, (responder) => responder(!!this.query.one(topMenuPaymentButtonSelector)));

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
        const newTab = this.getInnerTextAsPascalCase(this.selectedTabSelector);
        const newPage = this.getInnerTextAsPascalCase(this.titleSelector) + newTab;

        if (newPage !== this.lastPage) {
            this.lastPage = newPage;
            this.contentResolver.updatePageContent(newPage);
        }
    }

    /**
     * @private
     * @param {string} selector
     * @return {string}
     */
    getInnerTextAsPascalCase(selector) {
        const emptyElement = { innerText: '' };
        const text = (this.query.one(selector) || emptyElement).innerText;

        if(!text) {
            return '';
        }

        return text.split(' ')
            .map(variable => {
                const firstLetter = variable.substr(0, 1).toUpperCase();
                return firstLetter + variable.substr(1);
            })
            .join('');
    }
}

/**
 * @returns {ContentScript}
 */
function contentScriptFactory() {
    return new ContentScript(waitFactory(), queryFactory(), contentResolverFactory(), collectDataFactory(), messageServiceFactory())
}

/**
 * @type {ContentScript}
 */
const contentScript = contentScriptFactory();
