'use strict';

class ContentResolver {
    /**
     * @type {Map<string, function>}
     */
    pageTitleMap = (() => {
        const map = new Map();

        map.set('Odbiorcy', async () => {
            await this.wait.untilLoaderGone();
            await this.wait.for(this.tableSelector, 50);

            this.addDataCollectButton();
            this.recipientsListSearch.init();
        });

        return map;
    })();

    tableSelector = 'form ._3082t';

    /**
     * @param {Query} query
     * @param {Wait} wait
     * @param {CollectData} collectData
     * @param {RecipientsListSearch} recipientsListSearch
     */
    constructor(
        query,
        wait,
        collectData,
        recipientsListSearch
    ) {
        this.query = query;
        this.wait = wait;
        this.collectData = collectData;
        this.recipientsListSearch = recipientsListSearch;
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
        recipientsListSearchFactory()
    );
}

/**
 * @type {ContentResolver}
 */
const contentResolver = contentResolverFactory();
