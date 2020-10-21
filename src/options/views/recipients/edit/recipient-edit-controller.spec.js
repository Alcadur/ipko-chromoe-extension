'use strict';

import { RecipientEditController } from './recipient-edit-controller.js';

describe('RecipientEditController', () => {
    const fields = [
        { id: 'fromNumber', label: 'Z konta' },
        { id: 'recipient', label: 'Odbiorca' },
        { id: 'recipientNumber', label: 'Na konto' },
        { id: 'title', label: 'Tytułem' },
        { id: 'defaultAmount', label: 'Kwota' },
    ];
    let viewManagerMock;
    let storeMock;
    let mockRecipient;
    let mockRecipients;

    beforeEach(() => {
        document.body.innerHTML = `<div id="editForm"></div>
        <button id="saveButton"></button>
        <template id="formRowTemplate">
            <div class="row">
                <label for=""></label>
                <input id="" type="text">
            </div>
        </template>`;

        mockRecipient = {
            fromNumber: '00 0000 0000 0000',
            recipient: 'the recipient',
            recipientNumber: '99 9999 9999 9999',
            title: 'transaction',
            defaultAmount: '69'
        };
        mockRecipients = [{}, mockRecipient, {}];

        viewManagerMock = jasmine.createSpyObj('viewManager', { getPathVariables: { recipientName: mockRecipient.recipient } });
        storeMock = jasmine.createSpyObj('storeMock', {
            getRecipients: Promise.resolve(mockRecipients),
            saveRecipients: Promise.resolve()
        });
    });

    describe('constructor', () => {

        fields.forEach((field) => {
            it(`should create form row for field ${field.id}`, () => {
                // when
                testRecipientEditControllerFactory();

                // then
                expect(document.getElementById(field.id)).not.toBeNull();
                expect(document.querySelector(`[for=${field.id}]`)).not.toBeNull();
            });

            it(`should fill ${field.id} field when recipient will be fetched from store`, (done) => {
                // when
                testRecipientEditControllerFactory();


                // then
                setTimeout(() => {
                    expect(document.getElementById(field.id).value).toEqual(mockRecipient[field.id]);
                    done();
                });
            });
        });

        it('should bind action to save button', async () => {
            // given
            let clickEvent;
            const saveButton = document.getElementById('saveButton');
            spyOn(saveButton, 'addEventListener').and.callFake((event, callback) => clickEvent = callback);

            // when
            const controller = testRecipientEditControllerFactory();
            spyOn(controller, 'saveAction');
            await clickEvent();

            // then
            expect(saveButton.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
            expect(controller.saveAction).toHaveBeenCalledTimes(1);
        });


    });

    describe('saveAction', () => {
        /** RecipientEditController */let controller;
        beforeEach(() => {
            controller = testRecipientEditControllerFactory();
        });

        it('should get data from form and save it to store in correct object', (done) => {
            // given
            const newValue = {
                fromNumber: '88 8888 8888 8888',
                recipient: 'new guy',
                recipientNumber: '22 2222 2222 2222',
                title: 'food',
                defaultAmount: '52'
            };

            setTimeout(async () => {
                fields.forEach(field => {
                    document.querySelector('#' + field.id).value = newValue[field.id];
                });

                // when
                await controller.saveAction();

                // then
                expect(mockRecipient).toEqual(newValue);
                expect(storeMock.saveRecipients).toHaveBeenCalledWith(mockRecipients)
                done();
            });
        });

        it('should redirect to recipient list after save', async () => {
            // given
            location.hash = 'edit';

            // when
            await controller.saveAction();

            // then
            expect(location.hash).toEqual('#recipients')
        })
    });

    function testRecipientEditControllerFactory() {
        return new RecipientEditController(viewManagerMock, queryFactory(), storeMock);
    }
});
