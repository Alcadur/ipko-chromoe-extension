describe('TabUtils', () => {
    /** @type {TabUtils} */let tabUtils;

    beforeEach(() => {
        tabUtils = testTabUtilFactory();
    });

    describe('getOnlyIPkoTab', () => {
        let ipkoTab;

        beforeEach(() => {
            ipkoTab = { id: 96 };
            chrome.tabs.query.resetHistory();
            chrome.tabs.query.callsFake((query, callback) => callback([ipkoTab]));
        });

        it('should get only ipko.pl active tab', () => {
            // given
            const expectedArgs = [{
                active: true,
                currentWindow: true,
                url: 'https://www.ipko.pl/*'
            }]
            const callback = jasmine.createSpy('callback');

            // when
            tabUtils.getOnlyIPkoTab(callback);

            // then
            expect(callback).toHaveBeenCalledWith(ipkoTab);
            expect(chrome.tabs.query.withArgs(...expectedArgs).calledOnce).toBe(true);
        });

        it('should not call callback method when there will be not matched tabs', () => {
            // given
            const callback = jasmine.createSpy('callback');
            chrome.tabs.query.callsFake((query, callback) => callback([]));


            // when
            tabUtils.getOnlyIPkoTab(callback);

            // then
            expect(callback).not.toHaveBeenCalled();
        });

        it('should not call callback and not throw an error when tabs array will be null', () => {
            // given
            const callback = jasmine.createSpy('callback');
            chrome.tabs.query.callsFake((query, callback) => callback(null));

            // then
            expect(function () {
                tabUtils.getOnlyIPkoTab(callback);
            }).not.toThrow();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('getActiveTabs', () => {
        it('should get current active windows and pass it to callback', () => {
            // given
            const expectedArgs = [{
                active: true,
                currentWindow: true
            }]
            const callback = jasmine.createSpy('callback');
            const tabs = [{ id: 14 }];
            chrome.tabs.query.callsFake((query, callback) => callback(tabs));

            // when
            tabUtils.getActiveTabs(callback);

            // then
            expect(callback).toHaveBeenCalledWith(tabs);
            expect(chrome.tabs.query.withArgs(...expectedArgs).calledOnce).toBe(true);
        });
    });

    function testTabUtilFactory() {
        return new TabUtils();
    }
});
