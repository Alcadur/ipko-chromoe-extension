// TODO: write tests (and/or refactor)

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
    const template = query.one('#rowTemplate').cloneNode(true).content;

    template.querySelector('.source-account input').value = recipient.fromNumber;
    template.querySelector('.recipient-name input').value = recipient.recipient;
    template.querySelector('.recipient-account input').value = recipient.recipientNumber;
    template.querySelector('.title input').value = recipient.title;
    template.querySelector('.amount input').value = recipient.defaultAmount || 0;

    tableBody.appendChild(template);
}

function collectData() {
    /**
     * @type {Recipient[]}
     */
    const data = []
    query.all('tbody tr').forEach(row => {
        data.push({
            fromNumber: query.one('.source-account input', row).value,
            recipient: query.one('.recipient-name input', row).value,
            recipientNumber: query.one('.recipient-account input', row).value,
            title: query.one('.title input', row).value,
            defaultAmount: query.one('.amount input', row).value
        });
    });

    return data;
}

query.one('#saveButton').addEventListener('click', () => {
    storage.saveRecipients(collectData()).then(() => {})
})
