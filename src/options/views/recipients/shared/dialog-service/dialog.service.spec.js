import { DialogService } from './dialog.service.js';

describe('DialogService', () => {
    let service;

    beforeAll(() => {
        spyOn(window, 'alert').and.callThrough();
    })

    beforeEach(() => {
        service = new DialogService();
    });

    describe('open', () => {
        it('should call window dialog', () => {
            // given
            const message = 'message to show';

            // when
            service.open(message);

            // then
            expect(alert).toHaveBeenCalledWith(message);
        });
    });
});
