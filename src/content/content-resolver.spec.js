describe('content-resolver.js', () => {
    let contentResolver;
    let waitMock;
    let collectDataMock;

    beforeEach(() => {
        waitMock = jasmine.createSpyObj('waitMock', ['for', 'untilLoaderGone']);
        collectDataMock = jasmine.createSpyObj('collectDataMock', ['collect'])

        document.body.innerHTML = '<form><table class="_3082t"><div></div></table></form>';

        contentResolver = new ContentResolver(queryFactory(), waitMock, collectDataMock);
    });

    describe('updatePageContent', () => {
        beforeEach(() => {
            spyOn(contentResolver.pageTitleMap, 'Odbiorcy');
        });

        it('should call method bind to page title', () => {
            // when
            contentResolver.updatePageContent('Odbiorcy');

            // then
            expect(contentResolver.pageTitleMap['Odbiorcy']).toHaveBeenCalledTimes(1);
        });

        it('should not throw an error when there will be no action for page', () => {
            expect(() => contentResolver.updatePageContent('NA')).not.toThrowError();
        });
    });

    describe('addDataCollectButton', () => {
        it('should wait until loader will gone and data table will be displayed', (done) => {
            // when
            contentResolver.addDataCollectButton().then(() => {
                // then
                expect(waitMock.untilLoaderGone).toHaveBeenCalledTimes(1);
                expect(waitMock.for).toHaveBeenCalledTimes(1);
                expect(waitMock.for).toHaveBeenCalledWith(contentResolver.tableSelector, 50);
                done();
            });
        });

        it('should add collect data button on top of table', (done) => {
            // given
            const ICON_URL = 'my-icon.png';
            chrome.runtime.getURL.returns(ICON_URL);

            // when
            contentResolver.addDataCollectButton().then(() => {
                const table = document.querySelector('._3082t');
                const row = table.querySelector('div._3CHZ5.icon-container');
                const buttonImg = row.querySelector('button img')

                expect(row).toBeTruthy();
                expect(buttonImg.classList).toContain('icon');
                expect(buttonImg.getAttribute('src')).toEqual(ICON_URL);
                done();
            });
        });
    });
});
