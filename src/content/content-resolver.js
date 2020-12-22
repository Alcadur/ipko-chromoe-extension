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

        map.set('PotwierdźDodanie', async () => {
            await this.wait.untilLoaderGone();
            await this.wait.for(this.confirmRecipientAddingForm.submitButtonSelector)
            this.confirmRecipientAddingForm.init();
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
     * @param {ConfirmRecipientAddingForm} confirmRecipientAddingForm
     */
    constructor(
        query,
        wait,
        collectData,
        recipientsListSearch,
        paymentLiveRecipientSearch,
        confirmRecipientAddingForm
    ) {
        this.query = query;
        this.wait = wait;
        this.collectData = collectData;
        this.recipientsListSearch = recipientsListSearch;
        this.paymentLiveRecipientSearch = paymentLiveRecipientSearch;
        this.confirmRecipientAddingForm = confirmRecipientAddingForm;
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
        paymentLiveRecipientSearchFactory(),
        confirmRecipientAddingFormFactory()
    );
}

/**
 * @type {ContentResolver}
 */
const contentResolver = contentResolverFactory();
