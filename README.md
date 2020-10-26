# ipko-chromoe-extension

### Manual install
ipko-chromoe-extension or IPKO+ is not released yet in Chrome Web Store,
but you can install it by the download ipko+.zip file (or clone repository and
build it manually) and add it in chrome://extensions/ 

### Description
This extension improves work with ipko.pl site. If you want to have
predefined transactions data but without creating standing order, or
maybe you would like to search recipients without opening a popup on
transaction site.

Live search on the recipient list? No problem.
Or maybe you are also using portal.pkoleasing.pl, and you would like 
have pay for invoices without manual copying data between leasing and bank website?

All those features will be available in the released version of that extension.

It will NOT help you in automatization transactions or create
transactions schedule, it also will NEVER ask or store your
bank credential or any other sensitive data.

### Things to do before release

 - [ ] automatically save recipient after confirm it on the bank website
 - [ ] wiki page (in polish)
 - [ ] possibility to have multiple transaction titles and amount for one recipient
 - [ ] full extension options page
 - [ ] save user account list from users products
 - [ ] manual add account data
 - [ ] edit account data
 
 - [x] format account number by a pattern: `\d{2} (?:\d{4}\s?){6,}`
 - [x] manual add recipient from extension options
 - [x] edit recipient from extension options
 - [x] live search on recipient list
 - [x] save recipients data from list
 - [x] saved recipients preview
 - [x] extension popup menu
 - [x] search recipients and prefill transaction form
 

### Things to do after release
 - [ ] Integrate extension with leasing portal
 - [ ] Improve popup message layout
