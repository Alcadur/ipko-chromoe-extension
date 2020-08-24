const pageTitleMap = {
    'Odbiorcy': addDataCollectButton
}
const tableSelector = 'form ._3082t';

function updatePageContent(pageTitle) {
    (pageTitleMap[pageTitle] || function () {})();
}

async function addDataCollectButton() {
    await waitUntilLoaderGone();
    await waitFor(tableSelector, 50);
    const node = query(tableSelector);
    const collectButton = createCollectButton();
    const newRow = createNewRow();
    newRow.appendChild(collectButton);

    insertNewRowOnTop(node, newRow);
}

function createCollectButton() {
    const iconUrl = chrome.runtime.getURL('resources/user-add-icon.png');
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<img class="icon" src="${iconUrl}" alt="Collect users icon">Zbierz dane odbiorców`;
    button.addEventListener('click', collectData)

    return button;
}

function createNewRow() {
    const newRow = document.createElement('div');
    newRow.classList.add('_3CHZ5');
    newRow.classList.add('icon-container');

    return newRow;
}

function insertNewRowOnTop(node, newRow) {
    const firstChild = node.querySelector(':first-child');
    node.insertBefore(newRow, firstChild);
}
