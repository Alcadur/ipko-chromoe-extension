/**
 * Alias for document.querySelector
 *
 * @param {string} selector
 * @returns {Element}
 */
function query(selector) {
    return document.querySelector(selector);
}

/**
 * Alias for document.querySelectorAll
 *
 * @param {string} selector
 * @returns {NodeListOf<Element>}
 */
function queryAll(selector) {
    return document.querySelectorAll(selector);
}
