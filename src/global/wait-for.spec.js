describe('waitFor.js', () => {
    const SELECTOR = 'div';

    let promiseResolveSpy;
    let promiseRejectSpy;

    beforeAll(() => {
        jasmine.clock().install()
    });

    afterAll(() => {
        jasmine.clock().uninstall()
    });

    beforeEach(() => {
        clearDOM();
        promiseRejectSpy = jasmine.createSpy('promiseReject');
        promiseResolveSpy = jasmine.createSpy('promiseResolveSpy');
    });

    describe('waitForElement', () => {
        it('should call resolve function when element will be found', () => {
            // given
            addElementToDOM()

            // when
            waitForElement(SELECTOR, promiseResolveSpy, promiseRejectSpy, 10);
            jasmine.clock().tick(BASE_TIMEOUT_IN_MS)

            // then
            expect(promiseResolveSpy).toHaveBeenCalledTimes(1);
            expect(trialCount).toEqual(0);
        });

        it('should try find element until it will be created in DOM and reset counter', () => {
            // given
            const numberOfTraysBeforeAddElement = 4;
            let countState = -1;
            setTimeout(() => {
                countState = trialCount;
                addElementToDOM();
            }, BASE_TIMEOUT_IN_MS * numberOfTraysBeforeAddElement)

            // when
            waitForElement(SELECTOR, promiseResolveSpy, promiseRejectSpy, 10);
            jasmine.clock().tick(BASE_TIMEOUT_IN_MS * 5);

            // then
            expect(promiseResolveSpy).toHaveBeenCalledTimes(1);
            expect(countState).toEqual(numberOfTraysBeforeAddElement - 1);
            expect(trialCount).toEqual(0);
        });

        it('should call reject function and reset counter when element will not exists in DOM after number of trials', () => {
            // given
            const TRIALS_LIMIT = 5;

            // when
            waitForElement(SELECTOR, promiseResolveSpy, promiseRejectSpy, TRIALS_LIMIT);
            jasmine.clock().tick(BASE_TIMEOUT_IN_MS * (TRIALS_LIMIT + 1));

            // then
            expect(promiseRejectSpy).toHaveBeenCalledTimes(1);
            expect(promiseResolveSpy).not.toHaveBeenCalled();
            expect(trialCount).toEqual(0);
        });
    });

    describe('waitUntilLoaderGone', () => {
        it('should call resolve function when loader will be remove from form', (done) => {
            // given
            const TRIALS_NO = 5;
            document.body.innerHTML = '<form><svg></svg></form>';
            setTimeout(clearDOM, BASE_TIMEOUT_IN_MS * TRIALS_NO)

            // when
            waitUntilLoaderGone().then(() => {
                // then
                expect(true).toBe(true);
                done();
            });
            jasmine.clock().tick(BASE_TIMEOUT_IN_MS * TRIALS_NO);
        });
    });

    describe('waitUntil', () => {
        it('should call resolve function when element will be removed from DOM', () => {
            // given
            addElementToDOM();
            setTimeout(clearDOM, BASE_TIMEOUT_IN_MS * 3);

            // when
            waitUntil(SELECTOR, promiseResolveSpy);
            jasmine.clock().tick(BASE_TIMEOUT_IN_MS * 3);

            // then
            expect(promiseResolveSpy).toHaveBeenCalledTimes(1);
        });
    });

    function addElementToDOM() {
        document.body.innerHTML = '<div></div>';
    }

    function clearDOM() {
        document.body.innerHTML = '';
    }
});
