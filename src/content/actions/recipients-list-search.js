'use strict';

class RecipientsListSearch {

    /**
     * @param {Query} query
     * @param {Storage} store
     */
    constructor(query, store) {
        this.query = query;
        this.store = store;
    }

    // TODO: tests
    async init() {
        this.table = this.query.one('tbody.iwUhV');
        if (!this.table) {
            return;
        }
        this.rows = this.table.querySelectorAll('tr');
        this.searchInput = this.query.one('[name$="data.filterForm.recipient"]');
        this.searchInput.addEventListener('input', () => this.searchInputEventHandler());

        const recipients = await this.store.getRecipients();

        this.rows.forEach(row => {
            const longName = row.querySelector('._2iYRB').innerText.toLowerCase();
            let searchData = `${longName}`;

            const recipient = recipients
                .find(recipient => recipient.recipient.toLowerCase() === longName.toLowerCase())
            if (recipient) {
                searchData += ' ' + recipient.aliases.join(' ');
            }

            row.setAttribute('data-ipko-plus-search', searchData.toLowerCase());
        });
    }

    searchInputEventHandler() {
        if (this.searchInput.value.length < 2) {
            this.showAll();
            return;
        }
        this.hideAll();
        // TODO: tests for .toLowerCase
        this.table.querySelectorAll(`tr[data-ipko-plus-search*="${this.searchInput.value.toLowerCase()}"]`)
            .forEach(row => this.showOne(row));
    }

    /**
     * Show all table rows
     */
    showAll() {
        this.rows.forEach(row => this.showOne(row));
    }

    /**
     * Show single table row
     *
     * @param {HTMLElement} row
     */
    showOne(row) {
        row.style.display = 'inherit'
    }

    /**
     * Hide all table rows
     */
    hideAll() {
        this.rows.forEach(row => row.style.display = 'none');
    }
}

/**
 * @returns {RecipientsListSearch}
 */
function recipientsListSearchFactory() { return new RecipientsListSearch(queryFactory(), storageFactory()); }

/**
 * @type {RecipientsListSearch}
 */
const recipientsListSearch = recipientsListSearchFactory();
