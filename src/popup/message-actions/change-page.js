/**
 * @param {string} page
 * @param {HTMLElement} container
 */
export function changePageAction(page, container) {
    container.querySelector('#getRecipients').disabled = page !== 'OdbiorcyKrajowi';
}
