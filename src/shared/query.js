'use strict';

class Query {
    /**
     * Alias for document.querySelector
     *
     * @param {string} selector
     * @param {HTMLElement} [parentElement=document.body]
     * @returns {HTMLElement}
     */
    one(selector, parentElement = document.body) {
        return parentElement.querySelector(selector);
    }

    /**
     * Alias for document.querySelectorAll
     *
     * @param {string} selector
     * @param {HTMLElement} parentElement,
     * @returns {NodeListOf<HTMLElement>}
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
