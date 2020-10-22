'use strict';

import { RecipientForm } from './recipient-form.js';

describe('RecipientForm', () => {
    const CONTAINER_ID = 'formContainer';
    const fieldsId = ['fromNumber', 'recipient', 'recipientNumber', 'title', 'defaultAmount'];
    const requiredFieldsId = ['recipient'];
    /** @type RecipientForm */let form;

    beforeEach(() => {
        document.body.innerHTML = `<div id="${CONTAINER_ID}"></div>`;
        form = testRecipientFormFactory();
    });

    describe('constructor', () => {
        // ???
    });

    describe('appendFormTo', () => {
        it(`should add form by selector`, () => {
            // when
            form.appendFormTo(`#${CONTAINER_ID}`);

            // then
            fieldsId.forEach(field => {
                expect(document.getElementById(field)).not.toBeNull(`input for "${field}" is missing`);
                expect(document.querySelector(`label[for="${field}"]`)).not.toBeNull(`label for field "${field}" is missing`);
            });
        });

        it('should add form by node', () => {
            // given
            const node = document.getElementById(CONTAINER_ID);

            // when
            form.appendFormTo(node);

            // then
            fieldsId.forEach(field => {
                expect(document.getElementById(field)).not.toBeNull(`input for "${field}" is missing`);
                expect(document.querySelector(`label[for="${field}"]`)).not.toBeNull(`label for field "${field}" is missing`);
            });
        });
    });

    describe('update', () => {

        beforeEach(() => {
            mockAppendFormTo();
            form.appendFormTo('');
        });

        it('should update form by recipient object', () => {
            // given
            const newValue = {
                fromNumber: '77 777 777',
                recipient: 'updated recipient',
                recipientNumber: '55 555 555',
                title: 'updated',
                defaultAmount: '69',
            };

            // when
            form.update(newValue);

            // then
            fieldsId.forEach(fieldId =>
                expect(document.getElementById(fieldId).value).toEqual(newValue[fieldId])
            );
        });
    });

    describe('getRecipient', () => {
        let recipientData;

        beforeEach(() => {
            mockAppendFormTo()
            form.appendFormTo('');
            recipientData = {
                fromNumber: '11 2222 3333',
                recipient: 'changed recipient ',
                recipientNumber: '44 5555 6666',
                title: 'approved change',
                defaultAmount: '67',
            };

            fieldsId.forEach(fieldId => document.getElementById(fieldId).value = recipientData[fieldId]);
        });

        it('should return new object with form data', () => {
            // when
            const result = form.getRecipient();

            // then
            expect(result).toEqual(recipientData);
        });

        it('should update update object passed as parameter', () => {
            // given
            const result = {};

            // when
            form.getRecipient(result);

            // then
            expect(result).toEqual(recipientData);
        });
    });

    describe('isValid', () => {
        beforeEach(() => {
            mockAppendFormTo();
            form.appendFormTo('');
        });

        requiredFieldsId.forEach(requiredFieldId => {
            it(`should return false when field ${requiredFieldId} will be empty`, () => {
                // given
                document.getElementById(requiredFieldId).value = '  ';

                // when
                const result = form.isValid();

                // then
                expect(result).toBeFalse();
            });
        });

        it('should return true when all required value will not be empty', () => {
            // given
            requiredFieldsId.forEach(requiredFieldId =>
                document.getElementById(requiredFieldId).value = 'test value'
            );

            // when
            const result = form.isValid();

            // then
            expect(result).toBeTrue();
        });
    });

    function testRecipientFormFactory() {
        return new RecipientForm(queryFactory());
    }

    function mockAppendFormTo() {
        let fieldsHtml = '';
        fieldsId.forEach(fieldId => fieldsHtml += `<input id="${fieldId}">`);
        spyOn(form, 'appendFormTo').and.callFake(function () {
            document.getElementById(CONTAINER_ID).innerHTML = fieldsHtml;
            fieldsId.forEach(fieldId => this.fieldsInputs[fieldId] = document.getElementById(fieldId));
        })
    }
});
