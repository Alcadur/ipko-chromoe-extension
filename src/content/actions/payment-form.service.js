class PaymentFormService {
    /**
     * @param {Query} query
     * @param {Wait} wait
     * @param {InputService} inputService
     */
    constructor(query, wait, inputService) {
        this.query = query;
        this.wait = wait;
        this.inputService = inputService;
    }

    /**
     * @param {Recipient} recipient
     * @return {Promise<void>}
     */
    async fill(recipient) {
        await this.selectSourceAccount(recipient.fromNumber.toString());
        this.fillRecipient(recipient.recipient);
        this.fillTargetAccount(recipient.recipientNumber);
        this.changeTitle(recipient.title);
        this.changeAmount(recipient.defaultAmount);
    }

    /**
     * @param {string} accountNumber
     * @return {Promise<void>}
     */
    async selectSourceAccount(accountNumber) {
        const ACCOUNTS_BUTTON_SELECTOR = 'button.mcRxu';
        const currentSelectedNumber = this.query.one(`${ACCOUNTS_BUTTON_SELECTOR} ._3pHQr`);
        if (currentSelectedNumber && currentSelectedNumber.textContent === accountNumber) {
            return;
        }

        const SELECT_LAYER_SELECTOR = '.z0bFa.VlTJV'
        this.query.one(ACCOUNTS_BUTTON_SELECTOR).click();
        await this.wait.for(SELECT_LAYER_SELECTOR);
        const selectLayer = this.query.one(ACCOUNTS_BUTTON_SELECTOR);
        const xpathResult = document.evaluate(`//div[text()="${accountNumber}"]`, selectLayer, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const selectedNode = /** @type HTMLElement */xpathResult.singleNodeValue;

        if (selectedNode) {
            selectedNode.click();
        }
    }

    /**
     * @param {string} recipientName
     */
    fillRecipient(recipientName) {
        const RECIPIENT_FIELD_SELECTOR = '[name$="data.recipient.name"]';
        this.inputService.changeValueBySelector(RECIPIENT_FIELD_SELECTOR, recipientName);
    }

    /**
     * @param {string} targetAccount
     */
    fillTargetAccount(targetAccount) {
        const TARGET_ACCOUNT_FIELD_SELECTOR = '[name$="data.recipient.account.number"]';
        this.inputService.changeValueBySelector(TARGET_ACCOUNT_FIELD_SELECTOR, targetAccount);
    }

    changeTitle(title) {
        const TITLE_FIELD_SELECTOR = '[name$="data.title"]';
        this.inputService.changeValueBySelector(TITLE_FIELD_SELECTOR, title);
    }

    changeAmount(amount) {
        const AMOUNT_FIELD_SELECTOR = '[name$="data.money.amount"]';
        this.inputService.changeValueBySelector(AMOUNT_FIELD_SELECTOR, amount)
    }
}

function paymentFormServiceFactory() { return new PaymentFormService(queryFactory(), waitFactory(), inputServiceFactory()); }

const paymentFormService = paymentFormServiceFactory();
