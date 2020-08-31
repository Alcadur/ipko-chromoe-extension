class PaymentLiveRecipientSearch {
    searchInputSelector = 'textarea[name$="data.recipient.name"]';
    searchInputField;
    /**
     * @type {Recipient[]}
     */
    recipients = [];
    rowTemplate;
    wrapper = document.createElement('div');
    wrapperClassName = 'recipient-search-list';

    /**
     * @param {Query} query
     * @param {Storage} storage
     */
    constructor(query, storage) {
        this.query = query;
        this.storage = storage;
    }

    async init() {
        this.wrapper.classList.add(this.wrapperClassName);
        this.wrapper.innerHTML = '<ul></ul>';
        this.searchInputField = this.query.one(this.searchInputSelector);
        this.rowTemplate = document.createElement('li');
        this.rowTemplate.innerText = `$recipient`

        this.recipients = await this.storage.getRecipients() || [];

        window.addEventListener('resize', this.updateWrapperPosition);
        document.addEventListener('click', this.documentClickHandler);
        this.searchInputField.addEventListener('input', this.filter);
        this.searchInputField.addEventListener('focus', this.filter);
    }

    /**
     * @type {function}
     */
    updateWrapperPosition =  function () {
        const dimensions = this.searchInputField.getBoundingClientRect()
        const inputWidthModifier = -22;
        const inputPaddingTop = -4;

        this.wrapper.style.top = dimensions.top + dimensions.height + window.pageYOffset + inputPaddingTop + 'px';
        this.wrapper.style.left = dimensions.left + 'px';
        this.wrapper.style.width = dimensions.width + inputWidthModifier + 'px';
    }.bind(this)

    /**
     * @type {function}
     */
    filter = function() {
        this.removeSearchList();

        if (this.searchInputField.value.length < 2) {
            return;
        }

        this.addSearchList();
        const list = query.one('ul', this.wrapper);
        const filterExpresion = new RegExp(this.searchInputField.value, 'i');
        const filteredRecipients = this.recipients.filter(recipient => filterExpresion.test(recipient.recipient));

        filteredRecipients.forEach(recipient => {
            const parsedTemplate = this.rowTemplate.cloneNode(true);
            parsedTemplate.textContent = recipient.recipient;
            list.appendChild(parsedTemplate);
        });
    }.bind(this)

    /**
     * @private
     */
    addSearchList () {
        document.body.appendChild(this.wrapper);
        this.updateWrapperPosition();
    }

    /**
     * @private
     */
    removeSearchList() {
        this.wrapper.remove();
        this.query.one('ul', this.wrapper).innerHTML = '';
    }

    /**
     * @param {MouseEvent} event
     * @type {function}
     */
    documentClickHandler = function (event) {
        if (!event.target.closest(`.${this.wrapperClassName}, ${this.searchInputSelector}`) ) {
            this.removeSearchList()
        }

        if (!this.query.one(this.searchInputSelector)) {
            this.removeSearchList()
            this.searchInputField.removeEventListener('input', this.filter);
            document.removeEventListener('click', this.documentClickHandler);
            window.removeEventListener('resize', this.updateWrapperPosition);
        }
    }.bind(this)
}

/**
 * @returns {PaymentLiveRecipientSearch}
 */
function paymentLiveRecipientSearchFactory() { return new PaymentLiveRecipientSearch(queryFactory(), storageFactory()) }

/**
 * @type {PaymentLiveRecipientSearch}
 */
const paymentLiveRecipientSearch = paymentLiveRecipientSearchFactory();
