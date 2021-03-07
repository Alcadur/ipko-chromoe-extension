'use strict';

/**
 * @typedef PaymentFields
 * @property {HTMLInputElement} title
 * @property {HTMLInputElement} amount
 */

import { recipientFormTemplate } from './template.js';

export class RecipientForm {
    /**
     * @private
     * @type {string[]}
     */
    fieldsIds = [
        'fromNumber',
        'recipient',
        'recipientNumber',
    ];
    /**
     * @private
     * @type {Object}
     */
    fieldsInputs = {};
    /**
     * @private
     * @type {PaymentFields[]}
     */
    paymentsFields = [];
    /**
     * @private
     * @type Element
     */
    form;

    /**
     * @param {Query} query
     * @param {TemplateHelper} templateHelper
     * @param {Wait} wait
     */
    constructor(query, templateHelper, wait) {
        this.query = query;
        this.templateHelper = templateHelper;
        this.wait = wait;
        this.wait.setTimeout(10);

        this.createForm()

        this.query.one('.add-payment-button', this.form).addEventListener('click', () => {
            this.createPaymentRows();
            this.enableRemoveButton();
        });
    }

    /**
     * @private
     */
    createForm() {
        const template = document.createElement('template');
        template.innerHTML = recipientFormTemplate;
        this.form = template.content.firstElementChild;
        this.query.all('.format-account', this.form).forEach(element => {
            element.addEventListener('input', this.formatAccountNumber);
        });

        this.fieldsIds.forEach(field => {
            this.fieldsInputs[field] = this.query.one(`#${field}`, this.form);
        })
        // TODO: extract to method
        // TODO: tests
        const aliasesContainer = this.query.one('.aliases-container', this.form);
        aliasesContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('aliases-container')) {
                this.query.one('#aliasesInput').focus();
            }
        });
        const inputMirror = this.query.one('#aliasInputMirror', this.form);

        this.query.one('#aliasesInput', this.form).addEventListener('input', function () {
            inputMirror.textContent = this.value;
        });

        this.query.one('#aliasesInput', this.form).addEventListener('keypress', async (event) => {
            if (event.key === 'Enter' && !!event.target.value) {
                const newAliasElement = this.templateHelper.getFirstTemplateNode('#newAlias', this.form)
                this.query.one('.label', newAliasElement).textContent = event.target.value;
                event.target.value = '';
                event.target.dispatchEvent(new Event('input'));
                this.removeAliasHandle(newAliasElement);
                aliasesContainer.insertBefore(newAliasElement, inputMirror);
                await this.wait.for('.just-created');
                newAliasElement.classList.remove('just-created');
                newAliasElement.classList.add('alias');
            }
        });

        // ***********************
        this.createPaymentRows();
        this.disabledRemoveButtonIfLast();
    }

    // TODO: tests
    /**
     * @param {HTMLElement} element
     */
    removeAliasHandle(element) {
        this.query.one('.remove', element).addEventListener('click', () => {
            element.remove()
        });
    }

    /**
     * @private
     * @return {Element}
     */
    createPaymentRows() {
        const titleFieldsWrapper = this.templateHelper.getFirstTemplateNode('#rowTemplate', this.form)
        this.fillRowTemplateAttributes(titleFieldsWrapper, IdGenerator.nextId('title'), 'Tytuł');
        const amountFieldsWrapper = this.templateHelper.getFirstTemplateNode('#rowTemplate', this.form);
        this.fillRowTemplateAttributes(amountFieldsWrapper, IdGenerator.nextId('amount'), 'Kwota');

        const payment = this.templateHelper
            .getFirstTemplateNode('#paymentRowTemplate', this.form);
        this.query.one('.remove-payment-button', payment).addEventListener('click', (event) => {
            const input = event.target.parentElement.querySelector('[id^="title"]');
            this.removePayment(payment, input);
        });

        payment.appendChild(titleFieldsWrapper);
        payment.appendChild(amountFieldsWrapper);

        this.paymentsFields.push({
            title: this.query.one('input', titleFieldsWrapper),
            amount: this.query.one('input', amountFieldsWrapper)
        });

        this.query.one('#payments .rows-wrapper', this.form)
            .appendChild(payment);

        return payment;
    }

    /**
     * @private
     */
    disabledRemoveButtonIfLast() {
        if (this.paymentsFields.length === 1) {
            this.query.one('.remove-payment-button', this.form).classList.add('disabled');
        }
    }

    /**
     * @private
     * @param {Element} paymentRow
     * @param {HTMLInputElement} titleInput
     */
    removePayment(paymentRow, titleInput) {
        if (this.paymentsFields.length - 1 === 0) {
            return
        }

        paymentRow.remove();

        const paymentIndex = this.paymentsFields.findIndex((paymentFields) =>
            paymentFields.title === titleInput);
        this.paymentsFields.splice(paymentIndex, 1);

        this.disabledRemoveButtonIfLast();
    }

    /**
     * @private
     */
    enableRemoveButton() {
        const removeButtonElement = this.query.one('.remove-payment-button.disabled');

        if (removeButtonElement) {
            removeButtonElement.classList.remove('disabled');
        }
    }

    /**
     * @param {Element} row
     * @param {string} id
     * @param {string} label
     */
    fillRowTemplateAttributes(row, id, label) {
        const labelNode = this.query.one('label', row);
        labelNode.setAttribute('for', id);
        labelNode.textContent = label;
        this.query.one('input', row).id = id;
    }


    /**
     * @param {String|Node} parentSelectorOrNode
     */
    appendFormTo(parentSelectorOrNode) {
        if (typeof parentSelectorOrNode === 'string') {
            this.appendFormBySelector(/** @type String */parentSelectorOrNode);
        } else {
            this.appendFormByNode(/** @type Node */parentSelectorOrNode)
        }
    }

    /**
     * @private
     * @param {String} selector
     */
    appendFormBySelector(selector) {
        this.query.one(selector).appendChild(this.form);
    }

    /**
     * @private
     * @param {Node} node
     */
    appendFormByNode(node) {
        node.appendChild(this.form);
    }

    /**
     * @param {Recipient} recipient
     */
    update(recipient) {
        this.fieldsIds.forEach(field => {
            this.form[field].value = recipient[field] || '';
        });

        if (recipient.payments && recipient.payments.length) {
            this.paymentsFields = [];
            this.query.one('#payments .rows-wrapper').innerHTML = '';

            recipient.payments.forEach(payment => {
                const paymentElement = this.createPaymentRows();
                this.query.one('input[id^="title"]', paymentElement).value = payment.title;
                this.query.one('input[id^="amount"]', paymentElement).value = payment.amount;
            });
        }
    }

    /**
     * @return {Recipient}
     * @param {Object|Recipient} [objectRef] - destiny object reference
     */
    getRecipient(objectRef) {
        /** @type Object|Recipient */const recipient = objectRef || {};

        this.fieldsIds.forEach(field => {
            recipient[field] = this.fieldsInputs[field].value;
        });

        recipient.payments = this.paymentsFields.map(paymentField => ({
            title: paymentField.title.value,
            amount: paymentField.amount.value
        }));

        return /** @type Recipient */recipient;
    }

    /**
     * @return {boolean}
     */
    isValid() {
        return !!this.fieldsInputs.recipient.value.trim();
    }

    /**
     * @private
     * @this HTMLInputElement
     * @param {InputEvent} event
     */
    formatAccountNumber(event) {
        const position = this.selectionStart;
        let newPosition = this.selectionStart;
        const lengthBeforeFormat = this.value.length;

        this.value = this.value
            .replace(/\s/g, '')
            .replace(/^([A-Za-z]{0,2}\d{2})\s*|(\d{4})\s*/g, '$1$2 ')
            .trim();

        if (position !== lengthBeforeFormat) {
            const prefixLength = this.value.indexOf(' ');
            const whitespacesMatches = this.value.substr(0, position).match(/\s/g);
            const numberOfWhitespaces = whitespacesMatches ? whitespacesMatches.length : 0;
            const accountLengthWithoutPrefix = position - prefixLength - numberOfWhitespaces;
            let incrementBy = 1;
            if (event.inputType === 'deleteContentBackward') {
                incrementBy = -1;
            }

            if (position === prefixLength || accountLengthWithoutPrefix % 4 === 0) {
                newPosition += incrementBy;
            }

            this.setSelectionRange(newPosition, newPosition)
        }
    }
}

export function recipientFormFactory() {
    return new RecipientForm(queryFactory(), templateHelperFactory(), waitFactory());
}
