class IdGenerator {
    /**
     * @param {string} [prefix = '']
     * @param {string} [postfix = '']
     * @return {string}
     */
    static nextId(prefix = '', postfix = '') {
        let id = '';
        const hash = btoa(Math.sqrt(Date.now() * Math.random()).toString())
        if (prefix) {
            id = `${prefix}-`
        }

        id += hash;

        if (postfix) {
            id += `-${postfix}`
        }

        return id;
    }
}
