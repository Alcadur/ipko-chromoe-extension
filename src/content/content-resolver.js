class ContentResolver {
    pageTitleMap = {
        'Odbiorcy': this.addDataCollectButton
    }
    tableSelector = 'form ._3082t';

    /**
     * @param {Query} query
     * @param {Wait} wait
     * @param {CollectData} collectData
     */
    constructor(query, wait, collectData) {
        this.query = query;
        this.wait = wait;
        this.collectData = collectData;
    }

    updatePageContent(pageTitle) {
        (this.pageTitleMap[pageTitle] || function () {})();
    }

    async addDataCollectButton() {
        await this.wait.untilLoaderGone();
        await this.wait.for(this.tableSelector, 50);
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
        button.addEventListener('click', this.collectData.collect)

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
function contentResolverFactory() { return new ContentResolver(queryFactory(), waitFactory(), collectDataFactory()); }

/**
 * @type {ContentResolver}
 */
const contentResolver = contentResolverFactory();
