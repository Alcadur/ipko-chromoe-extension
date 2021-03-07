'use strict';

import { RecipientEditController } from './recipient-edit.controller.js';
import { RECIPIENTS_LIST } from '../../../options-urls.js';

describe('RecipientEditController', () => {
    let viewManagerMock;
    let storeMock;
    let mockRecipient;
    let mockRecipients;
    let recipientFormMock;
    let dialogServiceMock
    let viewNavigatorMock;

    beforeEach(() => {
        document.body.innerHTML = `<button class="back-button"></button>
        <div id="editForm"></div>
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
        recipientFormMock = jasmine.createSpyObj('recipientForm', ['appendFormTo', 'update', 'getRecipient', 'isValid']);
        recipientFormMock.update.and.returnValue(Promise.resolve());
        recipientFormMock.isValid.and.returnValue(true);
        dialogServiceMock = jasmine.createSpyObj('messageService', ['open']);
        viewNavigatorMock = jasmine.createSpyObj('viewNavigator', ['moveToOnClick', 'moveTo'])
    });

    describe('constructor', () => {
        it(`should append form to container`, () => {
            // when
            testRecipientEditControllerFactory();

            // then
            expect(recipientFormMock.appendFormTo).toHaveBeenCalledWith('#editForm');
        });

        it('should fill form', (done) => {
            // when
            testRecipientEditControllerFactory();

            // then
            setTimeout(() => {
                expect(recipientFormMock.update).toHaveBeenCalledWith(mockRecipient);
                done();
            });
        });

        it('should bind action to save button', async () => {
            // given
            let clickEvent = () => {};
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
            recipientFormMock.getRecipient.and.callFake((ref) => Object.assign(ref, newValue));

            setTimeout(async () => {
                // when
                await controller.saveAction();

                // then
                expect(mockRecipient).toEqual(newValue);
                expect(storeMock.saveRecipients).toHaveBeenCalledWith(mockRecipients)
                done();
            });
        });

        it('should redirect to recipient list after save', async () => {
            // when
            await controller.saveAction();

            // then
            expect(viewNavigatorMock.moveTo).toHaveBeenCalledOnceWith(RECIPIENTS_LIST())
        });

        it('should show modal information when form will be invalid', async () => {
            // given
            recipientFormMock.isValid.and.returnValue(false);

            // when
            await controller.saveAction();

            // then
            expect(dialogServiceMock.open).toHaveBeenCalledWith('Nazwa odbiorcy jest wymagana');
            expect(storeMock.saveRecipients).not.toHaveBeenCalled();
        });
    });

    function testRecipientEditControllerFactory() {
        return new RecipientEditController(viewManagerMock, queryFactory(), storeMock, recipientFormMock, dialogServiceMock, viewNavigatorMock);
    }
});
