const RECIPIENTS_KEY = 'recipients';

const storage = {
    save(key, value) {
        chrome.storage.local.set({[key]: value});
    },

    get(key, callback) {
        chrome.storage.local.get(key, callback);
    },

    saveRecipients(recipients) {
        this.save(RECIPIENTS_KEY, recipients);
    },

    getRecipients(callback) {
        this.get(RECIPIENTS_KEY, callback);
    }
}
