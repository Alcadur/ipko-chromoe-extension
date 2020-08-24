const RECIPIENTS_KEY = 'recipients';

const storage = {
    /**
     * Alias for chrome.storage.local.set
     *
     * @param {string} key
     * @param {*} value
     */
    save(key, value) {
        chrome.storage.local.set({[key]: value});
    },

    /**
     * Alias for chrome.storage.local.get
     *
     * @param {string} key
     * @param {function} callback
     */
    get(key, callback) {
        chrome.storage.local.get(key, callback);
    },

    /**
     * Shortcut for save('recipients', *)
     *
     * @param {Recipient[]} recipients
     */
    saveRecipients(recipients) {
        this.save(RECIPIENTS_KEY, recipients);
    },

    getRecipients(callback) {
        this.get(RECIPIENTS_KEY, callback);
    }
}
