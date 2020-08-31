'use strict';

class Query {
    /**
     * Alias for document.querySelector
     *
     * @param {string} selector
     * @param {Element} [parentElement=document.body]
     * @returns {Element}
     */
    one(selector, parentElement = document.body) {
        return parentElement.querySelector(selector);
    }

    /**
     * Alias for document.querySelectorAll
     *
     * @param {string} selector
     * @param {Element} parentElement,
     * @returns {NodeListOf<Element>}
     */
    all(selector, parentElement = document.body) {
        return parentElement.querySelectorAll(selector);
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
