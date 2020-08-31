'use strict';

class ContentResolver {
    /**
     * @type {Map<string, function>}
     */
    pageTitleMap = (() => {
        const map = new Map();

        map.set('OdbiorcyKrajowi', async () => {
            await this.wait.untilLoaderGone();
            await this.wait.for(this.tableSelector, 50);

            this.addDataCollectButton();
            this.recipientsListSearch.init();
        });

        map.set('PrzelewyKrajowy', async () => {
            await this.wait.untilLoaderGone();
            await this.wait.for(this.paymentLiveRecipientSearch.searchInputSelector, 50);
            await this.paymentLiveRecipientSearch.init();
        });

        return map;
    })();

    tableSelector = 'form ._3082t';

    /**
     * @param {Query} query
     * @param {Wait} wait
     * @param {CollectData} collectData
     * @param {RecipientsListSearch} recipientsListSearch
     * @param {PaymentLiveRecipientSearch} paymentLiveRecipientSearch
     */
    constructor(
        query,
        wait,
        collectData,
        recipientsListSearch,
        paymentLiveRecipientSearch
    ) {
        this.query = query;
        this.wait = wait;
        this.collectData = collectData;
        this.recipientsListSearch = recipientsListSearch;
        this.paymentLiveRecipientSearch = paymentLiveRecipientSearch;
    }

    updatePageContent(pageTitle) {
        (this.pageTitleMap.get(pageTitle) || function () {})();
    }

    addDataCollectButton() {
        const node = this.query.one(this.tableSelector);
        const collectButton = this.createCollectButton();
        const newRow = this.createNewRow();
        newRow.appendChild(collectButton);

        this.insertNewRowOnTop(node, newRow);
    }

    createCollectButton() {
        const iconUrl = chrome.runtime.getURL('resources/user-add-icon.png');
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = `<img class="icon" src="${iconUrl}" alt="Collect users icon">Zbierz dane odbiorców`;
        button.addEventListener('click', () => this.collectData.collect())

        return button;
    }

    createNewRow() {
        const newRow = document.createElement('div');
        newRow.classList.add('_3CHZ5');
        newRow.classList.add('icon-container');

        return newRow;
    }

    insertNewRowOnTop(node, newRow) {
        const firstChild = node.querySelector(':first-child');
        node.insertBefore(newRow, firstChild);
    }
}

/**
 * @returns {ContentResolver}
 */
function contentResolverFactory() {
    return new ContentResolver(
        queryFactory(),
        waitFactory(),
        collectDataFactory(),
        recipientsListSearchFactory(),
        paymentLiveRecipientSearchFactory()
    );
}

/**
 * @type {ContentResolver}
 */
const contentResolver = contentResolverFactory();
