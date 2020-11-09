describe('TemplateHelper', () => {
    const TEMPLATE_ID = 'testTemplate';
    /**
     * @type {TemplateHelper}
     */
    let templateHelper;

    beforeEach(() => {
        templateHelper = testTemplateHelperFactory();
    })

   describe('getFirstTemplateNode', () => {
       it('should get clone of template from document', () => {
           // given
           document.body.innerHTML = `<template id="${TEMPLATE_ID}"><div></div></template>`;
           const templateContent = document.querySelector('template').content.firstElementChild;

           // when
           const result = templateHelper.getFirstTemplateNode(`#${TEMPLATE_ID}`);

           // then
           expect(result).toEqual(templateContent);
           expect(result).not.toBe(templateContent);
       });

       it('should get clone of template from custom parent', () => {
           // given
           const parent = document.createElement('div');
           parent.innerHTML = `<template id="${TEMPLATE_ID}"><div></div></template>`;
           document.body.innerHTML = ``;
           const templateContent = parent.querySelector('template').content.firstElementChild;

           // when
           const result = templateHelper.getFirstTemplateNode(`#${TEMPLATE_ID}`, parent);

           // then
           expect(result).toEqual(templateContent);
           expect(result).not.toBe(templateContent);
       });
   });

   function testTemplateHelperFactory() {
       return new TemplateHelper(queryFactory());
    }
});
