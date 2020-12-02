describe('MessageService', () => {
    /** @type MessageService */let messageService;
    let tabs;

    let tabUtils;
    let ipkoTab;

    beforeEach(() => {
        ipkoTab = { id: 89 };
        tabUtils = jasmine.createSpyObj('tabUtils', ['getOnlyIPkoTab']);
        tabUtils.getOnlyIPkoTab.and.callFake((callback) => callback(ipkoTab));
        tabs = [{ id: '22' }, { id: '44' }, { id: '88' }];
        messageService = new MessageService(tabUtils);
    });

    describe('global scope', () => {

    });

    describe('sendMessageToTab', () => {
        it('should get ipko tab and send message', () => {
            // given
            const callback = jasmine.createSpy('callback');
            const message = { message: 'test message to tab' };
            const expectedArgs = [ipkoTab.id, message, null, callback];

            // when
            messageService.sendMessageToTab(message, callback);

            // then
            expect(chrome.tabs.sendMessage.withArgs(...expectedArgs).calledOnce).toBe(true);
        });
    });

    describe('sendMultiMessagesToTab', () => {
        const ACTION_ONE_NAME = 'action-one';
        const ACTION_TWO_NAME = 'action-two';
        let callback;
        let resolvers;

        beforeEach(() => {
            callback = jasmine.createSpy('callback');
            resolvers = {};

            chrome.tabs.sendMessage.callsFake((_, message, __, sendCallback) => {
                return new Promise(resolver => {
                    resolvers[message.actionName] = (args) => {
                        sendCallback(args)
                        resolver();
                    };
                });
            });
        });

        it('should wait for all results and call callback with results in expected order', () => {
            // given
            const r1 = '1';
            const r2 = '2';

            // when
            messageService.sendMultiMessagesToTab([
                { actionName: ACTION_ONE_NAME },
                { actionName: ACTION_TWO_NAME }
            ], callback);


            resolvers[ACTION_TWO_NAME](r2);
            resolvers[ACTION_ONE_NAME](r1);

            // then
            expect(callback).toHaveBeenCalledWith([r1, r2]);
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
