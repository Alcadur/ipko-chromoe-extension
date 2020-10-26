'use strict';

/**
 * @typedef RecipientField
 * @property {String} id
 * @property {String} label
 * @property {Object} [actions]
 */

export class RecipientForm {
    /** @private
     * @type RecipientField[]*/
    fields = [
        {
            id: 'fromNumber', label: 'Z konta', actions: {
                input: this.formatAccountNumber
            },
        },
        { id: 'recipient', label: 'Odbiorca*' },
        {
            id: 'recipientNumber', label: 'Na konto', actions: {
                input: this.formatAccountNumber
            }
        },
        { id: 'title', label: 'Tytułem' },
        { id: 'defaultAmount', label: 'Kwota' },
    ];
    /**
     * @private
     * @type {Object}
     */
    fieldsInputs = {};
    /**
     * @private
     * @type Node
     */
    form;

    /**
     * @param {Query} query
     */
    constructor(query) {
        this.query = query;

        this.createForm();
    }

    /**
     * @private
     */
    createForm() {
        this.form = document.createElement('div');
        const rowTemplate = document.createElement('div');
        rowTemplate.classList.add('row');
        rowTemplate.innerHTML = '<label for=""></label><input id="" type="text">';

        this.fields.forEach(field => {
            const row = rowTemplate.cloneNode(true);
            const labelElement = this.query.one('label', row);
            labelElement.textContent = field.label;
            labelElement.setAttribute('for', field.id);

            const inputElement = this.query.one('input', row);
            inputElement.id = field.id;
            this.fieldsInputs[field.id] = inputElement;

            if (field.actions) {
                Object.keys(field.actions).forEach(eventName => {
                    inputElement.addEventListener(eventName, field.actions[eventName]);
                });
            }

            this.form.appendChild(row);
        });
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
        this.fields.forEach(field => {
            this.fieldsInputs[field.id].value = recipient[field.id] || '';
        });
    }

    /**
     * @return {Recipient}
     * @param {Object|Recipient} [objectRef] - destiny object reference
     */
    getRecipient(objectRef) {
        /** @type Object|Recipient */const recipient = objectRef || {};

        this.fields.forEach(field => {
            recipient[field.id] = this.fieldsInputs[field.id].value;
        });

        return /** @type Recipient */recipient;
    }

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
    return new RecipientForm(queryFactory());
}
