/**
 * @typedef {(Recipient & { paymentIndex, paymentTitle })} FilteredRecipient
 */

class PaymentLiveRecipientSearch {
    currentSelectedIndex = -1;
    searchInputSelector = 'textarea[name$="data.recipient.name"]';
    /** @type {Element} */searchInputField;
    /** @type {Recipient[]} */recipients = [];
    /** @type {Recipient} */selectedRecipient;
    /** @type {FilteredRecipient[]} */filteredRecipients = [];

    /** @type {HTMLElement} */rowTemplate;
    /** @type {HTMLElement} */wrapper = document.createElement('div');
    wrapperClassName = 'recipient-search-list';

    /**
     * @param {Query} query
     * @param {Storage} storage
     * @param {PaymentFormService} paymentFormService
     */
    constructor(query, storage, paymentFormService) {
        this.query = query;
        this.storage = storage;
        this.paymentFormService = paymentFormService;
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
        this.searchInputField.addEventListener('keyup', this.searchInputKeyDownHandle);
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
        this.currentSelectedIndex = -1;
        this.removeSearchList();
        const isLongerThenTwoChars = this.searchInputField.value.length < 2;
        const selectedRecipientEqualSearchString =
            this.selectedRecipient &&
            this.searchInputField.value === this.selectedRecipient.recipient &&
            !this.selectedRecipient.payments;

        if (isLongerThenTwoChars || selectedRecipientEqualSearchString) {
            return;
        }

        this.addSearchList();
        const list = query.one('ul', this.wrapper);
        const saveRegexpString = this.searchInputField.value
            .replace(/([()\[\]?])/g, '\\$1')
        const filterExpresion = new RegExp(saveRegexpString, 'i');
        // this.filteredRecipients.length = 0;
        this.recipients.filter(recipient => filterExpresion.test(recipient.recipient))
            .forEach(recipient => {
                if (recipient.payments && recipient.payments.length) {
                    recipient.payments.forEach((payment, index) => {
                        const updated = {
                            ...recipient,
                            paymentTitle: payment.title,
                            paymentIndex: index
                        };
                        this.filteredRecipients.push(updated);
                    })
                } else {
                    this.filteredRecipients.push(recipient);
                }
            });

        this.filteredRecipients.forEach(recipient => {
            const parsedTemplate = this.rowTemplate.cloneNode(true);
            parsedTemplate.textContent = recipient.recipient;

            if (recipient.paymentTitle) {
                parsedTemplate.textContent += ` (${recipient.paymentTitle})`;
            }

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

    searchInputKeyDownHandle = function (event) {
        if (this.filteredRecipients.length === 0) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown': this.arrowDownHandle(); break;
            case 'ArrowUp': this.arrowUpHandle(); break;
            case 'Enter': this.enterHandle(); break;
        }
    }.bind(this);

    /**
     * @private
     */
    arrowDownHandle() {
        this.currentSelectedIndex += 1;

        if (this.currentSelectedIndex >= this.filteredRecipients.length) {
            this.currentSelectedIndex = 0;
        }

        this.selectRow(this.currentSelectedIndex);
    }

    /**
     * @private
     */
    arrowUpHandle() {
        this.currentSelectedIndex -= 1;

        if (this.currentSelectedIndex < 0) {
            this.currentSelectedIndex = this.filteredRecipients.length - 1;
        }

        this.selectRow(this.currentSelectedIndex);
    }

    /**
     * @private
     */
    enterHandle() {
        const selectedRecipient = this.filteredRecipients[this.currentSelectedIndex];
        this.removeSearchList();
        this.selectedRecipient = selectedRecipient;
        this.currentSelectedIndex = -1;
        this.filteredRecipients = [];

        this.paymentFormService.fill(selectedRecipient).then();
    }

    /**
     * @private
     * @param {number} rowIndex
     */
    selectRow(rowIndex) {
        const selectedRow = this.query.one('li.selected', this.wrapper);
        if (selectedRow) {
            selectedRow.classList.remove('selected');
        }

        this.query.all('li', this.wrapper)[rowIndex]
            .classList.add('selected');
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
function paymentLiveRecipientSearchFactory() { return new PaymentLiveRecipientSearch(queryFactory(), storageFactory(), paymentFormServiceFactory()) }

/**
 * @type {PaymentLiveRecipientSearch}
 */
const paymentLiveRecipientSearch = paymentLiveRecipientSearchFactory();
