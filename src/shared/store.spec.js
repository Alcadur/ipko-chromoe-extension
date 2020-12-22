describe('store.js', () => {
   const RECIPIENTS_KEY = 'recipients';

   describe('store', () => {
      let storage;

      beforeEach(() => {
         storage = new Storage();
         chrome.storage.local.set.callsFake((a, b) => b());
      });

      describe('save', () => {
         it('should save data by chrome storage', (done) => {
            // given
            const key = 'key1';
            const value = 'value1';

            // when
            storage.save(key, value).then((savedValue) => {
               // then
               expect(savedValue).toEqual(savedValue);
               expect(chrome.storage.local.set.withArgs({[key]: value}).calledOnce)
                   .toBe(true, 'chrome.storage.local.set was not call with correct argument');
               done();
            });
         });
      });

      describe('get', () => {
         it('should get data from chrome storage', (done) => {
            // given
            const key = 'key2';
            const savedValue = 'value2';
            chrome.storage.local.get.callsFake((a, b) => b({[key]: savedValue}))

            // when
            storage.get(key).then((value) => {
               // then
               expect(value).toEqual(savedValue);
               expect(chrome.storage.local.get.withArgs(key).calledOnce)
                   .toBe(true, 'chrome.storage.local.get was not call with correct arguments');
               done();
            });
         });
      });

      describe('saveRecipients', () => {
         it('should save recipients to chrome storage', (done) => {
            // given
            const recipients = [];

            // when
            storage.saveRecipients(recipients).then(() => {
               // then
               expect(chrome.storage.local.set.withArgs({[RECIPIENTS_KEY]: recipients}).calledOnce)
                   .toBe(true, 'chrome.storage.local.save was not call with correct arguments');
               done();
            });
         });
      });


      describe('getRecipients', () => {
         it('should get saved recipients from chrome storage', (done) => {
            // given
            chrome.storage.local.get.callsFake((a, b) => b({}));

            // when
            storage.getRecipients().then(() => {
               // then
               expect(chrome.storage.local.get.withArgs(RECIPIENTS_KEY).called)
                   .toBe(true, 'chrome.storage.local.get was not called with correct arguments');
               done();
            });
         });
      });
   });

   describe('addReRecipient', () => {
      it('should get all recipients, add the new one and save them all', (done) => {
         // given
         const newRecipient = /** @type {Recipient} */{ recipient: 'the new one' };
         const oldRecipients = [{ recipient: 'old one' }];
         const expected = [...oldRecipients, newRecipient];
         chrome.storage.local.get.callsFake((a, b) => b({ [RECIPIENTS_KEY]: oldRecipients }));
         chrome.storage.local.set.callsFake((a, b) => b());

         // when
         storage.addReRecipient(newRecipient).then(() => {
            // then
            expect(chrome.storage.local.set.withArgs({[RECIPIENTS_KEY]: expected}).calledOnce)
                .toBe(true, 'chrome.storage.local.save was not call with correct arguments')
            done();
         });
      });
   });
});
