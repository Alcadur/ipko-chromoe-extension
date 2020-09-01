describe('payment-live-recipient-search', () => {
    const SEARCH_FIELD_NAME = 'prefix-data.recipient.name'
    /**
     * @type {PaymentLiveRecipientSearch}
     */
    let paymentLiveRecipientSearch;
    /**
     * @type {Storage}
     */
    let storageMock;
    /**
     * @type {Recipient[]}
     */
    let recipients;
    /**
     * @type {PaymentFormService}
     */
    let paymentFormServiceMock;

    beforeEach(() => {
        document.addEventListener.calls.reset();
        window.addEventListener.calls.reset();
        recipients = [];
        paymentFormServiceMock = jasmine.createSpyObj('paymentFormServiceMock', ['fill']);
        storageMock = jasmine.createSpyObj('storageMock', {getRecipients: Promise.resolve(recipients)});
        paymentLiveRecipientSearch = new PaymentLiveRecipientSearch(queryFactory(), storageMock, paymentFormServiceMock);
        document.body.innerHTML = `<textarea name="${SEARCH_FIELD_NAME}">`;
    });

    describe('init', () => {
        it('should prepare wrapper', async () => {
            // given

            // when
            await paymentLiveRecipientSearch.init();

            // then
            expect(paymentLiveRecipientSearch.wrapper.classList).toContain(paymentLiveRecipientSearch.wrapperClassName);
            expect(paymentLiveRecipientSearch.wrapper.querySelector('ul')).toBeTruthy();
        });

        it('should prepare row template', async () => {
            // given

            // when
            await paymentLiveRecipientSearch.init();

            // then
            expect(paymentLiveRecipientSearch.rowTemplate).toBeTruthy();
            expect(paymentLiveRecipientSearch.rowTemplate.textContent).toContain('$recipient');
        });

        it('should bind events', async () => {
            // given
            const inputField = document.body.querySelector('textarea');
            spyOn(inputField, 'addEventListener');

            // when
            await paymentLiveRecipientSearch.init();

            // then
            expect(window.addEventListener).toHaveBeenCalledTimes(1);
            expect(window.addEventListener).toHaveBeenCalledWith('resize', paymentLiveRecipientSearch.updateWrapperPosition);
            expect(document.addEventListener).toHaveBeenCalledTimes(1);
            expect(document.addEventListener).toHaveBeenCalledWith('click', paymentLiveRecipientSearch.documentClickHandler);
            expect(paymentLiveRecipientSearch.searchInputField.addEventListener).toHaveBeenCalledTimes(3);
            expect(paymentLiveRecipientSearch.searchInputField.addEventListener).toHaveBeenCalledWith('input', paymentLiveRecipientSearch.filter);
            expect(paymentLiveRecipientSearch.searchInputField.addEventListener).toHaveBeenCalledWith('focus', paymentLiveRecipientSearch.filter);
            expect(paymentLiveRecipientSearch.searchInputField.addEventListener).toHaveBeenCalledWith('keyup', paymentLiveRecipientSearch.searchInputKeyDownHandle);
        });
    });

    describe('updateWrapperPosition', () => {
        let mockedBounding;
        beforeEach(async () => {
            mockedBounding = { left: 45, top: 50, height: 45, width: 250 };
            await paymentLiveRecipientSearch.init();
            spyOn(paymentLiveRecipientSearch.searchInputField, 'getBoundingClientRect').and.returnValue(mockedBounding);
       });

        it('should set wrapper position and width based on input field properties', () => {
            // given
            const expectedLeft = mockedBounding.left + 'px';
            const expectedTop = mockedBounding.top + mockedBounding.height - 4 + 'px';
            const expectedWidth = mockedBounding.width - 22 + 'px';

            // when
            paymentLiveRecipientSearch.updateWrapperPosition();

            // then
            expect(paymentLiveRecipientSearch.wrapper.style.width).toEqual(expectedWidth);
            expect(paymentLiveRecipientSearch.wrapper.style.left).toEqual(expectedLeft);
            expect(paymentLiveRecipientSearch.wrapper.style.top).toEqual(expectedTop);
        });
    });

    describe('filter', () => {
        beforeEach(async () => {
            await paymentLiveRecipientSearch.init();
        });

        it('should should not add list when search input is lower then two characters', () => {
            // given
            paymentLiveRecipientSearch.searchInputField.value = '1';

            // when
            paymentLiveRecipientSearch.filter();

            // then
            const listWrapper = document.querySelector('.' + paymentLiveRecipientSearch.wrapperClassName)
            expect(listWrapper).toBeNull();
        });

        it('should add recipients list when input length will be equal two', () => {
            // given
            paymentLiveRecipientSearch.searchInputField.value = '12';

            // when
            paymentLiveRecipientSearch.filter();

            // then
            const listWrapper = document.querySelector('.' + paymentLiveRecipientSearch.wrapperClassName)
            expect(listWrapper).toBeTruthy();
        });

        it('should contain one row for each matching recipient', () => {
            // given
            const searchName = 'my';
            const expectedFiltrationResult = [
                { recipient: 'My dog' },
                { recipient: 'my hamster' },
                { recipient: 'blemyble' },
                { recipient: 'blemy' },
            ];
            recipients.push(expectedFiltrationResult[0]);
            recipients.push({ recipient: 'Mom fish' });
            recipients.push(expectedFiltrationResult[1]);
            recipients.push(expectedFiltrationResult[2]);
            recipients.push(expectedFiltrationResult[3]);
            paymentLiveRecipientSearch.searchInputField.value = searchName;
            // when

            paymentLiveRecipientSearch.filter();

            // then
            const rows = paymentLiveRecipientSearch.wrapper.querySelectorAll('ul li');
            expect(rows.length).toEqual(expectedFiltrationResult.length);
        });

        it('should not add two wrappers', () => {
            // given
            paymentLiveRecipientSearch.searchInputField.value = '123';

            // when
            paymentLiveRecipientSearch.filter();
            paymentLiveRecipientSearch.filter();

            // then
            const wrappers = document.body.querySelectorAll('.' + paymentLiveRecipientSearch.wrapperClassName);
            expect(wrappers.length).toEqual(1);
        });

        it('should remove wrapper and clear list when input length will be lower then two', () => {
            // given
            recipients.push({ recipient: '123' });
            paymentLiveRecipientSearch.searchInputField.value = '123';
            paymentLiveRecipientSearch.filter();
            paymentLiveRecipientSearch.searchInputField.value = '1';

            // when
            paymentLiveRecipientSearch.filter();

            // then
            expect(document.body.querySelector('.' + paymentLiveRecipientSearch.wrapperClassName)).toBeNull();
            expect(paymentLiveRecipientSearch.wrapper.querySelectorAll('ul li').length).toEqual(0);
        });
    });

    describe('documentClickHandler', () => {
        const event = { target: document.body };
        let wrapperSelector;

        beforeEach(async () => {
            wrapperSelector = '.' + paymentLiveRecipientSearch.wrapperClassName;
            document.body.innerHTML = `<textarea name="prefix-data.recipient.name">`;
            await paymentLiveRecipientSearch.init();
            document.body.appendChild(paymentLiveRecipientSearch.wrapper);
            paymentLiveRecipientSearch.wrapper.appendChild(document.createElement('li'));
        });

        it('should remove wrapper when event is ont of wrapper content', () => {
            // given
            event.target = document.body;

            // when
            paymentLiveRecipientSearch.documentClickHandler(event);

            // then
            expect(document.querySelector(wrapperSelector)).toBeNull();
        });

        it('should not remove wrapper when event is from wrapper', () => {
            // given
            event.target = paymentLiveRecipientSearch.wrapper.querySelector('li');

            // when
            paymentLiveRecipientSearch.documentClickHandler(event);

            // then
            expect(document.querySelector(wrapperSelector)).toBeTruthy();
        });

        it('should not remove wrapper when event is input search field', () => {
            // given
            event.target = paymentLiveRecipientSearch.searchInputField;

            // when
            paymentLiveRecipientSearch.documentClickHandler(event);

            // then
            expect(document.querySelector(wrapperSelector)).toBeTruthy();
        });

        it('should remove wrapper and all binding when there will be no search input field in documeny', () => {
            // given
            spyOn(paymentLiveRecipientSearch.searchInputField, 'removeEventListener').and.callThrough();
            event.target = paymentLiveRecipientSearch.wrapper;
            paymentLiveRecipientSearch.searchInputField.remove();

            // when
            paymentLiveRecipientSearch.documentClickHandler(event);

            // then
            expect(document.querySelector(wrapperSelector)).toBeNull();
            expect(document.removeEventListener).toHaveBeenCalledWith('click', paymentLiveRecipientSearch.documentClickHandler);
            expect(paymentLiveRecipientSearch.searchInputField.removeEventListener).toHaveBeenCalledWith('input', paymentLiveRecipientSearch.filter);
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', paymentLiveRecipientSearch.updateWrapperPosition);
        });
    });

    describe('searchInputKeyDownHandle', () => {
        const eventUp = { key: 'ArrowUp' };
        const eventDown = { key: 'ArrowDown' };
        const eventEnter = { key: 'Enter' };

        let recipients;

        beforeEach(async () => {
            document.body.innerHTML = '<textarea name="prefix-data.recipient.name"></textarea>';
            await paymentLiveRecipientSearch.init();
            recipients = [
                { recipient: '00123' },
                { recipient: '40056' },
                { recipient: '78009' }
            ];
            paymentLiveRecipientSearch.recipients = recipients;
            paymentLiveRecipientSearch.searchInputField.value = '00';
            paymentLiveRecipientSearch.filter();
        });

        it('should be only one selected row at time', () => {
            // given

            // when
            paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);
            paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);

            // then
            expect(document.querySelectorAll('li.selected').length).toEqual(1);
        });

        describe('moveDown', () => {
            it('should mark first element as selected when current selected element index will be equal -1', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = -1;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);

                // then
                expect(getLiAt(0).className).toContain('selected');
            });

            it(`should move selection down`, () => {
                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);
                // then
                expect(getLiAt(0).className).toContain('selected');

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);
                // then
                expect(getLiAt(1).className).toContain('selected');

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);
                // then
                expect(getLiAt(2).className).toContain('selected');
            });

            it('should back to first element when list is over', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = recipients.length - 1;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown);

                // then
                expect(getLiAt(0).classList).toContain('selected');
                expect(paymentLiveRecipientSearch.currentSelectedIndex).toEqual(0);
            });

            it('should not throw error when filtered recipients array is empty', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = -1;
                paymentLiveRecipientSearch.filteredRecipients = [];

                // when
                // then
                expect(() => paymentLiveRecipientSearch.searchInputKeyDownHandle(eventDown)).not.toThrow();
            });
        });

        describe('arrowUpHandle', () => {
            it('should move to last element when current selected element index will be equal -1', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = -1;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp);

                // then
                expect(getLiAt(2).className).toContain('selected');
            });

            it(`should move selection up`, () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = recipients.length;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp);
                // then
                expect(getLiAt(2).className).toContain('selected');

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp);
                // then
                expect(getLiAt(1).className).toContain('selected');

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp);
                // then
                expect(getLiAt(0).className).toContain('selected');
            });

            it('should move to last element when first element is selected', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = 0;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp);

                // then
                expect(getLiAt(2).classList).toContain('selected');
                expect(paymentLiveRecipientSearch.currentSelectedIndex).toEqual(2);
            });

            it('should not throw error when filtered recipients array is empty', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = -1;
                paymentLiveRecipientSearch.filteredRecipients = [];

                // when
                // then
                expect(() => paymentLiveRecipientSearch.searchInputKeyDownHandle(eventUp)).not.toThrow();
            });
        });

        describe('enterHandle', () => {
            beforeEach(() => {
                document.body.innerHTML = '';
                document.body.appendChild(paymentLiveRecipientSearch.wrapper);
            });

            it('should remove wrapper and clear data', () => {
                // given

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventEnter);

                // then
                expect(document.querySelector('.' + paymentLiveRecipientSearch.wrapperClassName)).toBeNull();
                expect(paymentLiveRecipientSearch.currentSelectedIndex).toEqual(-1);
                expect(paymentLiveRecipientSearch.filteredRecipients).toEqual([]);
            });

            it('should fill form by selected recipient data', () => {
                // given
                const SELECTED_INDEX = 1;
                paymentLiveRecipientSearch.currentSelectedIndex = SELECTED_INDEX;

                // when
                paymentLiveRecipientSearch.searchInputKeyDownHandle(eventEnter);

                // then
                expect(paymentFormServiceMock.fill).toHaveBeenCalledTimes(1);
                expect(paymentFormServiceMock.fill).toHaveBeenCalledWith(recipients[SELECTED_INDEX])
            });

            it('should not throw error when filtered recipients array is empty', () => {
                // given
                paymentLiveRecipientSearch.currentSelectedIndex = -1;
                paymentLiveRecipientSearch.filteredRecipients = [];

                // when
                // then
                expect(() => paymentLiveRecipientSearch.searchInputKeyDownHandle(eventEnter)).not.toThrow();
            });
        });

        /**
         * @param {number} index
         * @returns {HTMLLIElement}
         */
        function getLiAt(index) {
            return paymentLiveRecipientSearch.wrapper.querySelectorAll('li')[index];
        }
    });
});
