'use strict';

/**
 * Thanks to Anulesh Tiwari for article: https://hustle.bizongo.in/simulate-react-on-change-on-controlled-components-baa336920e04
 */
class InputService {
    inputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    textareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

    /**
     * @param {Query} query
     */
    constructor(query) {
        this.query = query;
    }

    /**
     * @param {HTMLInputElement|HTMLTextAreaElement} input
     * @param {string} value
     */
    changeValue(input, value) {
        this.setterResolver(input).call(input, value);
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: value.charAt(0) }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    /**
     * @param {string} inputSelector
     * @param {string} value
     */
    changeValueBySelector(inputSelector, value) {
        const input = /** @type HTMLInputElement*/ this.query.one(inputSelector);
        this.changeValue(input, value);
    }

    /**
     * @private
     * @param {HTMLElement} field
     * @return {function}
     */
    setterResolver(field) {
        switch (field.tagName.toLowerCase()) {
            case 'input': return this.inputSetter;
            case 'textarea': return this.textareaSetter;
        }
    }
}

function inputServiceFactory() { return new InputService(queryFactory()) }
const inputService = inputServiceFactory();
