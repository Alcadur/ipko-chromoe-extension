/**
 * @typedef {Object} Recipient
 * @property {(string|number)} fromNumber
 * @property {string} recipient
 * @property {(number|string)} recipientNumber
 * @property {string} title
 */
class CollectData {
    recipients = [];
    listTableSelector = '.iwUhV';
    detailsPageCheckSelector = '.TTPMB';
    layerClassName = 'collect-data-layer';
    layerSelector = `.${this.layerClassName}`;

    currentRowIndex = 0;
    numberOfRecipients
    isLayerOpen = false;

    /**
     * @param {Query} query
     * @param {Storage} storage
     * @param {Wait} wait
     */
    constructor(query, storage, wait) {
        this.query = query;
        this.storage = storage;
        this.wait = wait;
    }

    async collect() {
        this.numberOfRecipients = this.query.all(this.listTableSelector + ' tr').length;
        if (!this.isLayerOpen) {
            this.openLayer();
        }
        this.updateLayerInfo();
        await this.getData(this.currentRowIndex);
        await this.backToList();
        if (this.hasNext()) {
            await this.collect();
        } else {
            await this.storage.saveRecipients(this.recipients);
            this.closeLayer();
            this.currentRowIndex = 0;
            // TODO: remove before release
            this.storage.getRecipients().then((i) => console.log('recipeints', i));
        }
    }

    openLayer() {
        const layer = document.createElement('div');
        layer.classList.add(this.layerClassName);
        layer.innerHTML = `<div class="layer-content">Pobrano <span class="collected-data-number">-1</span> z ${this.numberOfRecipients}</div>`

        document.body.appendChild(layer);
        this.isLayerOpen = true;
    }

    closeLayer() {
        this.query.one(this.layerSelector).remove();
        this.isLayerOpen = false;
    }

    updateLayerInfo() {
        this.query.one(`${this.layerSelector} .collected-data-number`).textContent = this.currentRowIndex;
    }

    async getData(index) {
        await this.enterTo(index);
        const fromNumber = (this.query.one('._3pHQr') || {}).innerText || '';
        this.recipients.push({
            fromNumber,
            recipient: this.query.one('[name$="data.recipient.name"]').value,
            recipientNumber: this.query.one('[name$="data.recipient.account.number"]').value,
            title: this.query.one('[name$="data.title"]').value
        });
    }

    async enterTo(index) {
        this.query.all(this.listTableSelector + ' tr')[index].click();
        await this.wait.for(this.detailsPageCheckSelector);
    }

    async backToList() {
        this.query.one('button[value="cancel"]').click();
        await this.wait.for(this.listTableSelector);
    }

    /**
     * @returns {boolean}
     */
    hasNext() {
        this.currentRowIndex += 1;
        return this.currentRowIndex < this.numberOfRecipients;
    }
}

/**
 * @returns {CollectData}
 */
function collectDataFactory() { return new CollectData(queryFactory(), storageFactory(), waitFactory()); }

/**
 * @type {CollectData}
 */
const collectData = collectDataFactory();



