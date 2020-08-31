{
    function disableDocumentAndWindowAddEvent() {
        document.addEventListener = jasmine.createSpy('document.addEventListenerSpy');
        document.removeEventListener = jasmine.createSpy('document.removeEventListenerSpy');
        window.addEventListener = jasmine.createSpy('window.addEventListenerSpy');
        window.removeEventListener = jasmine.createSpy('window.removeEventListenerSpy');
    }
}

