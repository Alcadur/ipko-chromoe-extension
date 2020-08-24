class Wait {
    BASE_TIMEOUT_IN_MS = 300;
    trialCount = 0;

    constructor(query) {
        /**
         * @type Query
         */
        this.query = query;
    }

    /**
     * Resolve when the element will exist in DOM by a given number of trials.
     * Between each trial is 300ms latency
     *
     * @param {string} selector
     * @param {number} [trialLimit]
     * @returns {Promise<void>}
     */
    for(selector, trialLimit = 100) {
        return new Promise((resolve, reject) => {
            this.forElement(selector, resolve, reject, trialLimit);
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
    forElement(selector, promiseResolver, promiseReject, trialLimit) {
        setTimeout(() => {
            if (this.trialCount >= trialLimit) {
                this.trialCount = 0;
                promiseReject();
                return;
            }

            if(this.query.one(selector)) {
                this.trialCount = 0;
                promiseResolver();
            } else {
                this.trialCount += 1;
                this.forElement(selector, promiseResolver, promiseReject, trialLimit);
            }
        }, this.BASE_TIMEOUT_IN_MS)
    }

    /**
     * Resolve the permission when no loader element will be on a page
     *
     * @returns {Promise<void>}
     */
    untilLoaderGone() {
        const loaderSelector = 'form svg';
        return new Promise((resolve) => {
            this.until(loaderSelector, resolve);
        });
    }

    /**
     * Will call {@param promiseResolve} when element by given selector will not exist on a page
     *
     * @param {string} selector
     * @param {function} promiseResolve
     */
    until(selector, promiseResolve) {
        setTimeout(() => {
            if (this.query.one(selector)) {
                this.until(selector, promiseResolve)
                return;
            }

            promiseResolve()
        }, this.BASE_TIMEOUT_IN_MS);
    }
}

/**
 * @returns {Wait}
 */
function waitFactory() { return new Wait(queryFactory())}

/**
 * @type {Wait}
 */
const wait = waitFactory();







