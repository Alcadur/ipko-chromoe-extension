class Storage {
    RECIPIENTS_KEY = 'recipients';

    /**
     * Alias for chrome.storage.local.set
     *
     * @param {string} key
     * @param {*} value
     * @return {Promise<any>}
     */
    save(key, value) {
        return new Promise((resolve) => {
            const saveObj = {[key]: value};
            chrome.storage.local.set(saveObj, () => resolve(saveObj));
        });
    }

    /**
     * Alias for chrome.storage.local.get
     *
     * @param {string} key
     * @return {Promise<any>}
     */
    get(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result) => { resolve(result[key]) })
        });
    }

    /**
     * Shortcut for save('recipients', *)
     *
     * @param {Recipient[]} recipients
     * @return {Promise<any>}
     */
    saveRecipients(recipients) {
        return this.save(this.RECIPIENTS_KEY, recipients);
    }

    /**
     * Shortcut for get('recipients', callback)
     *
     * @return {Promise<any>}
     */
    getRecipients() {
        return this.get(this.RECIPIENTS_KEY);
    }
}

/**
 * @returns {Storage}
 */
function storageFactory() { return new Storage(); }

/**
 * @type {Storage}
 */
const storage = storageFactory();
