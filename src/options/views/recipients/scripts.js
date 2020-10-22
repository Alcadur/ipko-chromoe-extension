'use strict';
// TODO: write tests (and/or refactor)

import { ADD_RECIPIENT, EDIT_RECIPIENT } from '../../options-urls.js';

const tableBody = query.one('tbody');

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
    const row = query.one('#rowTemplate').content.firstElementChild.cloneNode(true);

    row.querySelector('.source-account div').textContent = recipient.fromNumber;
    row.querySelector('.recipient-name div').textContent = recipient.recipient;
    row.querySelector('.recipient-account div').textContent = recipient.recipientNumber;
    row.querySelector('.title div').textContent = recipient.title;
    row.querySelector('.amount div').textContent = recipient.defaultAmount || 0;

    row.addEventListener('click',() => location.hash = EDIT_RECIPIENT(recipient.recipient))

    tableBody.appendChild(row);
}

query.one('#addRecipient').addEventListener('click', () => location.hash = ADD_RECIPIENT())
