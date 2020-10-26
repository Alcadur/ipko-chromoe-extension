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
        const inputEvent = new InputEvent('input');
        const VALUE = '00000000000000';
        const FORMATTED_VALUE = '00 0000 0000 0000';
        let input;

        beforeEach(() => {
            mockAppendFormTo();
            form.appendFormTo('');
            input = document.getElementById('recipientNumber');
        });

        it('should bind function to format recipient account number', () => {
            // given
            input.value = VALUE;
            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.value).toEqual(FORMATTED_VALUE);
        });

        it('should not change position when user enter something in middle of value', () => {
            // given
            const SELECT_POSITION = 5;
            input.value = FORMATTED_VALUE;
            input.value = `${input.value.substring(0, SELECT_POSITION)}1${input.value.substring(SELECT_POSITION)}`
            input.setSelectionRange(SELECT_POSITION, SELECT_POSITION);

            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.selectionStart).toEqual(SELECT_POSITION);
            expect(input.selectionEnd).toEqual(SELECT_POSITION);
        });

        it('should not change position when uer enter character at the end', () => {
            // given
            input.value = FORMATTED_VALUE;
            const position = input.selectionStart;

            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.selectionStart).toEqual(position);
        });

        it('should increase position when uer enter character at the end and it will be last number of 4-digit segment', () => {
            // given
            input.value = FORMATTED_VALUE;
            const position = input.selectionStart;
            input.value += '1';

            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.selectionStart).toEqual(position + 2);
        });

        it('should remove redundant whitespaces', () => {
            // given
            input.value = '00 0000       00 00';
            const expected = '00 0000 0000';

            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.value).toEqual(expected);
        });

        /**
         * 00 000|0 0000 0000 => 00 0001 |0000 0000 0
         */
        it('should increase position when user enter digit in the middle and it will be te last number of section', () => {
            // given
            const SELECT_POSITION = 7;
            input.value = FORMATTED_VALUE;
            input.value = `${input.value.substring(0, SELECT_POSITION)}1${input.value.substring(SELECT_POSITION)}`
            input.setSelectionRange(SELECT_POSITION, SELECT_POSITION);

            // when
            input.dispatchEvent(inputEvent);

            // then
            expect(input.selectionStart).toEqual(SELECT_POSITION + 1);
        });

        /**
         * 00 0000 0|000 => 00 0000| 000
         */
        it('should reduce position when user remove digit in the middle and it will be the first number of section', () => {
            // given
            const SELECT_POSITION = 8;
            input.value = FORMATTED_VALUE;
            input.value = `${input.value.substring(0, SELECT_POSITION - 1)}${input.value.substring(SELECT_POSITION)}`
            input.setSelectionRange(SELECT_POSITION, SELECT_POSITION);

            // when
            input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward' }));

            // then
            expect(input.selectionStart).toEqual(SELECT_POSITION - 1);
        });


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
        spyOn(form, 'appendFormTo').and.callFake(function () {
            const container = document.getElementById(CONTAINER_ID);
            fieldsId.forEach(fieldId => container.appendChild(this.fieldsInputs[fieldId]));
        })
    }
});
