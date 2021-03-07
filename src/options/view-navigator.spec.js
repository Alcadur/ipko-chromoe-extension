'use strict';
import { ViewNavigator } from './view-navigator.js';

describe('ViewNavigator', () => {

    /** @type ViewNavigator */let viewNavigator;
    let locationMock;

    beforeEach(() => {
        locationMock = { hash: '' };
        viewNavigator = testViewNavigatorFactory();
    });

    describe('moveToOnClick', () => {
        beforeEach(() => {
            document.body.innerHTML = `<button class="bind-target"></button>`
        });
    });

    describe('moveTo', () => {
        it('should change location hash to given location', () => {
            // given
            const VIEW_HASH = 'my-view'

            // when
            viewNavigator.moveTo(VIEW_HASH);

            // then
            expect(locationMock.hash).toEqual(VIEW_HASH);
        });
    });

    describe('moveToOnClick', () => {
        const ELEMENT_SELECTOR = '.button';
        let element;
        let clickHandler;

        beforeEach(() => {
            document.body.innerHTML = `<div><button class="${ELEMENT_SELECTOR.substr(1)}"></button></div>`;
            element = document.querySelector(ELEMENT_SELECTOR);
            spyOn(element, 'addEventListener').and.callFake((eventName, handler) => clickHandler = handler);
        });

        it('should bind click action when element will be a string selector', () => {
            // when
            viewNavigator.moveToOnClick(ELEMENT_SELECTOR, '');

            // then
            expect(element.addEventListener).toHaveBeenCalledOnceWith('click', jasmine.any(Function));
        });

        it('should bind click action when element will be HTMLElement', () => {
            // when
            viewNavigator.moveToOnClick(element, '');

            // then
            expect(element.addEventListener).toHaveBeenCalledOnceWith('click', jasmine.any(Function));
        });

        it('should change location hash to given location in handler', () => {
            // given
            const VIEW_HASH = 'move-to-on-click-view'

            // when
            viewNavigator.moveToOnClick(element, VIEW_HASH);
            clickHandler();

            // then
            expect(locationMock.hash).toEqual(VIEW_HASH);
        });
    });

    function testViewNavigatorFactory() {
        return new ViewNavigator(queryFactory(), locationMock);
    }
});
