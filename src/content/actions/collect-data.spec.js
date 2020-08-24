describe('collect-data.js', () => {
    let spy;
    let storageMock;
    let waitMock;
    let backButtonAction;
    let collectData;

    beforeEach(() => {
        storageMock = jasmine.createSpyObj('storageMock', ['saveRecipients', 'getRecipients']);
        storageMock.getRecipients.and.callFake(() => new Promise((resolve) => resolve()));

        waitMock = jasmine.createSpyObj('waitMock', ['for']);
        waitMock.for.and.callFake(() => new Promise((resolve) => resolve()));

        spy = jasmine.createSpy('spy');
        backButtonAction = jasmine.createSpy('backButtonAction');
        prepareDOM();
        collectData = new CollectData(queryFactory(), storageMock, waitMock);
    });

    describe('collectData', () => {
        const NUMBER_OF_ROWS = 3;

        beforeEach(() => {

            spyOn(collectData, 'openLayer');
            spyOn(collectData, 'updateLayerInfo');
            spyOn(collectData, 'getData');
            spyOn(collectData, 'backToList');
            spyOn(collectData, 'hasNext');
            spyOn(collectData, 'closeLayer');

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
            collectData.collect().then(() => {
                // then
                expect(collectData.numberOfRecipients).toEqual(NUMBER_OF_ROWS);
                done();
            });
        });

        it('should open layer if it is not opened', (done) => {
            // given
            collectData.isLayerOpen = false;

            // when
            collectData.collect().then(() => {
                // then
                expect(collectData.openLayer).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should not open second layer when one is opened', (done) => {
            // given
            collectData.isLayerOpen = true;

            // when
            collectData.collect().then(() => {
                // then
                expect(collectData.openLayer).not.toHaveBeenCalled();
                done();
            });
        });

        it('should update layer info, get data and back to list', (done) => {
            // when
            collectData.collect().then(() => {
                // then
                expect(collectData.updateLayerInfo).toHaveBeenCalledTimes(1);
                expect(collectData.getData).toHaveBeenCalledTimes(1);
                expect(collectData.backToList).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should call collectData until there will be no row left', (done) => {
            // given
            collectData.currentRowIndex = 0;
            spyOn(collectData, 'collect')
            collectData.hasNext.and.returnValues(true, true, false);
            collectData.collect.and.callThrough();

            // when
            collectData.collect().then(() => {
                // then
                expect(collectData.collect).toHaveBeenCalledTimes(3);
                done();
            });
        });

        it('should save recipients, clear layer and reset current row index', (done) => {
            // given
            collectData.currentRowIndex = 555;
            collectData.hasNext.and.returnValue(false);

            // when
            collectData.collect().then(() => {
                // then
                expect(storageMock.saveRecipients).toHaveBeenCalledTimes(1);
                expect(storageMock.saveRecipients).toHaveBeenCalledWith(collectData.recipients);
                expect(collectData.closeLayer).toHaveBeenCalledTimes(1);
                expect(collectData.currentRowIndex).toEqual(0);
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
            collectData.openLayer();

            // then
            expect(document.querySelector(collectData.layerSelector)).toBeTruthy();
        });

        it('should contains data container', () => {
            // when
            collectData.openLayer();

            // then
            expect(document.querySelector('.collected-data-number')).toBeTruthy();
        });

        it('should mark layer as open', () => {
            // given
            collectData.isLayerOpen = false;

            // when
            collectData.openLayer();

            // then
            expect(collectData.isLayerOpen).toBeTrue();
        });
    });

    describe('closeLayer', () => {
        beforeEach(() => {
            document.body.innerHTML = `<div class="${collectData.layerClassName}"></div>`;
        });

        it('should remove layer from DOM', () => {
            // when
            collectData.closeLayer();

            // then
            expect(document.querySelector(collectData.layerSelector)).toBeNull();
        });

        it('should mark layer as closed', () => {
            // given
            collectData.isLayerOpen = true;

            // when
            collectData.closeLayer();

            // then
            expect(collectData.isLayerOpen).toBe(false);
        });
    });

    describe('updateLayerInfo', () => {
        const DATA_CLASS_NAME = 'collected-data-number';

        beforeEach(() => {
            document.body.innerHTML = `<div class="${collectData.layerClassName}"><span class="${DATA_CLASS_NAME}">9999</span></div>`
        });

        it('should overwrite layer number of collected data by current row index', () => {
            // given
            collectData.currentRowIndex = 150;

            // when
            collectData.updateLayerInfo();

            // then
            expect(document.querySelector('.' + DATA_CLASS_NAME).textContent).toEqual(collectData.currentRowIndex.toString());
        });
    });

    describe('getData', () => {

        let fromNumber;
        let recipient;
        let recipientNumber;
        let title;

        beforeEach(() => {
            collectData.recipients.length = 0;

            fromNumber = '1111111111';
            recipient = 'Best recipient';
            recipientNumber = '666999666999';
            title = `(~'.')~ ~(^.^)~ ~('.'~)`;

            spyOn(collectData, 'enterTo');
        });

        it('should enter to given row index', (done) => {
            // given
            generateDetailsForm();
            const rowIndex = 5;

            // when
            collectData.getData(rowIndex).then(() => {
                expect(collectData.enterTo).toHaveBeenCalledTimes(1);
                expect(collectData.enterTo).toHaveBeenCalledWith(rowIndex);
                done();
            });
        });

        it('should push new recipient to recipients array', (done) => {
            // given
            generateDetailsForm();

            // when
            collectData.getData(0).then(() => {
                // then
                expect(collectData.recipients.length).toEqual(1);
                expect(collectData.recipients[0]).toEqual({ fromNumber, recipient, recipientNumber, title });
                done();
            });
        });

        it('should replace fromNumber by the empty string when there will bo no such element', (done) => {
            // given
            generateDetailsForm();
            document.body.querySelector('._3pHQr').remove();

            // when
            collectData.getData(0).then(() => {
                // then
                expect(collectData.recipients[0]).toEqual(jasmine.objectContaining({ fromNumber: '' }));
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
                collectData.enterTo(rowIndex).then(() => {
                    // then
                    expect(spy).toHaveBeenCalledTimes(1);
                    done();
                });
            })
        )

        it('should wait until details page will be loaded', (done) => {
            // when
            collectData.enterTo(0).then(() => {
                // then
                expect(waitMock.for).toHaveBeenCalledWith(collectData.detailsPageCheckSelector);
                expect(waitMock.for).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('backToList', () => {
        it('should click on back button', (done) => {
            // when
            collectData.backToList().then(() => {
                // then
                expect(backButtonAction).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should wait until list view will not be loaded', (done) => {
            // when
            collectData.backToList().then(() => {
                // then
                expect(waitMock.for).toHaveBeenCalledWith(collectData.listTableSelector);
                expect(waitMock.for).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('hasNext', () => {
        it('should return true if current row index increased by one will be lower then number of all recipients', () => {
            // given
            collectData.currentRowIndex = 5;
            collectData.numberOfRecipients = 10;

            // when
            const result = collectData.hasNext();

            // then
            expect(result).toBe(true);
        });

        it('should return false if current row index increased by one will be grater then number of all recipients', () => {
            // given
            collectData.currentRowIndex = 10;
            collectData.numberOfRecipients = 10;

            // when
            const result = collectData.hasNext();

            // then
            expect(result).toBe(false);
        });

        it('should return false if current row index increased by one will be equal to number of all recipients', () => {
            // given
            collectData.currentRowIndex = 9;
            collectData.numberOfRecipients = 10;

            // when
            const result = collectData.hasNext();

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
