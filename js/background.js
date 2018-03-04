chrome.runtime.onInstalled.addListener(function() {
    console.log('background')
    window.localStorage.setItem('background', 1111);

});
/**
 * 创建或更新成功执行的动作
 * @param evt
 * @param content
 * @private
 */
var _tabUpdatedCallback = function (evt, content) {
    return function (newTab) {
        if (content) {
            setTimeout(function () {
                chrome.tabs.sendMessage(newTab.id, {
                    type: 'update',
                    content: content,
                    event: evt
                });
            }, 300)
        }
    };
};

var _openFileAndRun = function (file, txt) {
    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        var isOpened = false;
        var tabId;
        var reg = new RegExp("^chrome.*" + file + ".html$", "i");
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (reg.test(tabs[i].url)) {
                isOpened = true;
                tabId = tabs[i].id;
                break;
            }
        }
        if (!isOpened) {
            chrome.tabs.create({
                url: 'template/' + file + '.html',
                active: true
            }, _tabUpdatedCallback(file, txt));
        } else {
            chrome.tabs.update(tabId, {highlighted: true}, _tabUpdatedCallback(file, txt));
        }
    });
};