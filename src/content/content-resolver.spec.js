describe('content-resolver.js', () => {
    let contentResolver;
    let waitMock;
    let recipientsListSearchMock;
    let collectDataMock;
    let paymentLiveRecipientSearchMock;
    let confirmRecipientAddingFormMock

    beforeEach(() => {
        waitMock = jasmine.createSpyObj('waitMock', {for: Promise.resolve(), untilLoaderGone: Promise.resolve('')});
        collectDataMock = jasmine.createSpyObj('collectDataMock', ['collect']);
        recipientsListSearchMock = jasmine.createSpyObj('recipientsListSearchMock', ['init']);
        paymentLiveRecipientSearchMock = jasmine.createSpyObj('paymentLiveRecipientSearchMock', ['init']);
        confirmRecipientAddingFormMock = jasmine.createSpyObj('confirmRecipientAddingFormMock', ['init']);

        document.body.innerHTML = '<form><table class="_3082t"><div></div></table></form>';

        contentResolver = new ContentResolver(queryFactory(), waitMock, collectDataMock, recipientsListSearchMock, paymentLiveRecipientSearchMock, confirmRecipientAddingFormMock);
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

    describe('pageTitleMap', () => {
        describe('OdbiorcyKrajowi', () => {
            it('should wait until loader will be gone and the table will be shown before any other action', (done) => {
                // given
                let untilLoaderGoneResolver = () => {};
                let forResolver = () => {};

                waitMock.untilLoaderGone.and.returnValue(new Promise((resolve) => untilLoaderGoneResolver = resolve));
                waitMock.for.and.returnValue(new Promise((resolve) => forResolver = resolve));

                // when
                contentResolver.pageTitleMap.get('OdbiorcyKrajowi')().then(() => {
                    // then
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

        describe('PotwierdźDodanie', () => {
            it('should wait until loader will be gone and the submit button will be shown before any other action', (done) => {
                // given
                let untilLoaderGoneResolver = () => {
                };
                let forResolver = () => {
                };

                waitMock.untilLoaderGone.and.returnValue(new Promise((resolve) => untilLoaderGoneResolver = resolve));
                waitMock.for.and.returnValue(new Promise((resolve) => forResolver = resolve));

                // when
                contentResolver.pageTitleMap.get('PotwierdźDodanie')().then(() => {
                    // then
                    expect(confirmRecipientAddingFormMock.init).toHaveBeenCalledTimes(1);
                    done();
                });

                // when 2
                untilLoaderGoneResolver();
                forResolver();
            });
        });
    });
});
