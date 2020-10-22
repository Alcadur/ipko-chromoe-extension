'use strict';

/**
 * @typedef RecipientField
 * @property {String} id
 * @property {String} label
 */

export class RecipientForm {
    /** @private
     * @type RecipientField[]*/
    fields = [
        { id: 'fromNumber', label: 'Z konta' },
        { id: 'recipient', label: 'Odbiorca*' },
        { id: 'recipientNumber', label: 'Na konto' },
        { id: 'title', label: 'Tytułem' },
        { id: 'defaultAmount', label: 'Kwota' },
    ];
    /**
     * @private
     * @type {Object}
     */
    fieldsInputs = { };
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
            this.fieldsInputs[field.id].value = recipient[field.id];
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
}

export function recipientFormFactory() { return new RecipientForm(queryFactory()); }
