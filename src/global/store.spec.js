describe('store.js', () => {
   describe('store', () => {
      describe('save', () => {
         it('should save data by chrome storage', () => {
            // given
            const key = 'key1';
            const value = 'value1';

            // when
            storage.save(key, value);

            // then
            expect(chrome.storage.local.set.withArgs({[key]: value}).calledOnce)
                .toBe(true, 'chrome.storage.local.set was not call with correct argument');
         });
      });

      describe('get', () => {
         it('should get data from chrome storage', () => {
            // given
            const key = 'key2';
            const callback = () => {};

            // when
            storage.get(key, callback);

            // then
            expect(chrome.storage.local.get.withArgs(key, callback).calledOnce)
                .toBe(true, 'chrome.storage.local.get was not call with correct arguments');
         });
      });

      describe('saveRecipients', () => {
         it('should save recipients to chrome storage', () => {
            // given
            const recipients = [];

            // when
            storage.saveRecipients(recipients);

            // then
            expect(chrome.storage.local.set.withArgs({[RECIPIENTS_KEY]: recipients}).calledOnce)
                .toBe(true, 'chrome.storage.local.save was not call with correct arguments')
         });
      });

      describe('getRecipients', () => {
         it('should get saved recipients from chrome storage', () => {
            // given
            const callback = () => {};

            // when
            storage.getRecipients(callback);

            // then
            expect(chrome.storage.local.get.withArgs(RECIPIENTS_KEY, callback).calledOnce)
                .toBe(true, 'chrome.storage.local.get was not called with correct arguments')
         });
      });
   });
});
