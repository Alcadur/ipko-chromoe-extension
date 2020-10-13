describe('PaymentFormService', () => {
    const RECIPIENT_NAME = 'recipient name 1';
    const TARGET_ACCOUNT_NUMBER = '12 5478 5632 5985 8562';
    const TITLE = 'burger order';

    /**
     * @type PaymentFormService
     */
    let paymentFormService;
    /**
     * @type Wait
     */
    let waitMock;
    /**
     * @type InputService
     */
    let inputServiceMock;


    beforeEach(() => {
        waitMock = jasmine.createSpyObj('wait', { for: () => { Promise.resolve() }});
        inputServiceMock = jasmine.createSpyObj('inputService', ['changeValueBySelector']);
        paymentFormService = new PaymentFormService(queryFactory(), waitMock, inputServiceMock)
    });

    describe('fill', () => {
        let recipient;
        beforeEach(() => {
            recipient = {
                fromNumber: '00 0000 0000 0000',
                recipient: 'recipient 2',
                recipientNumber: '12 3456 7891',
                title: 'for test',
                defaultAmount: 753159
            }

            spyOn(paymentFormService, 'selectSourceAccount').and.returnValue(Promise.resolve());
            spyOn(paymentFormService, 'fillRecipient').and.returnValue(null);
            spyOn(paymentFormService, 'fillTargetAccount').and.returnValue(null);
            spyOn(paymentFormService, 'changeTitle').and.returnValue(null);
            spyOn(paymentFormService, 'changeAmount').and.returnValue(null);
        });

       it('should run fill methods', async () => {
           // when
           await paymentFormService.fill(recipient);

           // then
           expect(paymentFormService.selectSourceAccount).toHaveBeenCalledWith(recipient.fromNumber);
           expect(paymentFormService.fillRecipient).toHaveBeenCalledWith(recipient.recipient);
           expect(paymentFormService.fillTargetAccount).toHaveBeenCalledWith(recipient.recipientNumber);
           expect(paymentFormService.changeTitle).toHaveBeenCalledWith(recipient.title);
           expect(paymentFormService.changeAmount).toHaveBeenCalledWith(recipient.defaultAmount);
       });
    });

    describe('selectSourceAccount', () => {
        let selectedAccount;
        let accountsLayer;

        beforeEach(() => {
            selectedAccount = null;
            document.body.innerHTML = `<button class="mcRxu"><div class="_3pHQr"></div></button>`
            accountsLayer = document.createElement('div');
            accountsLayer.classList.add('z0bFa', 'VlTJV');
            accountsLayer.innerHTML = `<div>11 1111 1111 1111 1111</div>
                <div>${TARGET_ACCOUNT_NUMBER}</div>
                <div>33 3333 3333 3333 3333</div>`;
            accountsLayer.querySelectorAll('div').forEach(node =>
                node.addEventListener('click', () => selectedAccount = node.textContent )
            );
            document.querySelector('button').addEventListener('click', () =>
                document.querySelector('button').appendChild(accountsLayer)
            );
        });

        it('should open and select account when there will be no selected account', async () => {
            // when
            await paymentFormService.selectSourceAccount(TARGET_ACCOUNT_NUMBER)

            // then
            expect(selectedAccount).toEqual(TARGET_ACCOUNT_NUMBER);
        });

        it('should not open account menu popup when selected account is equal target account', async () => {
            // given
            document.querySelector('._3pHQr').textContent = TARGET_ACCOUNT_NUMBER;

            // when
            await paymentFormService.selectSourceAccount(TARGET_ACCOUNT_NUMBER);

            // then
            expect(waitMock.for).not.toHaveBeenCalled();
        });

        it('should select account when the selected account is equal target account but both are not set', async () => {
            // given
            document.querySelector('._3pHQr').remove();

            // when
            await paymentFormService.selectSourceAccount('');

            // then
            expect(document.querySelector('.z0bFa.VlTJV')).toBeTruthy();
        });

        it('should not throw an error when there will bo no target account on the list', () => {
            // given
            const missingAccountNumber = '99 999 999 999 999';

            // when
            expect(async () => await paymentFormService.selectSourceAccount(missingAccountNumber)).not.toThrow();
        });

        it('should not select when element tag name will not be equal div', async () => {
            // given
            selectedAccount = null;
            const emptyAccountPlaceholder = document.createElement('span');
            const target = '88 8888 8888 8888';
            emptyAccountPlaceholder.textContent = target;
            accountsLayer.appendChild(emptyAccountPlaceholder);

            // when
            await paymentFormService.selectSourceAccount(target);

            // then
            expect(selectedAccount).toBeNull();
        });
    });

    describe('fillRecipient', () => {
        it('should use input service to fill recipient name field', () => {
            // when
            paymentFormService.fillRecipient(RECIPIENT_NAME);

            // then
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledTimes(1);
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledWith('[name$="data.recipient.name"]', RECIPIENT_NAME);
        });
    });

    describe('fillTargetAccount', () => {
        it('should use input service to fill target account number field', () => {
            // when
            paymentFormService.fillTargetAccount(TARGET_ACCOUNT_NUMBER);

            // then
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledTimes(1);
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledWith('[name$="data.recipient.account.number"]', TARGET_ACCOUNT_NUMBER);
        });
    });

    describe('changeTitle', () => {
        it('should use input service to change title field', () => {
            // when
            paymentFormService.changeTitle(TITLE);

            // then
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledTimes(1);
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledWith('[name$="data.title"]', TITLE);
        });
    });

    describe('changeAmount', () => {
        it('should use input service to change amount field', () => {
            // when
            paymentFormService.changeAmount(TITLE);

            // then
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledTimes(1);
            expect(inputServiceMock.changeValueBySelector).toHaveBeenCalledWith('[name$="data.money.amount"]', TITLE);
        });
    });
});
