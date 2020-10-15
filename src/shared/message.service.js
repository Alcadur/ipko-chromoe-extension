'use strict';

const messageActions = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.actionName && messageActions[message.actionName]) {
        messageActions[message.actionName].forEach((method) => {
            const args = message.args || [];
            args.push(sendResponse);
            args.push(sender);

            method(...args)
        });
    }
});

class MessageService {
    /**
     * @param message
     * @param {Function} [callback]
     */
    sendMessageToTab(message, callback) {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
                url: 'https://www.ipko.pl/*'
            },
            (tabs) => {
                if (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, message, null, callback);
                }
            }
        );
    }

    /**
     *
     * @param message
     * @param {Function} [callback]
     */
    sendMessageToExtension(message, callback) {
        chrome.runtime.sendMessage(message, callback);
    }

    /**
     * @param {string} actionType
     * @param {Function} callback
     */
    addMessageActionListener(actionType, callback) {
        messageActions[actionType] = messageActions[actionType] || [];
        messageActions[actionType].push(callback);
    }
}

function messageServiceFactory() { return new MessageService(); }
