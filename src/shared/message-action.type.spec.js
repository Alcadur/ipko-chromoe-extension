describe('MessageActionType', () => {
    describe('getters', () => {
        it('should return "getRecipients"', () => {
            // when
            const result = MessageActionType.getRecipients;

            // then
            expect(result).toEqual('getRecipients');
        });

        it('should return "getLastPage"', () => {
            // when
            const result = MessageActionType.getLastPage;

            // then
            expect(result).toEqual('getLastPage');
        });

        it('should return "enableGetRecipientButton"', () => {
            // when
            const result = MessageActionType.enableGetRecipientButton;

            // then
            expect(result).toEqual('enableGetRecipientButton');
        });

        it('should return "isGetRecipientFinished"', () => {
            // when
            const result = MessageActionType.isGetRecipientFinished;

            // then
            expect(result).toEqual('isGetRecipientFinished');
        });

        it('should return "isLoggedIn"', () => {
            // when
            const result = MessageActionType.isLoggedIn;

            // then
            expect(result).toEqual('isLoggedIn');
        });
    });
});
