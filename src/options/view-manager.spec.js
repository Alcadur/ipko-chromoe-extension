import { ViewManager } from './view-manager.js';

describe('ViewManager', () => {
    const DATA_TIMESTAMP = 159875325685;
    const TEMPLATE1 = 'template1';
    const TEMPLATE2 = 'template2';

    let fetchMock;
    /** @type ViewManager */let viewManager;

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
        document.body.innerHTML = '<div id="viewContainer"></div><div id="scripts"></div>'
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
    });
});
