/**
 * @callback resolverCallback
 * @return {OuterPromiseType}
 */

/**
 * @typedef OuterPromiseTypeDef
 * @property {resolverCallback} getResolver
 */

/**
 * @typedef { OuterPromiseTypeDef & Promise } OuterPromiseType
 */

class OuterPromise {
    /**
     * @private
     */
    resolver;

    /**
     * @constructor
     * @param {boolean} resolveCondition
     * @return {OuterPromiseType}
     */
    constructor(resolveCondition) {
        const promise = new Promise((resolve) => {
            this.resolver = resolve;

            if(resolveCondition) {
                resolve();
            }
        });

        promise.getResolver = (callback) => {
            callback(this.resolver);
            return promise;
        }

        return /** @type {OuterPromiseType} */promise;
    }
}
