'use strict';

class Query {
    /**
     * Alias for document.querySelector
     *
     * @param {string} selector
     * @returns {Element}
     */
    one(selector) {
        return document.querySelector(selector);
    }

    /**
     * Alias for document.querySelectorAll
     *
     * @param {string} selector
     * @returns {NodeListOf<Element>}
     */
    all(selector) {
        return document.querySelectorAll(selector);
    }
}

/**
 * @returns {Query}
 */
function queryFactory() { return new Query(); }

/**
 * @type {Query}
 */
const query = queryFactory();
