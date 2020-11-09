describe('IdGenerator', () => {
    const sqrtResult = 1456;
    const randomResult = .5486212;
    const nowResult = 14569856325698;
    const base64Result = btoa(sqrtResult.toString());
    let mathRef;
    let dateRef;

    beforeEach(() => {
        mathRef = Math;
        dateRef = Date;

        spyOn(Math, 'sqrt').and.returnValue(sqrtResult);
        spyOn(Math, 'random').and.returnValue(randomResult);
        spyOn(Date, 'now').and.returnValue(nowResult);
    });

    afterEach(() => {
        Math = mathRef;
        Date = dateRef;
    });

    describe('nextId', () => {
        it('should get current timestamp multiple it by random number, get sqrt and encode it by base64', () => {
            // given
            const result = IdGenerator.nextId();

            // then
            expect(result).toEqual(base64Result);
            expect(Math.sqrt).toHaveBeenCalledWith(randomResult * nowResult);
            expect(Math.random).toHaveBeenCalled();
            expect(Date.now).toHaveBeenCalled();
        });

        it('should get id with prefix', () => {
            // given
            const prefix = 'custom-prefix'

            // when
            const result = IdGenerator.nextId(prefix);

            // then
            expect(result).toEqual(`${prefix}-${base64Result}`);
        });

        it('should get id with postfix', () => {
            // given
            const postfix = 'custom-postfix'

            // when
            const result = IdGenerator.nextId('', postfix);

            // then
            expect(result).toEqual(`${base64Result}-${postfix}`);
        });
    });
});
