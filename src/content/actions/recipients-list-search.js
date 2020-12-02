'use strict';

class RecipientsListSearch {

    /**
     * @param {Query} query
     */
    constructor(query) {
        this.query = query;
    }

    init() {
        this.table = this.query.one('tbody.iwUhV');
        if (!this.table) {
            return;
        }
        this.rows = this.table.querySelectorAll('tr');
        this.searchInput = this.query.one('[name$="data.filterForm.recipient"]');
        this.searchInput.addEventListener('input', () => this.searchInputEventHandler());

        this.rows.forEach(row => {
            const name = row.querySelector('._3gND8').innerText.toLowerCase();
            const longName = row.querySelector('._2iYRB').innerText.toLowerCase();

            row.setAttribute('data-ipko-plus-search', `${name} ${longName}`);
        });
    }

    searchInputEventHandler() {
        if (this.searchInput.value.length < 2) {
            this.showAll();
            return;
        }
        this.hideAll();
        this.table.querySelectorAll(`tr[data-ipko-plus-search*="${this.searchInput.value}"]`)
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
function recipientsListSearchFactory() { return new RecipientsListSearch(queryFactory()); }

/**
 * @type {RecipientsListSearch}
 */
const recipientsListSearch = recipientsListSearchFactory();
