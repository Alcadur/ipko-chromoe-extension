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
     * @private
     * @type {string[]}
     */
    aliases = []

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
        const aliasInput = this.query.one('#aliasesInput', this.form);
        aliasInput.addEventListener('input', function () {
            inputMirror.textContent = this.value;
        });

        aliasInput.addEventListener('keypress', async (event) => {
            const value = event.target.value.trim();
            if (event.key === 'Enter' && !!value) {
                event.target.value = '';
                event.target.dispatchEvent(new Event('input'));
                if (this.aliases.indexOf(value) !== -1) {
                    return;
                }
                await this.insertAlias(value, true);
            }
        });

        aliasInput.addEventListener('blur', async (event) => {
            const value = event.target.value.trim();
            event.target.value = '';
            event.target.dispatchEvent(new Event('input'));

            if (this.aliases.indexOf(value) !== -1 || !value) {
                return;
            }

            await this.insertAlias(value, true);
        })

        // ***********************
        this.createPaymentRows();
        this.disabledRemoveButtonIfLast();
    }

    // TODO: tests
    /**
     * @param {string} alias
     * @param {boolean} [isNew=false]
     */
    async insertAlias(alias, isNew = false) {
        const newAliasElement = this.templateHelper.getFirstTemplateNode('#newAlias', this.form)
        this.query.one('.label', newAliasElement).textContent = alias;
        this.removeAliasHandle(newAliasElement);
        this.query.one('.aliases-container', this.form)
            .insertBefore(newAliasElement, this.query.one('#aliasInputMirror', this.form));
        this.aliases.push(alias);

        if (isNew) {
            await this.wait.for('.just-created');
        }

        newAliasElement.classList.remove('just-created');
        newAliasElement.classList.add('alias');
    }

    // TODO: tests
    /**
     * @param {HTMLElement} element
     */
    removeAliasHandle(element) {
        this.query.one('.remove', element).addEventListener('click', () => {
            const value = this.query.one('.label', element).textContent;
            const valueIndex = this.aliases.indexOf(value);
            this.aliases.splice(valueIndex, 1);
            element.remove()
        });
    }

    /**
     * @private
     * @return {HTMLElement}
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

        recipient.aliases.forEach(alias => {
            this.insertAlias(alias).then();
        })

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

        recipient.aliases = this.aliases;

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
