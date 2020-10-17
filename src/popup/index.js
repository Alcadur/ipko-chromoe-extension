'use strict';

import { changePageAction } from './message-actions/change-page.js';

const messageService = messageServiceFactory();

messageService.sendMessageToTab({ actionName: MessageActionType.getLastPage }, (lastPageTitle) =>
    changePageAction(lastPageTitle, document.body)
);

query.one('#recipients').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

query.one('#getRecipients').addEventListener('click', () => {
    messageService.sendMessageToTab({ actionName: MessageActionType.getRecipients });
});

messageService.addMessageActionListener(MessageActionType.changePage, (...args) => changePageAction(args[0], document.body))
