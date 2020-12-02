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
     * @param {TabUtils} tabUtils
     */
    constructor(tabUtils) {
        this.tabUtils = tabUtils;
    }

    /**
     * @param message
     * @param {Function} [callback]
     */
    sendMessageToTab(message, callback) {
        this.tabUtils.getOnlyIPkoTab((iPkoTab) =>
            chrome.tabs.sendMessage(iPkoTab.id, message, null, callback))
    }

    /**
     * @param {{ actionName: MessageActionType }[]} messages
     * @param {function([]): void} callback
     */
    sendMultiMessagesToTab(messages, callback) {
        let results = [];
        let order = [];

        messages.forEach( message => {
            order.push(message.actionName);

            this.sendMessageToTab(message, (response) => {
                results.push({ [message.actionName]: response });

                if (results.length === order.length) {
                    this.sendMultiMessagesTabResponse(order, results, callback)
                }
            });
        });
    }

    /**
     * @private
     * @param {[]} order
     * @param {[]} results
     * @param {function(any): void} callback
     */
    sendMultiMessagesTabResponse(order, results, callback) {
        const resultsObjects = results.reduce((prevValue, currentValue) => {
            const key = Object.keys(currentValue)[0];
            prevValue[key] = currentValue[key];
            return prevValue
        }, {})
        const sortedResults = order.map(actionName => resultsObjects[actionName]);

        callback(sortedResults);
    }
    /**
     *
     * @param message
     * @param {Function} [callback]
     */
    sendMessageToExtension(message, callback) {
        if (!!callback) {
            chrome.runtime.sendMessage(message, callback);
        } else {
            chrome.runtime.sendMessage(message);
        }
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

function messageServiceFactory() { return new MessageService(tabUtilsProvider()); }
