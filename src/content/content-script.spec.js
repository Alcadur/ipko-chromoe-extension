describe('ContentScript', () => {
    let waitMock;
    let contentResolverMock;
    let collectDataMock;
    let messageServiceMock;
    /** @type ContentScript */let contentScript;

    beforeEach(() => {
        waitMock = jasmine.createSpyObj('waitMock', { for: Promise.resolve(), untilLoaderGone: Promise.resolve() });
        contentResolverMock = jasmine.createSpyObj('contentResolver', ['updatePageContent']);
        collectDataMock = jasmine.createSpyObj('collectData', { collect: Promise.resolve() });
        messageServiceMock = jasmine.createSpyObj('messageService', ['addMessageActionListener'], { actions: {} });
        messageServiceMock.addMessageActionListener.and.callFake(function (type, callback) {
            this.actions[type] = callback
        });

        contentScript = new ContentScript(waitMock, queryFactory(), contentResolverMock, collectDataMock, messageServiceMock);
    });

    describe('constructor', () => {
        it(`should add listener for message type: ${MessageActionType.getRecipients}`, () => {
            // then
            expect(messageServiceMock.addMessageActionListener).toHaveBeenCalledWith(MessageActionType.getRecipients, jasmine.any(Function));
        });

        it(`should add listener for message type: ${MessageActionType.getLastPage}`, () => {
            // given
            const LAST_PAGE = 'myPage'
            contentScript.lastPage = LAST_PAGE
            const callback = jasmine.createSpy();

            // when
            messageServiceMock.actions[MessageActionType.getLastPage](callback);

            // then
            expect(messageServiceMock.addMessageActionListener).toHaveBeenCalledWith(MessageActionType.getLastPage, jasmine.any(Function));
            expect(callback).toHaveBeenCalledWith(LAST_PAGE);
        });

        it('should add listener for document click event', () => {
            // then
            expect(document.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
        });
    });

    describe(`message action listener handler for: ${MessageActionType.getRecipients}`, () => {
        const RECIPIENTS_LIST_CONTROL_CONTENT = '-*-RecipientsList-*-';

        it('should collect data when last page will be "OdbiorcyKrajowi"', () => {
            // given
            contentScript.lastPage = 'OdbiorcyKrajowi';

            // when
            messageServiceMock.actions[MessageActionType.getRecipients]();
            // then
            expect(collectDataMock.collect).toHaveBeenCalled();
        });

        it('should open top payment many and click recipient list button', (done) => {
            // given
            let forResolver = () => { console.log('not promise resolver was called') };
            const forResolverProvider = () => forResolver;
            waitMock.for.and.callFake(() => {
                return new Promise((resolve) => {
                    forResolver = resolve;
                });
            });
            addDOM(forResolverProvider);
            contentScript.lastPage = 'Not-OdbiorcyKrajowi';

            // when
            messageServiceMock.actions[MessageActionType.getRecipients]();

            // then
            setTimeout(() => {
                expect(document.body.innerHTML).toEqual(RECIPIENTS_LIST_CONTROL_CONTENT);
                expect(collectDataMock.collect).toHaveBeenCalled();
                done();
            });

        });

        function addDOM(forResolverProvider) {
            window.forResolverProvider = forResolverProvider;
            const scriptTag = document.createElement('script');
            scriptTag.innerHTML = `
            function setControlContent() {
                    document.body.innerHTML = '${RECIPIENTS_LIST_CONTROL_CONTENT}'
                }
                function addRecipientButton() {                    
                    setTimeout(() => {
                        document.body.innerHTML += '<a href="#INT_RECIPIENTS_NORMAL" onclick="setControlContent()"></a>';
                        window.forResolverProvider()(document.querySelector('[href="#INT_RECIPIENTS_NORMAL"]'));
                    });
                }
`
            document.body.innerHTML = '';
            document.body.appendChild(scriptTag);
            document.body.innerHTML += `
                <div class="QcltV">
                <button data-text="Płatności" onclick="addRecipientButton()"></button></div>
            `;

        }
    });

    describe('pageClickHandler', () => {
        it('should wait for title element and until loader will gone', async () => {
            // given
            const TRAYS_LIMIT = 10;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(waitMock.for).toHaveBeenCalledWith(contentScript.titleSelector, TRAYS_LIMIT);
            expect(waitMock.untilLoaderGone).toHaveBeenCalled();
        });

        it('should update lastPage', async () => {
            // given
            const PAGE_TITLE = 'Page-title';
            const TAB_TITLE = 'My*tab';
            document.body.innerHTML = `<h1 class='TTPMB'>${PAGE_TITLE}</h1><span class='_15ytj'>${TAB_TITLE}</span>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentScript.lastPage).toEqual(PAGE_TITLE + TAB_TITLE);
        });

        it('should not throw error when there will be no title element', async () => {
            // given
            waitMock.for.and.returnValue(Promise.reject());
            const TAB_TITLE = 'My*tab';
            document.body.innerHTML = `<span class='_15ytj'>${TAB_TITLE}</span>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentScript.lastPage).toEqual(TAB_TITLE);
        });

        it('should not throw error when there will be no tab element', async () => {
            // given
            const PAGE_TITLE = 'Page-title';
            document.body.innerHTML = `<h1 class='TTPMB'>${PAGE_TITLE}</h1>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentScript.lastPage).toEqual(PAGE_TITLE);
        });

        it('should update content when page will be new', async () => {
            // given
            const PAGE_TITLE = 'Page-title';
            contentScript.lastPage = null;
            document.body.innerHTML = `<h1 class='TTPMB'>${PAGE_TITLE}</h1>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentResolverMock.updatePageContent).toHaveBeenCalledWith(PAGE_TITLE);
        });

        it('should not update content when new page will be equal to last page', async () => {
            // given
            const PAGE_TITLE = 'page-title';
            contentScript.lastPage = PAGE_TITLE;
            document.body.innerHTML = `<h1 class='TTPMB'>${PAGE_TITLE}</h1>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentResolverMock.updatePageContent).not.toHaveBeenCalledWith(PAGE_TITLE);
        });

        it('should convert page and tab title to pascal case', async () => {
            // given
            const PAGE_TITLE = 'Page title';
            const TAB_TITLE = 'next tab';
            const EXPECTED  = 'PageTitleNextTab';
            document.body.innerHTML = `<h1 class='TTPMB'>${PAGE_TITLE}</h1><span class='_15ytj'>${TAB_TITLE}</span>`;

            // when
            await contentScript.pageClickHandler();

            // then
            expect(contentScript.lastPage).toEqual(EXPECTED);
        })
    });
});
