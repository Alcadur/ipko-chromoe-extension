const BASE_TIMEOUT_IN_MS = 300;
let trialCount = 0;

/**
 * Resolve when the element will exist in DOM by a given number of trials.
 * Between each trial is 300ms latency
 *
 * @param {string} selector
 * @param {number} [trialLimit]
 * @returns {Promise<void>}
 */
function waitFor(selector, trialLimit = 100) {
    return new Promise((resolve, reject) => {
        waitForElement(selector, resolve, reject, trialLimit);
    })
}

/**
 * Check did element with given selector exists in DOM, if not wait 300ms and check again.
 * Checking loop will be brake when the counter will reach {@param trialLimit}
 *
 * @param {string} selector
 * @param {function} promiseResolver
 * @param {function} promiseReject
 * @param {number} trialLimit
 */
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
    }, BASE_TIMEOUT_IN_MS)
}

/**
 * Resolve the permission when no loader element will be on a page
 *
 * @returns {Promise<void>}
 */
function waitUntilLoaderGone() {
    const loaderSelector = 'form svg';
    return new Promise((resolve) => {
        waitUntil(loaderSelector, resolve);
    });
}

/**
 * Will call {@param promiseResolve} when element by given selector will not exist on a page
 *
 * @param {string} selector
 * @param {function} promiseResolve
 */
function waitUntil(selector, promiseResolve) {
    setTimeout(() => {
        if (query(selector)) {
            waitUntil(selector, promiseResolve)
            return;
        }

        promiseResolve()
    }, BASE_TIMEOUT_IN_MS);
}





