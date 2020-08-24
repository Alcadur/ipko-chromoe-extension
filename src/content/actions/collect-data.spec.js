describe('collect-data.js', () => {
    let spy;
    let backButtonAction;

    beforeAll(() => {
        mockFunction('waitFor');
    });

    afterAll(() => {
        restoreFunction('waitFor');
    });

    beforeEach(() => {
        spy = jasmine.createSpy('spy');
        backButtonAction = jasmine.createSpy('backButtonAction');

        prepareDOM();

        waitFor = jasmine.createSpy('waitForSpy').and.callFake(() => new Promise((resolve) => resolve()));
    });

    describe('collectData', () => {
        const NUMBER_OF_ROWS = 3;

        beforeEach(() => {
            document.body.innerHTML = `
                <table class="iwUhV">
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                </table>
            `;
        });

        it('should count number of all recipients', (done) => {
            // when
            collectData().then(() => {
                // then
                expect(numberOfRecipients).toEqual(NUMBER_OF_ROWS);
                done();
            });
        });

        it('should open layer if it is not opened', (done) => {
            // given
            isLayerOpen = false;

            // when
            collectData().then(() => {
                // then
                expect(openLayer).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should not open second layer when one is opened', (done) => {
            // given
            isLayerOpen = true;

            // when
            collectData().then(() => {
                // then
                expect(openLayer).not.toHaveBeenCalled();
                done();
            });
        });

        it('should update layer info, get data and back to list', (done) => {
            // when
            collectData().then(() => {
                // then
                expect(updateLayerInfo).toHaveBeenCalledTimes(1);
                expect(getData).toHaveBeenCalledTimes(1);
                expect(backToList).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should call collectData until there will be no row left', (done) => {
            // given
            currentRowIndex = 0;
            // hasNext.and.returnValues(true, true, false);
            spyOn(window, 'collectData');
            collectData.and.callThrough();

            // when
            collectData().then(() => {
                // then
                expect(collectData).toHaveBeenCalledTimes(3);
                done();
            });
        });

        it('should save recipients, clear layer and reset current row index', (done) => {
            // given
            currentRowIndex = 555;
            hasNext.and.returnValue(false);

            // when
            collectData().then(() => {
                // then
                expect(storage.saveRecipients).toHaveBeenCalledTimes(1);
                expect(storage.saveRecipients).toHaveBeenCalledWith(recipients);
                expect(closeLayer).toHaveBeenCalledTimes(1);
                expect(currentRowIndex).toEqual(0);
                done();
            });
        });
    });

    describe('openLayer', () => {
        beforeEach(() => {
            document.body.innerHTML = '';
        });

        it('should add layer node to DOM', () => {
            // when
            openLayer();

            // then
            expect(document.querySelector(layerSelector)).toBeTruthy();
        });

        it('should contains data container', () => {
            // when
            openLayer();

            // then
            expect(document.querySelector('.collected-data-number')).toBeTruthy();
        });

        it('should mark layer as open', () => {
            // given
            isLayerOpen = false;

            // when
            openLayer();

            // then
            expect(isLayerOpen).toBeTrue();
        });
    });

    describe('closeLayer', () => {
        beforeEach(() => {
            document.body.innerHTML = `<div class="${layerClassName}"></div>`;
        });

        it('should remove layer from DOM', () => {
            // when
            closeLayer();

            // then
            expect(document.querySelector(layerSelector)).toBeNull();
        });

        it('should mark layer as closed', () => {
            // given
            isLayerOpen = true;

            // when
            closeLayer();

            // then
            expect(isLayerOpen).toBe(false);

        });
    });

    describe('updateLayerInfo', () => {
        const DATA_CLASS_NAME = 'collected-data-number';

        beforeEach(() => {
            document.body.innerHTML = `<div class="${layerClassName}"><span class="${DATA_CLASS_NAME}">9999</span></div>`
        });

        it('should overwrite layer number of collected data by current row index', () => {
            // given
            currentRowIndex = 150;

            // when
            updateLayerInfo();

            // then
            expect(document.querySelector('.' + DATA_CLASS_NAME).textContent).toEqual(currentRowIndex.toString());
        });
    });

    describe('getData', () => {

        let fromNumber;
        let recipient;
        let recipientNumber;
        let title;

        beforeEach(() => {
            recipients.length = 0;

            fromNumber = '1111111111';
            recipient = 'Best recipient';
            recipientNumber = '666999666999';
            title = `(~'.')~ ~(^.^)~ ~('.'~)`;

            mockFunction('enterTo');
        });

        afterEach(() => {
            restoreFunction('enterTo');
        });

        it('should enter to given row index', (done) => {
            // given
            generateDetailsForm();
            const rowIndex = 5;

            // when
            getData(rowIndex).then(() => {
                expect(enterTo).toHaveBeenCalledTimes(1);
                expect(enterTo).toHaveBeenCalledWith(rowIndex);
                done();
            });
        });

        it('should push new recipient to recipients array', (done) => {
            // given
            generateDetailsForm();

            // when
            getData(0).then(() => {
                // then
                expect(recipients.length).toEqual(1);
                expect(recipients[0]).toEqual({ fromNumber, recipient, recipientNumber, title });
                done();
            });
        });

        it('should replace fromNumber by the empty string when there will bo no such element', (done) => {
            // given
            generateDetailsForm();
            document.body.querySelector('._3pHQr').remove();

            // when
            getData(0).then(() => {
                // then
                expect(recipients[0]).toEqual(jasmine.objectContaining({ fromNumber: '' }));
                done();
            });
        });

        function generateDetailsForm() {
            document.body.innerHTML = `
                <div class="_3pHQr">${fromNumber}</div>
                <input type="text" name="long-prefix-data.recipient.name" value="${recipient}">
                <input type="text" name="long-prefix-data.recipient.account.number" value="${recipientNumber}">
                <input type="text" name="long-prefix-data.title" value="${title}">
            `;
        }
    });

    describe('enterTo', () => {
        const testData = [0, 1, 2];
        testData.forEach(rowIndex =>
            it(`should click on given row (no. ${ rowIndex + 1 })`, (done) => {
                // given
                document.querySelector(`[data-test-element="row${rowIndex + 1}"]`).click = spy;

                // when
                enterTo(rowIndex).then(() => {
                    // then
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                });
            })
        )

        it('should wait until details page will be loaded', (done) => {
            // when
            enterTo(0).then(() => {
                // then
                expect(waitFor).toHaveBeenCalledWith(detailsPageCheckSelector);
                expect(waitFor).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('backToList', () => {
        beforeEach(() => {
            waitFor.calls.reset();
            console.log(backToList)
        });

        it('should click on back button', (done) => {
            // when
            backToList().then(() => {
                // then
                expect(backButtonAction).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should wait until list view will not be loaded', (done) => {
            // when
            backToList().then(() => {
                // then
                expect(waitFor).toHaveBeenCalledWith(listTableSelector);
                expect(waitFor).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('hasNext', () => {
        it('should return true if current row index increased by one will be lower then number of all recipients', () => {
            // given
            currentRowIndex = 5;
            numberOfRecipients = 10;

            // when
            const result = hasNext();

            // then
            expect(result).toBe(true);
        });

        it('should return false if current row index increased by one will be grater then number of all recipients', () => {
            // given
            currentRowIndex = 10;
            numberOfRecipients = 10;

            // when
            const result = hasNext();

            // then
            expect(result).toBe(false);
        });

        it('should return false if current row index increased by one will be equal to number of all recipients', () => {
            // given
            currentRowIndex = 9;
            numberOfRecipients = 10;

            // when
            const result = hasNext();

            // then
            expect(result).toBe(false);
        });
    });

    function prepareDOM() {
        document.body.innerHTML = `
            <table class="iwUhV">
                <tr data-test-element="row1"></tr>
                <tr data-test-element="row2"></tr>
                <tr data-test-element="row3"></tr>
            </table>
            
            <button value="cancel" data-test-element="cancelButton"></button>
        `;
        const cancelButton = document.querySelector('[data-test-element="cancelButton"]');
        cancelButton.addEventListener('click', backButtonAction);

        document.body.appendChild(cancelButton);
    }
});
