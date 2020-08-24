/**
 * @typedef {Object} Recipient
 * @property {(string|number)} fromNumber
 * @property {string} recipient
 * @property {(number|string)} recipientNumber
 * @property {string} title
 */

const recipients = [];
const listTableSelector = '.iwUhV';
const detailsPageCheckSelector = '.TTPMB';
const layerClassName = 'collect-data-layer';
const layerSelector = `.${layerClassName}`;

let currentRowIndex = 0;
let numberOfRecipients
let isLayerOpen = false;

async function collectData() {
    numberOfRecipients = queryAll(listTableSelector + ' tr').length;
    if (!isLayerOpen) {
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
        currentRowIndex = 0;
        // TODO: remove before release
        storage.getRecipients((i) => console.log('recipeints', i));
    }
}

function openLayer() {
    const layer = document.createElement('div');
    layer.classList.add(layerClassName);
    layer.innerHTML = `<div class="layer-content">Pobrano <span class="collected-data-number">-1</span> z ${numberOfRecipients}</div>`

    document.body.appendChild(layer);
    isLayerOpen = true;
}

function closeLayer() {
    query(layerSelector).remove();
    isLayerOpen = false;
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
}

async function enterTo(index) {
    queryAll(listTableSelector + ' tr')[index].click();
    await waitFor(detailsPageCheckSelector);
}

async function backToList() {
    query('button[value="cancel"]').click();
    await waitFor(listTableSelector);
}

function hasNext() {
    currentRowIndex += 1;
    return currentRowIndex < numberOfRecipients;
}
