describe('content-resolver.js', () => {
    describe('updatePageContent', () => {
        beforeEach(() => {
            mockFunction('Odbiorcy', pageTitleMap);
        });

        afterEach(() => {
            restoreFunction('Odbiorcy');
        });

        it('should call method bind to page title', () => {
            // when
            updatePageContent('Odbiorcy');

            // then
            expect(pageTitleMap['Odbiorcy']).toHaveBeenCalledTimes(1);
        });

        it('should not throw an error when there will be no action for page', () => {
            expect(() => updatePageContent('NA')).not.toThrowError();
        });
    });

    describe('addDataCollectButton', () => {
        beforeEach(() => {
            mockFunction('waitUntilLoaderGone');
            mockFunction('waitFor');
        });

        afterEach(() => {
            restoreFunction(
                'waitUntilLoaderGone',
                'waitFor'
            );
        });

        it('should wait until loader will gone and data table will be displayed', (done) => {
            // when
            addDataCollectButton().then(() => {
                // then
                expect(waitUntilLoaderGone).toHaveBeenCalledTimes(1);
                expect(waitFor).toHaveBeenCalledTimes(1);
                expect(waitFor).toHaveBeenCalledWith(tableSelector, 50);
                done();
            });
        });

        it('should add collect data button on top of table', (done) => {
            // given
            const ICON_URL = 'my-icon.png';
            chrome.runtime.getURL.returns(ICON_URL);
            document.body.innerHTML = '<form><table class="_3082t"><div></div></table></form>';

            // when
            addDataCollectButton().then(() => {
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
