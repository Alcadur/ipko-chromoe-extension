/**
 * @param {function} instanceFactory
 */
function providerGenerator (instanceFactory) {
    return (function (instanceFactory) {
        let instance = null;

        return () => {
            if (!instance) {
                instance = instanceFactory();
            }

            return instance;
        };
    })(instanceFactory)
}
