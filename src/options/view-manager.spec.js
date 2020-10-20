import { ViewManager } from './view-manager.js';

describe('ViewManager', () => {
    const DATA_TIMESTAMP = 159875325685;
    const TEMPLATE1 = 'template1';
    const TEMPLATE2 = 'template2';

    let fetchMock;
    /** @type ViewManager */let viewManager;
    let defaultViewContainer;
    let defaultScriptsContainer;


    const templates = {
        [TEMPLATE1]: '<div>template1</div>',
        [TEMPLATE2]: '<!--include scripts-->\n<div>template1</div>',
    }

    const templatesUrl = {
        [`views/${TEMPLATE1}/template.html`]: { text: () => templates[TEMPLATE1] },
        [`views/${TEMPLATE2}/template.html`]: { text: () => templates[TEMPLATE2] },
    }

    beforeEach(() => {
        spyOn(Date, 'now').and.returnValue(DATA_TIMESTAMP);
        document.body.innerHTML = '<div id="viewContainer"></div><div id="scripts"></div>';
        defaultViewContainer = document.querySelector('#viewContainer');
        defaultScriptsContainer = document.querySelector('#scripts');
        fetchMock = jasmine.createSpy('fetch');
        fetchMock.and.callFake((url) => Promise.resolve(templatesUrl[url]));
        viewManager = new ViewManager(fetchMock, queryFactory());
    });

    describe('load', () => {
        it('should fetch html template and bind it default container', async () => {
            // when
            await viewManager.load(TEMPLATE1);

            // then
            expect(document.querySelector('#viewContainer').innerHTML).toEqual(templates[TEMPLATE1])
        });

        it('should fetch html template and bind it to custom container', async () => {
            document.body.innerHTML = '<article></article><div id="scripts"></div>';
            const scriptContainer = document.querySelector('#scripts');


            // when
            await viewManager.load(TEMPLATE2, { htmlContainerSelector: 'article' });

            // then
            expect(document.querySelector('article').innerHTML).toEqual(templates[TEMPLATE2]);
            expect(scriptContainer.innerHTML).toEqual(`<script type="module" src="views/${TEMPLATE2}/scripts.js?${DATA_TIMESTAMP}"></script>`);
        });

        it('should add script when first line of template will have correct comment', async () => {
            // given
            const scriptContainer = document.querySelector('#scripts');
            spyOn(scriptContainer, 'appendChild').and.callThrough();

            // when
            await viewManager.load(TEMPLATE2);

            // then
            expect(scriptContainer.appendChild).toHaveBeenCalled();
            expect(scriptContainer.innerHTML).toEqual(`<script type="module" src="views/${TEMPLATE2}/scripts.js?${DATA_TIMESTAMP}"></script>`)
        });

        it('should add scripts to custom container', async () => {
            // given
            document.body.innerHTML = '<div id="viewContainer"></div><div id="customScripts"></div>'
            const scriptContainer = document.querySelector('#customScripts');
            spyOn(scriptContainer, 'appendChild').and.callThrough();

            // when
            await viewManager.load(TEMPLATE2, { scriptsContainerSelector: '#customScripts' });

            // then
            expect(scriptContainer.appendChild).toHaveBeenCalled();
            expect(scriptContainer.innerHTML).toEqual(`<script type="module" src="views/${TEMPLATE2}/scripts.js?${DATA_TIMESTAMP}"></script>`)
        });

        it('should not add script when first line of template will not script comment', async () => {
            // given
            const scriptContainer = document.querySelector('#scripts');
            spyOn(scriptContainer, 'appendChild');

            // when
            await viewManager.load(TEMPLATE1);

            // then
            expect(scriptContainer.appendChild).not.toHaveBeenCalled();
        });

        it('should load template path without path variables', async () => {
            // given
            const pathWithVariables = 'my/path/$var1/with/$var2/variables/$var3';
            const templatePath = 'views/my/path/with/variables/template.html';
            const TEMPLATE_CONTENT = 'variables content';
            templatesUrl[templatePath] = { text: () => TEMPLATE_CONTENT };
            const url = pathWithVariables.replace('$var1', '1')
                .replace('$var2', '2')
                .replace('$var3', '3')
            viewManager.addDynamicUrlPattern(pathWithVariables);

            // when
            await viewManager.load(url);

            // then
            expect(document.querySelector('#viewContainer').innerHTML).toEqual(TEMPLATE_CONTENT)
        });
    });

    describe('addDynamicUrlPattern', () => {
        const testData = [
            'my/view/$var1',
            'my/view/$var1/$var2',
            '$var0/my/view',
            'my/view/$var1/nested/$var2',
            'my/view/$var1/nested/',
        ];
        testData.forEach(testPattern =>
            it(`should parse view name with variables to template path (pattern: ${testPattern})`, async () => {
                // given
                const viewNamePattern = testPattern;
                const viewName = viewNamePattern.replace(/\$(var\d)/g, '$1');
                const templatePathPart = viewNamePattern.replace(/\/?\$var\d/g, '');
                const templatePath = `views/${templatePathPart}/template.html`.replace(/\/\//g, '/');

                templatesUrl[templatePath] = { text: () => templatePath };

                // when
                viewManager.addDynamicUrlPattern(viewNamePattern);

                // then
                await viewManager.load(viewName);
                expect(defaultViewContainer.textContent).toEqual(templatePath);
            })
        );
    });

    describe('getPathVariables', () => {
        it('should get variable from location hash based on dynamic url pattern', () => {
            // given
            const CUSTOMER_NAME = 'Jurek Ogórek';
            const ACCOUNT_NUMBER = '00 0000 0000 0000';
            const urlPattern = 'customers/$customerName/details/$accountNumber';
            const url = urlPattern.replace('$customerName', CUSTOMER_NAME)
                .replace('$accountNumber', ACCOUNT_NUMBER)
            viewManager.addDynamicUrlPattern(urlPattern);
            location.hash = url;

            // when
            const result = viewManager.getPathVariables();

            // then
            expect(result.customerName).toEqual(CUSTOMER_NAME);
            expect(result.accountNumber).toEqual(ACCOUNT_NUMBER);
        });
    });
});
