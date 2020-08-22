const recipients = [];

const listTableSelector = '.iwUhV';
const detailsPageCheckSelector = '.TTPMB';
const layerClassName = 'collect-data-layer';
const layerSelector = `.${layerClassName}`;

function query(selector) {
    return document.querySelector(selector);
}

let currentRowIndex = 0;
let numberOfRecipients
let layerIsOpen = false;

async function collectData() {
    numberOfRecipients = queryAll(listTableSelector + ' tr').length;
    if (!layerIsOpen) {
        openLayer();
    }
    updateLayerInfo();
    await getData(currentRowIndex);
    await backToList();
    if (hasNext()) {
        await collectData();
    } else {
        storage.saveRecipients(recipients);
        closeLayer();
        await addDataCollectButton();
        currentRowIndex = 0;
        storage.getRecipients((i) => console.log('recipeints', i));
    }
}

function openLayer() {
    const layer = document.createElement('div');
    layer.classList.add(layerClassName);
    layer.innerHTML = `<div class="layer-content">Pobrano <span class="collected-data-number">-1</span> z ${numberOfRecipients}</div>`

    document.body.appendChild(layer);
    layerIsOpen = true;
}

function closeLayer() {
    query(layerSelector).remove();
    layerIsOpen = false;
}

function updateLayerInfo() {
    query(`${layerSelector} .collected-data-number`).textContent = currentRowIndex;
}

async function getData(index) {
    await enterTo(index);
    const fromNumber = (query('._3pHQr') || {}).innerText || '';
    recipients.push({
        fromNumber,
        recipient: query('[name$="data.recipient.name"]').value,
        recipientNumber: query('[name$="data.recipient.account.number"]').value,
        title: query('[name$="data.title"]').value
    });

    return recipients;
}

async function enterTo(index) {
    queryAll(listTableSelector + ' tr')[index].click();
    await waitFor(detailsPageCheckSelector);
    return true;
}

function waitFor(selector) {
    return new Promise((resolve) => {
        waitForElement(selector, resolve);
    })
}

function waitForElement(selector, promiseResolver) {
    setTimeout(() => {
        if(document.querySelector(selector)) {
            promiseResolver();
        } else {
            waitForElement(selector, promiseResolver);
        }
    }, 150)
}

async function backToList() {
    query('button[value="cancel"]').click();
    await waitFor(listTableSelector);
}

function hasNext() {
    currentRowIndex += 1;
    return currentRowIndex < numberOfRecipients;
}
