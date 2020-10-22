'use strict';

import { urlFactory } from './options-urls.js';

describe('options URL', () => {
    describe('urlFactory', () => {
        it('should return pattern when it will be converted to string', () => {
           // given
           const pattern = 'my/hash/$url';

           // when
            const result = urlFactory(pattern);

            // then
            expect(result.toString()).toEqual(pattern);
        });

        it('should store pattern in public variable', () => {
            // given
            const pattern = 'public/pattern';

            // when
            const result = urlFactory(pattern);

            // then
            expect(result.pattern).toEqual(pattern);
        });

        it('should pattern should be immutable', () => {
            // given
            const pattern = 'base/url';
            const result = urlFactory(pattern);

            // when
            expect(() => result.pattern += '/extended').toThrowMatching((error) =>
                error.message.indexOf('Cannot assign to read only property \'pattern\'') !== -1
            );
        });

        it('should fill variables by value from arguments', () => {
            // given
            const values = ['animals', 'dog', 'rainbow'];
            const valuesPattern = 'pa/$var1/tte/$var2/rn/$var3';
            const expected = `pa/${values[0]}/tte/${values[1]}/rn/${values[2]}`;
            const url = urlFactory(valuesPattern);

            // when
            const result = url(...values);

            // then
            expect(result).toEqual(expected);
        })
    });
});
