describe('recipients-list-search', () => {
    const CUSTOM_ATTR_NAME = 'data-ipko-plus-search';

    /**
     * @type {RecipientsListSearch}
     */
    let recipientsListSearch;

    beforeEach(() => {
        recipientsListSearch = new RecipientsListSearch(queryFactory());
        prepareDOM();
    });

    describe('init', () => {
        it('should not throw error when there will bo no table', () => {
            // given
            document.body.innerHTML = '';

            expect(() => recipientsListSearch.init()).not.toThrowError();
        });

        it('should extend rows by custom attribute', () => {
            // given

            // when
            recipientsListSearch.init();

            // then
            document.querySelectorAll('tr').forEach((row, index) => {
                const rowNo = index + 1;
                expect(row.getAttribute(CUSTOM_ATTR_NAME)).toEqual(`row${rowNo} ${rowNo}row`);
            });
        });

        it('should bind event to search input field', () => {
            // given
            spyOn(recipientsListSearch, 'searchInputEventHandler');
            recipientsListSearch.init();
            const inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true
            });

            // when
            recipientsListSearch.searchInput.dispatchEvent(inputEvent);

            // then
            expect(recipientsListSearch.searchInputEventHandler).toHaveBeenCalledTimes(1);
        });
    });

    describe('searchInputEventHandler', () => {
        beforeEach(() => {
            recipientsListSearch.init();
        });

        it('should hide all rows when there will be no match one', () => {
            // given
            recipientsListSearch.searchInput.value = 'no-value';

            // when
            recipientsListSearch.searchInputEventHandler();

            // then
            document.querySelectorAll('tr').forEach(row => {
                expect(row.style.display).toEqual('none');
            });
        });

        it('should show all if input length is lower then 2', () => {
            // given
            document.querySelectorAll('tr').forEach(row => {
                row.style.display = 'none';
            });
            recipientsListSearch.searchInput.value = 'n';

            // when
            recipientsListSearch.searchInputEventHandler();

            // then
            document.querySelectorAll('tr').forEach(row => {
                expect(row.style.display).toEqual('inherit');
            });
        });

        it('should show rows wchich match search string', () => {
            // given
            recipientsListSearch.searchInput.value = 'row1';

            // when
            recipientsListSearch.searchInputEventHandler();

            // then
            expect(document.querySelector('tr:nth-child(1)').style.display).toEqual('inherit');
            expect(document.querySelector('tr:nth-child(2)').style.display).toEqual('none');
            expect(document.querySelector('tr:nth-child(3)').style.display).toEqual('none');
        });
    });

    function prepareDOM() {
        document.body.innerHTML = `
        <input type="text" name="custom-prefix-data.filterForm.recipient">
        <table>
            <tbody class="iwUhV">
                <tr><td><div class="_3gND8">row1</div><div class="_2iYRB">1row</div></td></tr>
                <tr><td><div class="_3gND8">row2</div><div class="_2iYRB">2row</div></td></tr>
                <tr><td><div class="_3gND8">row3</div><div class="_2iYRB">3row</div></td></tr>
            </tbody>
        </table>
        `;
    }
});
