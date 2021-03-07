import { RecipientAddController } from './recipient-add.controller.js';
import { RECIPIENTS_LIST } from '../../../options-urls.js';

describe('RecipientAddController', () => {
    /**
     * @type RecipientAddController
     */
    let controller;
    let recipientFormMock;
    let storeMock;
    let dialogServiceMock;
    let saveButton;
    let backButton;
    let recipients;
    let recipient;
    let viewNavigatorMock;

    beforeEach(() => {
        document.body.innerHTML = `<button id="saveButton"></button><button class="back-button"></button>`;
        saveButton = document.querySelector('#saveButton');
        backButton = document.querySelector('.back-button');
        recipients = [{ recipient: 'Gregory' }];
        recipient = { recipient: 'test' };
        recipientFormMock = jasmine.createSpyObj('recipientForm', {
            appendFormTo: null,
            isValid: true,
            getRecipient: recipient
        });
        storeMock = jasmine.createSpyObj('store', {
            getRecipients: Promise.resolve(recipients),
            saveRecipients: Promise.resolve()
        });
        dialogServiceMock = jasmine.createSpyObj('dialogService', ['open']);
        viewNavigatorMock = jasmine.createSpyObj('viewNavigator', ['moveToOnClick', 'moveTo']);

        controller = testRecipientAddControllerFactory();
    });

    describe('constructor', () => {
        it('should append form to container', () => {
            // then
            expect(recipientFormMock.appendFormTo).toHaveBeenCalledWith('#addForm');
        });

        it('should bind event listener to save button', () => {
            // given
            let eventHandler = () => {
            };
            spyOn(saveButton, 'addEventListener').and.callFake((_, callback) => eventHandler = callback);

            // when
            controller = testRecipientAddControllerFactory();
            spyOn(controller, 'saveAction').and.returnValue(Promise.resolve());
            eventHandler();

            // then
            expect(saveButton.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
            expect(controller.saveAction).toHaveBeenCalledTimes(1);
        });

        it('should bind event listener to back button', () => {
            // then
            expect(viewNavigatorMock.moveToOnClick).toHaveBeenCalledOnceWith('.back-button', RECIPIENTS_LIST());
        });
    });

    describe('saveAction', () => {
        it('should show dialog and stop function when form will be invalid', async () => {
            // given
            recipientFormMock.isValid.and.returnValue(false);

            // when
            await controller.saveAction()

            // then
            expect(dialogServiceMock.open).toHaveBeenCalledWith('Nazwa odbiorcy jest wymagana');
            expect(storeMock.saveRecipients).not.toHaveBeenCalled();
        });

        it('should save recipient after collect data from form', async () => {
            // given
            const expectedParameter = [...recipients, recipient];

            // when
            await controller.saveAction();

            // then
            expect(storeMock.saveRecipients).toHaveBeenCalledWith(expectedParameter);
        });

        it('should show the dialog and prevent the function when the new recipient name is already saved', async () => {
            // given
            recipient.recipient = recipients[0].recipient;

            // when
            await controller.saveAction();

            // then
            expect(dialogServiceMock.open).toHaveBeenCalledWith(`Odbiorce o nazwie "${recipient.recipient}" już istnieje`);
            expect(storeMock.saveRecipients).not.toHaveBeenCalled();
        });

        it('should redirect to recipients list after save', async () => {
            // when
            await controller.saveAction();

            // then
            expect(viewNavigatorMock.moveTo).toHaveBeenCalledOnceWith(RECIPIENTS_LIST());
        });
    })

    function testRecipientAddControllerFactory() {
        return new RecipientAddController(queryFactory(), recipientFormMock, storeMock, dialogServiceMock, viewNavigatorMock);
    }

});
