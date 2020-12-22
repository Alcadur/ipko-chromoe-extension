class ConfirmRecipientAddingForm {

    submitButtonSelector = 'button[type="submit"][data-text="Wykonaj"]';
    confirmMessageContainerSelector = '._1vT61';
    valueLabelContainerSelector = '._3PZX-';
    rowSelector = '._1V3J3';
    flatValueContainerSelector = '._3gND8';
    accountValueContainerSelector = '._20kkR';

    /**
     * @private
     * @type {Recipient}
     */
    recipient;

    /**
     * @param {Query} query
     * @param {Wait} wait
     * @param {Storage} storage
     */
    constructor(query, wait, storage) {
        this.query = query;
        this.wait = wait;
        this.storage = storage;
    }

    init() {
        this.recipient = this.getData();

        this.query.one(this.submitButtonSelector).addEventListener('click', async () => {
            await this.wait.untilLoaderGone();

            const confirmationMessageContainer = this.query.one(this.confirmMessageContainerSelector);

            if (!confirmationMessageContainer) {
                return;
            }

            return this.storage.addReRecipient(this.recipient);
        });
    }

    /**
     * @private
     * @return {Recipient}
     */
    getData() {
        // TODO: handle custom names
        const requiredFieldsName = ['Odbiorca', 'Numer konta', 'Z konta', 'Tytuł'];
        const fieldsNameMap = {
            'Odbiorca': 'recipient',
            'Numer konta': 'recipientNumber',
            'Z konta': 'fromNumber',
            'Tytuł': 'title'
        };

        const recipientData = {};

        this.query.all(this.valueLabelContainerSelector).forEach(labelContainer => {
            const nameIndex = requiredFieldsName.indexOf(labelContainer.textContent.trim());


            if (nameIndex !== -1) {
                const fieldName = requiredFieldsName[nameIndex];
                const row = labelContainer.closest(this.rowSelector);
                const flatValueContainer = this.query.one(this.flatValueContainerSelector, row);
                const recipientField = fieldsNameMap[fieldName];

                if (flatValueContainer) {
                    recipientData[recipientField] = flatValueContainer.textContent.trim();
                } else {
                    recipientData[recipientField] = this.query.one(this.accountValueContainerSelector, row).textContent.trim();
                }
            }
        });

        return {
            recipient: recipientData.recipient,
            recipientNumber: recipientData.recipientNumber,
            fromNumber: recipientData.fromNumber,
            payments: [{ title: recipientData.title, amount: 0 }]
        };
    }
}

function confirmRecipientAddingFormFactory() { return new ConfirmRecipientAddingForm(
    queryFactory(),
    waitFactory(),
    storageFactory()
); }
