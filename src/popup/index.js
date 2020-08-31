'use strict';

query.one('button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});
