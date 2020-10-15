describe('MessageService', () => {
    /** @type MessageService */let messageService;
    let tabs;

    beforeEach(() => {
        tabs = [{ id: '22' }, { id: '44' }, { id: '88' }];
        messageService = new MessageService();
    });

    describe('global scope', () => {

    });

    describe('sendMessageToTab', () => {
        it('should send message to first tab which match query', () => {
            // given
            const MESSAGE = { key: 'value' };
            chrome.tabs.query.callsFake((query, callback) => callback(tabs));

            // when
            messageService.sendMessageToTab(MESSAGE);

            // then
            expect(chrome.tabs.sendMessage.withArgs(tabs[0].id, MESSAGE, null, undefined).calledOnce)
                .toBe(true, 'chrome.tabs.sendMessage was call with wrong arguments or was not call at all');
        });

        it('should not throw an error when there will be non matching tabs', () => {
            // given
            chrome.tabs.query.callsFake((query, callback) => callback(undefined));

            // then
            // when
            expect(messageService.sendMessageToTab).not.toThrowError();
        });

        it('should select current active tab with url https://wwww.ipko.pl/*', () => {
            // given
            chrome.tabs.query.callsFake((query) => {
                // then
                expect(query.active).toBeTrue();
                expect(query.currentWindow).toBeTrue();
                expect(query.url).toEqual('https://www.ipko.pl/*');
            })

            // when
            messageService.sendMessageToTab(null);
        });

        it('should pass callback function as last argument of sendMessage', () => {
            // then
            chrome.tabs.query.callsFake((query, callback) => callback(tabs));
            const callback = () => {
            };

            // when
            messageService.sendMessageToTab(null, callback);

            // then
            expect(chrome.tabs.sendMessage.withArgs(tabs[0].id, null, null, callback).calledOnce)
                .toBe(true, 'callback function was not pass to sendMessage');
        });
    });

    describe('sendMessageToExtension', () => {
        it('should pass arguments to chrome.runtime.sendMessage', () => {
            // given
            const MESSAGE = 'new message';
            const callback = () => {
            };

            // when
            messageService.sendMessageToExtension(MESSAGE, callback);

            // then
            expect(chrome.runtime.sendMessage.withArgs(MESSAGE, callback).calledOnce)
                .toBe(true, 'message or callback was not pass to sendMessage');
        });
    });
});
