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
