class DialogService {
    /**
     * @param {String} message
     */
    open(message) {
        alert(message);
    }
}

function dialogServiceFactory() { return new DialogService() }

/**
 * @type {function(): DialogService}
 */
const dialogServiceProvider = providerGenerator(dialogServiceFactory);
