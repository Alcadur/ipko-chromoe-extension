describe('content-resolver.js', () => {
    let contentResolver;
    let waitMock;
    let recipientsListSearchMock;
    let collectDataMock;
    let paymentLiveRecipientSearchMock;

    beforeEach(() => {
        waitMock = jasmine.createSpyObj('waitMock', {for: Promise.resolve(), untilLoaderGone: Promise.resolve('')});
        collectDataMock = jasmine.createSpyObj('collectDataMock', ['collect']);
        recipientsListSearchMock = jasmine.createSpyObj('recipientsListSearchMock', ['init']);
        paymentLiveRecipientSearchMock = jasmine.createSpyObj('paymentLiveRecipientSearchMock', ['init']);

        document.body.innerHTML = '<form><table class="_3082t"><div></div></table></form>';

        contentResolver = new ContentResolver(queryFactory(), waitMock, collectDataMock, recipientsListSearchMock, paymentLiveRecipientSearchMock);
    });

    describe('updatePageContent', () => {
        beforeEach(() => {
            contentResolver.pageTitleMap.set('OdbiorcyKrajowi', jasmine.createSpy('OdbiorcyKrajowi'));
        });

        it('should call method bind to page title', () => {
            // when
            contentResolver.updatePageContent('OdbiorcyKrajowi');

            // then
            expect(contentResolver.pageTitleMap.get('OdbiorcyKrajowi')).toHaveBeenCalledTimes(1);
        });

        it('should not throw an error when there will be no action for page', () => {
            expect(() => contentResolver.updatePageContent('NA')).not.toThrowError();
        });
    });

    describe('addDataCollectButton', () => {
        it('should add collect data button on top of table', () => {
            // given
            const ICON_URL = 'my-icon.png';
            chrome.runtime.getURL.returns(ICON_URL);

            // when
            contentResolver.addDataCollectButton();

            // then
            const table = document.querySelector('._3082t');
            const row = table.querySelector('div._3CHZ5.icon-container');
            const buttonImg = row.querySelector('button img')

            expect(row).toBeTruthy();
            expect(buttonImg.classList).toContain('icon');
            expect(buttonImg.getAttribute('src')).toEqual(ICON_URL);
        });
    });

    describe('pageTitleMap', () => {
        describe('OdbiorcyKrajowi', () => {
            it('should wait until loader will be gone and the table will be shown before any other action', (done) => {
                // given
                let untilLoaderGoneResolver = () => {};
                let forResolver = () => {};
                spyOn(contentResolver, 'addDataCollectButton');

                waitMock.untilLoaderGone.and.returnValue(new Promise((resolve) => untilLoaderGoneResolver = resolve));
                waitMock.for.and.returnValue(new Promise((resolve) => forResolver = resolve));

                // when
                contentResolver.pageTitleMap.get('OdbiorcyKrajowi')().then(() => {
                    // then
                    expect(contentResolver.addDataCollectButton).toHaveBeenCalledTimes(1);
                    expect(recipientsListSearchMock.init).toHaveBeenCalledTimes(1);
                    done();
                });

                // when 2
                untilLoaderGoneResolver();
                forResolver();
            });
        });

        describe('PrzelewyKrajowy', () => {
            const actionName = 'PrzelewyKrajowy';
            let action;

            beforeEach(() => {
               action = contentResolver.pageTitleMap.get(actionName)
            });

            it('should wait until loader gone and input will be shown', (done) => {
                // given
                paymentLiveRecipientSearchMock.searchInputSelector = 'input.selector';

                // when
                action().then(() => {
                    // then
                    expect(waitMock.untilLoaderGone).toHaveBeenCalledTimes(1);
                    expect(waitMock.for).toHaveBeenCalledTimes(1);
                    expect(waitMock.for).toHaveBeenCalledWith(paymentLiveRecipientSearchMock.searchInputSelector, 50);
                    done();
                });
            });

            it('should init payment live search', (done) => {
                // when
                action().then(() => {
                    // then
                    expect(paymentLiveRecipientSearchMock.init).toHaveBeenCalledTimes(1);
                    done();
                });
            });
        });
    });
});
