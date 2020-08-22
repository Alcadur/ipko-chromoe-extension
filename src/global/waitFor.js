// @include https://www.ipko.pl

let trialCount = 0;
let baseTimeoutInMs = 300;

/**
 * Resolve when element when element will exists in DOM by given number of trials.
 * Between each trial is 300ms latency
 *
 * @param selector
 * @param trialLimit
 * @returns {Promise<void>}
 */
function waitFor(selector, trialLimit = 100) {
    return new Promise((resolve, reject) => {
        waitForElement(selector, resolve, reject, trialLimit);
    })
}

function waitForElement(selector, promiseResolver, promiseReject, trialLimit) {
    setTimeout(() => {
        if (trialCount >= trialLimit) {
            trialCount = 0;
            promiseReject();
            return;
        }

        if(query(selector)) {
            trialCount = 0;
            promiseResolver();
        } else {
            trialCount += 1;
            waitForElement(selector, promiseResolver, promiseReject, trialLimit);
        }
    }, baseTimeoutInMs)
}


function waitUntilLoaderGone() {
    const loaderSelector = 'form svg';
    return new Promise((resolve) => {
        waitUntil(loaderSelector, resolve);
    });
}

function waitUntil(selector, promiseResolve) {
    setTimeout(() => {
        if (query(selector)) {
            waitUntil(selector, promiseResolve)
            return;
        }

        promiseResolve()
    }, baseTimeoutInMs);
}





