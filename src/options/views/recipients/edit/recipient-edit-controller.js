'use strict';

import { viewManagerProvider } from '../../../view-manager.js';

/**
 * @typedef RecipientField
 * @property {String} id
 * @property {String} label
 */

export class RecipientEditController {
    /** @private
     * @type RecipientField[]*/
    fields = [
        { id: 'fromNumber', label: 'Z konta' },
        { id: 'recipient', label: 'Odbiorca' },
        { id: 'recipientNumber', label: 'Na konto' },
        { id: 'title', label: 'Tytułem' },
        { id: 'defaultAmount', label: 'Kwota' },
    ];

    /**
     * @param {ViewManager} viewManager
     * @param {Query} query
     * @param {Storage} store
     */
    constructor(viewManager, query, store) {
        this.query = query;
        this.store = store;
        this.createForm();
        this.getRecipientByName(viewManager.getPathVariables().recipientName).then((recipient) => {
            this.updateForm(recipient);
            this.recipientName = recipient.recipient;
        });

        query.one('#saveButton').addEventListener('click', async () => {
            await this.saveAction();
        });
    }

    /**
     * @private
     * @param name
     * @return {Promise<Recipient>}
     */
    async getRecipientByName(name) {
        const recipients = await this.store.getRecipients();
        return recipients.find(recipient => recipient.recipient === name);
    }

    /**
     * @private
     */
    createForm() {
        const templateRow = query.one('#formRowTemplate').content.firstElementChild;
        const formContainer = query.one('#editForm');

        this.fields.forEach(field => {
            const row = /** @type HTMLElement */templateRow.cloneNode(true);
            const labelElement = this.query.one('label', row);
            labelElement.textContent = field.label;
            labelElement.setAttribute('for', field.id);

            const inputElement = this.query.one('input', row);
            inputElement.id = field.id;

            formContainer.appendChild(row);
        });
    }

    /**
     * @private
     * @param {Recipient} recipient
     */
    updateForm(recipient) {
        this.fields.forEach(field => {
            this.query.one(`#${field.id}`).value = recipient[field.id];
        });
    }

    /**
     * @return {Promise<void>}
     */
    async saveAction() {
        const recipients = await this.store.getRecipients();
        const recipient = recipients.find(savedRecipient => savedRecipient.recipient === this.recipientName);

        this.fields.forEach(field => {
            recipient[field.id] = this.query.one(`#${field.id}`).value.trim();
        });

        this.store.saveRecipients(recipients).then();

        location.hash = 'recipients';
    }
}

export function recipientEditControllerFactory() {
    return new RecipientEditController(viewManagerProvider(), queryFactory(), storageFactory())
}
