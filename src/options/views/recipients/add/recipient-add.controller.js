'use strict';

import { recipientFormFactory } from '../shared/recipient-form/recipient-form.js';
import { RECIPIENTS_LIST } from '../../../options-urls.js';
import { viewNavigatorProvider } from '../../../view-navigator.js';

export class RecipientAddController {
    /**
     * @private
     * @type RecipientForm*/recipientForm;
    /**
     * @private
     * @type Storage*/store;

    /**
     * @param {Query} query
     * @param {RecipientForm} recipientForm
     * @param {Storage} store
     * @param {DialogService} dialogService
     * @param {ViewNavigator} viewNavigator
     */
    constructor(
        query,
        recipientForm,
        store,
        dialogService,
        viewNavigator
    ) {
        this.dialogService = dialogService;
        this.store = store;
        this.recipientForm = recipientForm;
        this.viewNavigator = viewNavigator;
        recipientForm.appendFormTo('#addForm');

        query.one('#saveButton').addEventListener('click', () => {
            this.saveAction().then();
        });

        viewNavigator.moveToOnClick('.back-button', RECIPIENTS_LIST());
    }

    /**\
     * @return {Promise<void>}
     */
    async saveAction() {
        if (!this.recipientForm.isValid()) {
            this.dialogService.open('Nazwa odbiorcy jest wymagana');
            return;
        }

        const recipients = await this.store.getRecipients();
        const recipient = this.recipientForm.getRecipient();

        const isExists = !!recipients.find((savedRecipient) => savedRecipient.recipient === recipient.recipient);
        if (isExists) {
            this.dialogService.open(`Odbiorce o nazwie "${recipient.recipient}" już istnieje`);
            return;
        }

        recipients.push(recipient);
        await this.store.saveRecipients(recipients);

        this.viewNavigator.moveTo(RECIPIENTS_LIST());
    }

}

export function recipientAddControllerFactory() { return new RecipientAddController(
    queryFactory(),
    recipientFormFactory(),
    storageFactory(),
    dialogServiceFactory(),
    viewNavigatorProvider()
)}
