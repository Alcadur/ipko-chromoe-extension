export const recipientFormTemplate = `
<form>
    <div class="row">
        <label for="fromNumber">Z konta</label>
        <input id="fromNumber" class="format-account" type="text">
    </div>
    <div class="row">
        <label for="recipient">Odbiorca*</label>
        <input id="recipient" type="text">
    </div>
    <div class="row">
        <label for="aliasesInput">Aliasy</label>
        <input type="text" id="aliasesInput">
        <div class="aliases-container">
            <span id="aliasInputMirror"></span>
        </div>
    </div>
    </div>
    <div class="row">
        <label for="recipientNumber">Na konto</label>
        <input id="recipientNumber" class="format-account" type="text">
    </div>
    <section id="payments">
        <header class="row">Płatności</header>

        <div class="rows-wrapper"></div>
    </section>
    <a class="add-payment-button"></a>

    <template id="paymentRowTemplate">
        <div class="payment">
            <a class="remove-payment-button"></a>
        </div>
    </template>

    <template id="rowTemplate">
        <div class="row">
            <label for=""></label>
            <input id="" type="text">
        </div>
    </template>
    
    <template id="newAlias">
        <div class="new-alias just-created">
            <span class="label"></span>
            <span class="remove">⛌</span>
        </div>
    </template>
</form>
`;
