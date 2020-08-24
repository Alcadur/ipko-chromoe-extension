{
    const functionRefs = {};

    let documentEventRef;
    function disableDocumentAddEvent() {
        if (!documentEventRef) {
            documentEventRef = document.addEventListener;
        }
        document.addEventListener = jasmine.createSpy('document.addEventListenerSpy');
    }

    function enableDocumentAddEvent() {
        if(documentEventRef) {
            document.addEventListener = documentEventRef;
        }
    }

    function mockFunction(name, rootObj = window) {
        if(!functionRefs[name]) {
            functionRefs[name] = {
                method: rootObj[name],
                obj: rootObj
            };

            rootObj[name] = jasmine.createSpy(`${name}Spy`);
        }
    }

    function restoreFunction(...names) {
        names.forEach(name => {
            if(functionRefs[name]) {
                functionRefs[name]['obj'] = functionRefs[name]['method'];
                delete functionRefs[name];
            }
        })
    }
}

