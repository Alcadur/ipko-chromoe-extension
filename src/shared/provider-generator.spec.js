describe('providerGenerator', () => {
    class MockClass {}

    let provider;

    function mockFactory() {
        return new MockClass();
    }

    beforeEach(() => {
        provider = providerGenerator(mockFactory);
    })

    it('should return object instance', () => {
        // when
        const result = provider();

        // then
        expect(result).toBeInstanceOf(MockClass);
    });

    it('should create only one instance of object', () => {
        // given
        const expected = provider();

        // when
        const result = provider();

        // then
        expect(result).toBe(expected);
    });
});
