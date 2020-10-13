describe('InputService', () => {
    const inputDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    const textareaDescriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');

    /**
     * @type InputService
     */
    let inputService;
    let input;
    let textarea;

    beforeEach(() => {
        inputService = new InputService(queryFactory());
        input = document.createElement('input');
        textarea = document.createElement('textarea');
    });

    describe('changeValue', () => {
        it('should change input value to given using descriptor setter', () => {
            // given
            spyOn(inputDescriptor.set, 'call').and.callThrough();
            const NEW_VALUE = 'it is raining day';

            // when
            inputService.changeValue(input, NEW_VALUE);

            expect(input.value).toEqual(NEW_VALUE);
            expect(inputDescriptor.set.call).toHaveBeenCalledTimes(1);
            expect(inputDescriptor.set.call).toHaveBeenCalledWith(input, NEW_VALUE);
        });

        it('should change textarera value to given using descriptor setter', () => {
            // given
            spyOn(textareaDescriptor.set, 'call').and.callThrough();
            const NEW_VALUE = 'it is windy day';

            // when
            inputService.changeValue(textarea, NEW_VALUE);

            // then
            expect(textarea.value).toEqual(NEW_VALUE);
            expect(textareaDescriptor.set.call).toHaveBeenCalledTimes(1);
            expect(textareaDescriptor.set.call).toHaveBeenCalledWith(textarea, NEW_VALUE);
        });

        it('should dispatch key down event with first character', () => {
            // given
            const VALUE = 'a23456';
            spyOn(input, 'dispatchEvent');

            // when
            inputService.changeValue(input, VALUE);

            // then
            expect(input.dispatchEvent).toHaveBeenCalledWith(new KeyboardEvent('keydown', { bubbles: true, key: VALUE.charAt(0) }))
        });

        it('should dispatch input event', () => {
            // given
            spyOn(input, 'dispatchEvent');

            // when
            inputService.changeValue(input, '');

            // then
            expect(input.dispatchEvent).toHaveBeenCalledWith(new Event('input', { bubbles: true }))
        });
    });

    describe('changeValueBySelector', () => {
        it('should change value base on css selector', () => {
            // given
            const INPUT_ID = 'worker';
            const NEW_VALUE = 'sun shine';
            document.body.innerHTML = `<input id='${INPUT_ID}'>`;

            // when
            inputService.changeValueBySelector(`#${INPUT_ID}`, NEW_VALUE);

            // then
            expect(document.querySelector(`#${INPUT_ID}`).value).toEqual(NEW_VALUE);
        });

        it('should use changeValue', () => {
            // given
            spyOn(inputService, 'changeValue');

            // then
            inputService.changeValueBySelector('.class', 'value');

            // then
            expect(inputService.changeValue).toHaveBeenCalled();
        })
    });
});
