'use strict';

export function urlFactory(pattern) {
    const urlFunction = function(...variables) {
        return pattern.replace(/(\$[^/]+)/g, () => variables.shift());
    };
    urlFunction.toString = () => pattern;
    Object.defineProperty(urlFunction, 'pattern', {
        value: pattern,
        writable: false
    })
    return urlFunction;
}

export const DASHBOARD = urlFactory('dashboard');
export const RECIPIENTS_LIST = urlFactory('recipients');
export const ADD_RECIPIENT = urlFactory(`${RECIPIENTS_LIST}/add`);
export const EDIT_RECIPIENT = urlFactory(`${RECIPIENTS_LIST}/$recipientName/edit`);

