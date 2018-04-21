class Utils {
    constructor() {
    }

    /**
     * 创建或更新成功执行的动作
     * @param evt
     * @param content
     * @private
     */
    tabUpdatedCallback(evt, content) {
        return function(newTab) {
            if (content) {
                setTimeout(function() {
                    chrome.tabs.sendMessage(newTab.id, {
                        type: 'update',
                        content: content,
                        event: evt
                    });
                }, 300)
            }
        };
    }

    /**
     * 打开窗口
     * @param file
     * @param txt
     */
    openFileAndRun(file, txt) {
        let _this=this;
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
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
                }, _this.tabUpdatedCallback(file, txt));
            } else {
                chrome.tabs.update(tabId, {highlighted: true}, _this.tabUpdatedCallback(file, txt));
            }
        });
    }

    /**
     * 向 content script发送消息
     * @param message
     * @param callback
     */
    sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
                if (callback) callback(response);
            });
        });
    }
}
export default new Utils();