describe('query.js', () => {
   const NON_SELECTOR = 'no-items';
    /**
     * @type Query
     */
   let query;

   beforeEach(() => {
       query = queryFactory();
   });

   describe('query', () => {
       const SINGLE_CLASS_NAME = 'single';
       const SINGLE_SELECTOR = `.${SINGLE_CLASS_NAME}`;

       beforeAll(() => {
           document.body.innerHTML = `
<div class="child"></div>
<div class="${SINGLE_CLASS_NAME}"><div class="child works"></div></div>
<div class="${SINGLE_CLASS_NAME}"><div class="child"></div><div class="child"></div></div>
<div class="child"></div>
`;
       });

       it('should return single element', () => {
           // when
           const result = query.one(SINGLE_SELECTOR);


           // then
           expect(result).toBeDefined();
           expect(result.classList).toContain(SINGLE_CLASS_NAME);
       });

       it('should return undefined when non element will mache', () => {
           // when
           const result = query.one(NON_SELECTOR);

           // then
           expect(result).toBeNull();
       });

       it('should return only object from parent element', () => {
           // given
           const parent = document.querySelector(SINGLE_SELECTOR);

           // when

           const result = query.one('.child', parent);

           // then
           expect(result.classList).toContain('works');
       });
   });

    describe('queryAll', () => {
        const PARENT_CLASS_NAME = 'parent';
        const PARENT_SELECTOR = `.${PARENT_CLASS_NAME}`;
        const MULTI_CLASS_NAME = 'many';
        const MULTI_SELECTOR = `.${MULTI_CLASS_NAME}`;
        const NESTED_EXTRA_CLASS = 'works';

        beforeEach(() => {
            document.body.innerHTML = `
                <div class="${MULTI_CLASS_NAME}"></div>
                <div class="${PARENT_CLASS_NAME}">
                    <div class="${MULTI_CLASS_NAME} ${NESTED_EXTRA_CLASS}"></div>
                    <div class="${MULTI_CLASS_NAME} ${NESTED_EXTRA_CLASS}"></div>
                </div>
                <div class="${MULTI_CLASS_NAME}"></div>
                <div class="${MULTI_CLASS_NAME}"></div>
            `
        });

        it('should return many elements mache to selector', () => {
            // when
            const result = query.all(MULTI_SELECTOR);

            // then
            expect(result.length).toEqual(document.querySelectorAll(MULTI_SELECTOR).length);
            result.forEach(element => expect(element.classList).toContain(MULTI_CLASS_NAME));
        });

        it('should return empty list when non element will mache', () => {
            // when
            const result = query.all(NON_SELECTOR);

            // then
            expect(result.length).toEqual(0);
        });

        it('should return only elements from parent', () => {
            // given
            const parent = document.querySelector(PARENT_SELECTOR);

            // when
            const result = query.all(MULTI_SELECTOR, parent);

            // then
            expect(result.length).toEqual(parent.querySelectorAll(MULTI_SELECTOR).length);
            result.forEach(element =>
                expect(element.classList).toContain(NESTED_EXTRA_CLASS)
            )
        });
    });
});
