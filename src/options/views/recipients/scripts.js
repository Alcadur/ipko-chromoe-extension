'use strict';
// TODO: write tests (and/or refactor)

import { ADD_RECIPIENT, DASHBOARD, EDIT_RECIPIENT } from '../../options-urls.js';
import { viewNavigatorProvider } from '../../view-navigator.js';

const tableBody = query.one('tbody');
const viewNavigator = viewNavigatorProvider();

storage.getRecipients().then((recipients) => {
    recipients.sort((a,b) => {
        if (a.recipient > b.recipient) {
            return 1
        }
        if (a.recipient < b.recipient) {
            return -1
        }
        return 0;
    });

    recipients.forEach(recipient => addRow(recipient));
});

/**
 * @param {Recipient} recipient
 */
function addRow(recipient) {
    const row = /**@type {HTMLElement}*/query.one('#rowTemplate').content.firstElementChild.cloneNode(true);

    row.querySelector('.source-account div').textContent = recipient.fromNumber;
    row.querySelector('.recipient-name div').textContent = recipient.recipient;
    row.querySelector('.recipient-account div').textContent = recipient.recipientNumber;

    viewNavigator.moveToOnClick(row, EDIT_RECIPIENT(recipient.recipient));

    tableBody.appendChild(row);
}

viewNavigator.moveToOnClick('#addRecipient', ADD_RECIPIENT());
viewNavigator.moveToOnClick('a.back-button', DASHBOARD());
