'use strict';

import { viewManagerProvider } from '../../../view-manager.js';
import { recipientFormFactory } from '../shared/recipient-form/recipient-form.js';
import { RECIPIENTS_LIST } from '../../../options-urls.js';
import { dialogServiceFactory } from '../shared/dialog-service/dialog.service.js';

export class RecipientEditController {
    /**
     * @param {ViewManager} viewManager
     * @param {Query} query
     * @param {Storage} store
     * @param {RecipientForm} recipientForm
     * @param {DialogService} dialogService
     */
    constructor(viewManager, query, store, recipientForm, dialogService) {
        this.query = query;
        this.store = store;
        this.recipientForm = recipientForm;
        this.dialogService = dialogService;
        this.recipientForm.appendFormTo('#editForm');
        this.getRecipientByName(viewManager.getPathVariables().recipientName).then((recipient) => {
            this.recipientForm.update(recipient);
            this.recipientName = recipient.recipient;
        });

        query.one('#saveButton').addEventListener('click', async () => {
            await this.saveAction();
        });

        query.one('.back-button').addEventListener('click', () => location.hash = RECIPIENTS_LIST())
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
     * @return {Promise<void>}
     */
    async saveAction() {
        if (!this.recipientForm.isValid()) {
            this.dialogService.open('Nazwa odbiorcy jest wymagana');
            return;
        }

        const recipients = await this.store.getRecipients();
        const recipient = recipients.find(savedRecipient => savedRecipient.recipient === this.recipientName);

        this.recipientForm.getRecipient(recipient);

        this.store.saveRecipients(recipients).then();

        location.hash = 'recipients';
    }
}

export function recipientEditControllerFactory() {
    return new RecipientEditController(viewManagerProvider(), queryFactory(), storageFactory(), recipientFormFactory(), dialogServiceFactory())
}
