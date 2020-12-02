class TabUtils {
    getOnlyIPkoTab(callback) {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
                url: 'https://www.ipko.pl/*'
            },
            (tabs) => {
                if (tabs && tabs.length) {
                    callback(tabs[0]);
                }
            }
        );
    }

    getActiveTabs(callback) {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            (tabs) => {
                callback(tabs);
            }
        );
    }
}

function tabUtilsFactory() { return new TabUtils(); }

const tabUtilsProvider = providerGenerator(tabUtilsFactory);


