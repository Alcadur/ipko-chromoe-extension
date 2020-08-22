let lastPage = null;
let titleSelector = 'h1.TTPMB';

async function pageClickHandler() {
    const trialLimit = 10;

    document.removeEventListener('click', pageClickHandler);
    try {
        await waitFor(titleSelector, trialLimit);
        pageChangeHandler();
    } catch (e) {
    }
    document.addEventListener('click', pageClickHandler);
}

function pageChangeHandler() {
    const newPage = (query(titleSelector) || {}).innerText || '';
    if (newPage !== lastPage) {
        lastPage = newPage;
        updatePageContent(newPage);
    }
}

document.addEventListener('click', pageClickHandler);
document.addEventListener('DOMContentLoaded ', pageChangeHandler)
