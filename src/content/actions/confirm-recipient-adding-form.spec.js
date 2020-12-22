describe('ConfirmRecipientAddingForm', () => {

    let waitMock;
    let storageMock;
    let recipientData

    /** @type {ConfirmRecipientAddingForm} */
    let confirmRecipientAddingForm;

    beforeEach(() => {
        waitMock = jasmine.createSpyObj('wait', { untilLoaderGone: Promise.resolve() });
        storageMock = jasmine.createSpyObj('storage', ['addReRecipient']);
        recipientData = {
            recipient: 'Recipient Name',
            recipientNumber: '00 0000 0000 0000 0000',
            fromNumber: '11 1111 1111 1111 1111',
            title: 'Best deal ever'
        };

        confirmRecipientAddingForm = testFactory();

        document.body.innerHTML = `
        <div class="_1V3J3">
            <div class="_3PZX-">Odbiorca</div>
            <div class="_3gND8">${recipientData.recipient}</div>
        </div>
        <div class="_1V3J3">
            <div class="_3PZX-"> Numer konta</div>
            <div class="_20kkR"> ${recipientData.recipientNumber}</div>
        </div>
        <div class="_1V3J3">
            <div class="_3PZX-">Z konta </div>
            <div class="_20kkR">${recipientData.fromNumber} </div>
        </div>
        <div class="_1V3J3">
            <div class="_3PZX-"> Tytuł </div>
            <div class="_3gND8"> ${recipientData.title} </div>
        </div>
        <button type="submit" data-text="Wykonaj"></button>`;
    });

    describe('init', () => {
        let submitButton;
        let clickHandle;

        beforeEach(() => {
            submitButton = document.querySelector(confirmRecipientAddingForm.submitButtonSelector);
            spyOn(submitButton, 'addEventListener').and.callFake((_, callback) => clickHandle = callback);
        });

        it('should bind click action to submit button', () => {
            // when
            confirmRecipientAddingForm.init();

            // when
            expect(submitButton.addEventListener).toHaveBeenCalledOnceWith('click', jasmine.any(Function));
        });

        it('should add new recipient to storage when user confirm operation', async () => {
            // given
            const expected = {
                recipient: recipientData.recipient,
                recipientNumber: recipientData.recipientNumber,
                fromNumber: recipientData.fromNumber,
                payments: [{ title: recipientData.title, amount: 0 }]
            }
            confirmRecipientAddingForm.init();
            document.body.innerHTML = '<div class="_1vT61"></div>';

            // when
            await clickHandle();

            // then
            expect(storageMock.addReRecipient).toHaveBeenCalledOnceWith(expected);
        });

        it('should not add new recipient when there will be no confirmation container', async () => {
            // given
            confirmRecipientAddingForm.init();
            document.body.innerHTML = '';

            // when
            await clickHandle();

            // then
            expect(storageMock.addReRecipient).not.toHaveBeenCalled();
        })
    });

    function testFactory() {
        return new ConfirmRecipientAddingForm(queryFactory(), waitMock, storageMock);
    }
});
