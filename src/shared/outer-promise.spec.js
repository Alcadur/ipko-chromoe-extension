describe('OuterPromise', () => {
    it('should return promise with method to get resolver', () => {
        // when
        const result = new OuterPromise(false);

        // then
        expect(result).toBeInstanceOf(Promise);
        expect(result.getResolver).toEqual(jasmine.any(Function));
    });

    it('should resolve promise instantly when resolve condition will be true', (done) => {
        // when
        const result = new OuterPromise(true);

        // then
        result.then(() => {
            expect(true).toEqual(true);
            done();
        });
    });

    it('should resolve promise when resolver will be call', (done) => {
        // when
        const result = new OuterPromise(false);
        spyOn(result, 'getResolver').and.callThrough();

        // then
        result.then(() => {
            expect(true).toEqual(true);
            expect(result.getResolver).toHaveBeenCalled();
            done();
        });

        setTimeout(() => result.getResolver((resolver) => resolver()));
    });

    it('should getResolver return source promise', (done) => {
        // when
        const result = new OuterPromise(false);

        // then
        result.getResolver(resolver => resolver())
            .then(() => {
                expect(true).toEqual(true);
                done();
            });
    });
});
