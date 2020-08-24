describe('query.js', () => {
    const NON_SELECTOR = 'no-items';

   describe('query', () => {
       const SINGLE_CLASS_NAME = 'single';
       const SINGLE_SELECTOR = `.${SINGLE_CLASS_NAME}`;

       beforeAll(() => {
           document.body.innerHTML = `<div class="${SINGLE_CLASS_NAME}"></div>`;
       });

       it('should test', () => {
           // when
           const result = query(SINGLE_SELECTOR);


           // then
           expect(result).toBeDefined();
           expect(result.classList).toContain(SINGLE_CLASS_NAME);
       });

       it('should return undefined when non element will mache', () => {
           // when
           const result = query(NON_SELECTOR);

           // then
           expect(result).toBeNull();
       });
   });

    describe('queryAll', () => {
        const MULTI_CLASS_NAME = 'many';
        const MULTI_SELECTOR = `.${MULTI_CLASS_NAME}`;

        beforeEach(() => {
            document.body.innerHTML = `
                <div></div>
                <div class="${MULTI_CLASS_NAME}"></div>
                <div class="${MULTI_CLASS_NAME}"></div>
                <div class="${MULTI_CLASS_NAME}"></div>
            `
        });

        it('should return many elements mache to selector', () => {
            // when
            const result = queryAll(MULTI_SELECTOR);

            // then
            expect(result.length).toEqual(3);
            result.forEach(element => expect(element.classList).toContain(MULTI_CLASS_NAME));
        });

        it('should return empty list when non element will mache', () => {
            // when
            const result = queryAll(NON_SELECTOR);

            // then
            expect(result.length).toEqual(0);
        });
    });
});
