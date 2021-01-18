import { DashboardController } from './dashboard.controller.js';
import { RECIPIENTS_LIST } from '../../options-urls.js';

describe('Dashboard controller', () => {
    let controller;
    let fakeLocation
    let buttons;

    beforeEach(() => {
        fakeLocation = /**@type {Location}*/{};
        document.body.innerHTML = '<button id="recipients">';

        buttons = {
            recipients: document.querySelector('#recipients')
        }
    });

    describe('constructor', () => {
        it('should add action to navigate to recipients', () => {
            // given
            testControllerFactory();

            // when
            buttons.recipients.click();

            // then
            expect(fakeLocation.hash).toEqual(RECIPIENTS_LIST());
        });
    });

    function testControllerFactory() {
        return new DashboardController(queryFactory(), fakeLocation);
    }
});
