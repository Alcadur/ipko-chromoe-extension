export class DialogService {
    /**
     * @param {String} message
     */
    open(message) {
        alert(message);
    }
}

export function dialogServiceFactory() { return new DialogService() }
