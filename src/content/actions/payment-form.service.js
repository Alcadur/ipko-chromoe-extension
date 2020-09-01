class PaymentFormService {
    /**
     * @param {Query} query
     */
    constructor(query) {
        this.query = query;
    }

    /**
     * @param {Recipient} recipient
     */
    fill(recipient) {
        console.log('fill form by',recipient)
    }
}

function paymentFormServiceFactory() { return new PaymentFormService(queryFactory()) }

const paymentFormService = paymentFormServiceFactory();
