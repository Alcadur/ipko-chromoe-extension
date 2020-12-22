'use strict';
// TODO: refactor and tests

const messageService = messageServiceFactory();
const getRecipientButton = query.one('#getRecipients');
const tabUtils = tabUtilsProvider();

tabUtils.getActiveTabs((tabs) => {
    const isPkoPage = !!tabs[0].url.match(/ipko\.pl/);

    if (!isPkoPage) {
        document.querySelector('.ipko-only-section').remove();
    }
})

query.one('#recipients').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

getRecipientButton.addEventListener('click', () => {
    getRecipientButton.setAttribute('disabled', 'disabled');
    messageService.sendMessageToTab({ actionName: MessageActionType.getRecipients });
});

messageService.sendMultiMessagesToTab([
    { actionName: MessageActionType.isLoggedIn },
    { actionName: MessageActionType.isGetRecipientFinished },
], ([isLoggedIn, isGetRecipientFinished]) => {
    getRecipientButton.disabled = !isLoggedIn || !isGetRecipientFinished;
});

messageService.addMessageActionListener(MessageActionType.enableGetRecipientButton, () => {
    getRecipientButton.removeAttribute('disabled');
});
