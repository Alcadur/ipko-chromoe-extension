import { changePageAction } from './change-page.js';

describe('change-page', () => {
    const BUTTON_ID = 'getRecipients';
    const BUTTON_SELECTOR = `#${BUTTON_ID}`;
    let button;

    beforeEach(() => {
        document.body.innerHTML = `<button id="${BUTTON_ID}"></button>`;
        button = document.querySelector(BUTTON_SELECTOR);
    });

    it('should disable button wen page will be different then "OdbiorcyKrajowi"', () => {
        // given
        const PAGE = 'test page';
        button.disabled = false;

        // when
        changePageAction(PAGE, document.body);

        // then
        expect(button.disabled).toBeTrue();
    });

    it('should enable button wen page will be equal to "OdbiorcyKrajowi"', () => {
        // given
        const PAGE = 'OdbiorcyKrajowi';
        button.disabled = true;

        // when
        changePageAction(PAGE, document.body);

        // then
        expect(button.disabled).toBeFalse();
    });
});
