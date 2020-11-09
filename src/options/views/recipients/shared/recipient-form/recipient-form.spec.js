'use strict';

import { RecipientForm } from './recipient-form.js';

describe('RecipientForm', () => {
    const CONTAINER_ID = 'formContainer';
    const fieldsId = ['fromNumber', 'recipient', 'recipientNumber'];
    const requiredFieldsId = ['recipient'];
    /** @type RecipientForm */let form;

    beforeEach(() => {
        document.body.innerHTML = `<div id="${CONTAINER_ID}"></div>`;
        spyOn(HTMLAnchorElement.prototype, 'addEventListener').and.callThrough();
        form = testRecipientFormFactory();
    });

    describe('constructor', () => {
        const inputEvent = new InputEvent('input');
        const VALUE = '00000000000000';
        const FORMATTED_VALUE = '00 0000 0000 0000';
        let input;
        let addButton;

        beforeEach(() => {
            form.appendFormTo(`#${CONTAINER_ID}`);
            input = document.getElementById('recipientNumber');
            addButton = document.querySelector('.add-payment-button');
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

        it('should bind function to add payment button', () => {
            // then
            expect(addButton.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
        });

        it('should be one payment by default and remove button should be disabled', () => {
            // then
            const paymentRows = document.querySelectorAll('.payment');
            const removeButton = paymentRows[0].querySelector('.remove-payment-button');
            expect(paymentRows.length).toEqual(1);
            expect(removeButton.classList).toContain('disabled');
        })
    });

    describe('add-payment-button', () => {
        let button;
        beforeEach(() => {
            form.appendFormTo(`#${CONTAINER_ID}`);

            button = document.querySelector('.add-payment-button');
        });

        it('should add nex payment row', () => {
            // when
            button.click();

            // then
            const payments = document.querySelectorAll('.payment');
            expect(payments.length).toEqual(2);
        });

        it('should enable remove buttons', () => {
            // when
            button.click();

            // then
            const removeButtons = document.querySelectorAll('.payment .remove-payment-button');
            expect(removeButtons[0].classList).not.toContain('disabled');
            expect(removeButtons[1].classList).not.toContain('disabled');
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
            form.appendFormTo(`#${CONTAINER_ID}`);
        });

        it('should update form by recipient object', () => {
            // given
            const newValue = {
                fromNumber: '77 777 777',
                recipient: 'updated recipient',
                recipientNumber: '55 555 555',
                payments: [{ title: 'updated', amount: '69' }]
            };

            // when
            form.update(newValue);

            // then
            fieldsId.forEach(fieldId =>
                expect(document.getElementById(fieldId).value).toEqual(newValue[fieldId])
            );
            expect(document.querySelectorAll('.payment').length).toEqual(1);
            const paymentValue = getPaymentsValues(0);
            expect(paymentValue.title).toEqual(newValue.payments[0].title);
            expect(paymentValue.amount).toEqual(newValue.payments[0].amount);
        });

        it('should display empty string when value will be undefined or null', () => {
            // given
            const newValue = /** @type Recipient */{
                fromNumber: undefined,
                recipientNumber: null
            };

            // when
            form.update(newValue);

            // then
            expect(document.getElementById('fromNumber').value).toEqual('');
            expect(document.getElementById('recipientNumber').value).toEqual('');
        });

        it('should add multiple payments rows', () => {
            // given
            const payments = [
                { title: 'payment 1', amount: '123' },
                { title: '2 payment', amount: '297' },
                { title: '3 payment 3', amount: '399' }
            ]
            const newValue = {
                fromNumber: '99 4444 5555',
                recipient: 'multi payments',
                recipientNumber: '22 8888 3333',
                payments
            };

            // when
            form.update(newValue);

            // then
            fieldsId.forEach(fieldId =>
                expect(document.getElementById(fieldId).value).toEqual(newValue[fieldId])
            );

            expect(document.querySelectorAll('.payment').length).toEqual(3);
            expect(getPaymentsValues(0)).toEqual(payments[0]);
            expect(getPaymentsValues(1)).toEqual(payments[1]);
            expect(getPaymentsValues(2)).toEqual(payments[2]);
        });
    });

    describe('getRecipient', () => {
        let recipientData;

        beforeEach(() => {
            form.appendFormTo(`#${CONTAINER_ID}`);
            recipientData = {
                fromNumber: '11 2222 3333',
                recipient: 'changed recipient ',
                recipientNumber: '44 5555 6666',
                payments: [{
                    title: 'approved change',
                    amount: '67'
                }]
            };

            form.update(recipientData);
        });

        it('should return new object with form data', () => {
            // when
            const result = form.getRecipient();

            // then
            expect(result).toEqual(recipientData);
        });

        it('should update object passed as parameter', () => {
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
            form.appendFormTo(`#${CONTAINER_ID}`);
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

    describe('remove payment', () => {
        let removeButtons;
        let payments;

        beforeEach(() => {
            payments = [
                { title: 'title', amount: '111' },
                { title: 'payment', amount: '222' },
                { title: 'burgers', amount: '36.59' },
            ];
            form.appendFormTo(`#${CONTAINER_ID}`);

            removeButtons = document.querySelectorAll('.remove-payment-button')
        });

        it('should not remove las payment row', () => {
            // given
            expect(document.querySelectorAll('.payment').length).toEqual(1);

            // when
            removeButtons[0].click();

            // then
            expect(document.querySelectorAll('.payment').length).toEqual(1);
        });

        it('should remove row related with delete button', () => {
            // given
            form.update(/**@type Recipient */{ payments });
            removeButtons = document.querySelectorAll('.remove-payment-button');

            // when
            removeButtons[1].click();

            // then
            const paymentsElements = document.querySelectorAll('.payment');
            expect(paymentsElements.length).toEqual(2);
            expect(getPaymentsValues(0)).toEqual(payments[0]);
            expect(getPaymentsValues(1)).toEqual(payments[2]);
        });

        it('should disable las remove button', () => {
            // given
            form.update(/**@type Recipient */{ payments });
            removeButtons = document.querySelectorAll('.remove-payment-button');

            // when
            removeButtons[0].click();
            removeButtons[1].click();

            // then
            expect(removeButtons[2].classList).toContain('disabled');
        });
    });

    function testRecipientFormFactory() {
        return new RecipientForm(queryFactory(), templateHelperFactory());
    }

    function getPaymentsValues(paymentIndex) {
        const payments = document.querySelectorAll('.payment');
        return {
            title: payments[paymentIndex].querySelector('[id^="title"]').value,
            amount: payments[paymentIndex].querySelector('[id^="amount"]').value,
        }
    }
});
