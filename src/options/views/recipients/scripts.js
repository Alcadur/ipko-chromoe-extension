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
    const row = query.one('#rowTemplate').content.firstElementChild.cloneNode(true);

    row.querySelector('.source-account div').textContent = recipient.fromNumber;
    row.querySelector('.recipient-name div').textContent = recipient.recipient;
    row.querySelector('.recipient-account div').textContent = recipient.recipientNumber;
    row.querySelector('.title div').textContent = recipient.title;
    row.querySelector('.amount div').textContent = recipient.defaultAmount || 0;

    row.addEventListener('click',() => location.hash = `recipients/${recipient.recipient}/edit`)

    tableBody.appendChild(row);
}

// function collectData() {
//     /**
//      * @type {Recipient[]}
//      */
//     const data = []
//     query.all('tbody tr').forEach(row => {
//         data.push({
//             fromNumber: query.one('.source-account input', row).value,
//             recipient: query.one('.recipient-name input', row).value,
//             recipientNumber: query.one('.recipient-account input', row).value,
//             title: query.one('.title input', row).value,
//             defaultAmount: query.one('.amount input', row).value
//         });
//     });
//
//     return data;
// }
//
// query.one('#saveButton').addEventListener('click', () => {
//     storage.saveRecipients(collectData()).then(() => {})
// })
