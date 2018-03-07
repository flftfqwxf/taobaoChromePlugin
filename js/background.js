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
var _tabUpdatedCallback = function(evt, content) {
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
};
var _openFileAndRun = function(file, txt) {
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
            }, _tabUpdatedCallback(file, txt));
        } else {
            chrome.tabs.update(tabId, {highlighted: true}, _tabUpdatedCallback(file, txt));
        }
    });
};
// chrome.storage.local.set({'pageDate': 1111})
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // if (callback) callback(tabs.length ? tabs[0].id : null);
    let filters = {urls: ["https://trade.taobao.com/trade/itemlist/asyncSold.htm?event_submit_do_query=1&_input_charset=utf8"], types: ['xmlhttprequest']}
    tabs[0] ? filters.integer = tabs[0].id : '';
    let cachePage = {};
    let isNotAjax = true;
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            chrome.storage.local.set({'pageDate': 22222})
            // window.localStorage.setItem();
            //https://trade.taobao.com/trade/itemlist/asyncSold.htm?event_submit_do_query=1&_input_charset=utf8
            console.log('----------------------------------------------')
            console.log(details.url)
            // if (details.url.endsWith('&isajax=1')) {
            //
            //   return {}
            // }
            // if (!details.url.endsWith("#do_not_modify_this_request")) {
            let formData = details.requestBody.formData;
            let resultData = {}
            for (var item in formData) {
                resultData[item] = formData[item][0]
            }
            console.log(resultData)
            if (isNotAjax) {
                isNotAjax = false

                $.ajax({
                    type: "POST",
                    url: details.url,
                    data: resultData,
                    async:false,
                    success: function(data) {
                        console.log(data)
                        return {};
                    },
                    error: function(msg) {
                        console.log(msg)
                    },
                    dataType: 'json'
                });
            } else {
                return {}
            }
            // return {redirectUrl:details.url+"#do_not_modify_this_request"}
            // }
            // 由于 sendResponse 是异步调用的，需要返回 true
        },
        filters, ["blocking", "requestBody"]
    );
});
