import { DashboardController } from './dashboard.controller.js';
import { RECIPIENTS_LIST } from '../../options-urls.js';

describe('Dashboard controller', () => {
    const BUTTON_SELECTOR = '#recipients';
    let viewNavigatorMock;

    beforeEach(() => {
        viewNavigatorMock = jasmine.createSpyObj('viewNavigator', ['moveToOnClick']);
    });

    describe('constructor', () => {
        it('should add action to navigate to recipients', () => {
            // when
            testControllerFactory();

            // then
            expect(viewNavigatorMock.moveToOnClick).toHaveBeenCalledOnceWith(BUTTON_SELECTOR, RECIPIENTS_LIST());
        });
    });

    function testControllerFactory() {
        return new DashboardController(viewNavigatorMock);
    }
});
