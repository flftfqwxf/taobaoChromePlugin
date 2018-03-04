(function($) {
    function getCurrentTabId(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    }



// executeScript's a function rather than a string
    function remex(tabId, func, callback) {
        chrome.tabs.executeScript(tabId, {code: '(' + func.toString() + ')()'}, callback);
    }

    function getTable() {
        document.body.style.backgroundColor = "red";
        // jQuery('body')
    }

    function getStorage(callback) {
        chrome.storage.local.get('table', function(items) {
            if (items && callback) {
                callback(items);
            }
            console.log(items);
        })
    }

    function windowContextRemex(tabId, func, callback) {
        var code = JSON.stringify(func.toString());
        code = 'var script = document.createElement("script");' +
            'script.innerHTML = "(' + code.substr(1, code.length - 2) + ')();";' +
            'document.body.appendChild(script)';
        chrome.tabs.executeScript(tabId, {
            code: code
        }, function() {
            if (callback)
                return callback.apply(this, arguments);
        });
    }

    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
                if (callback) callback(response);
            });
        });
    }

    $('#createExcelBtn').click(() => {
       let bg = chrome.extension.getBackgroundPage();

        sendMessageToContentScript({cmd: 'test', value: '你好，我是popup！'}, function(response) {
            bg._openFileAndRun('preView',response);

            // console.log('来自content的回复：' + response);
            // exportToExcel(response, '报表')

        });
        // getStorage(function(items) {
        //     exportToExcel(items.table, '报表')
        // })
        // console.log(chrome.extension.getURL('js/common/jquery-2.1.3.min.js'))
        // getCurrentTabId(function(tabId) {
        //     // windowContextRemex(tabId, getTable, function() {
        //     // })
        //     chrome.tabs.executeScript(tabId, {file: '/js/common/jquery-2.1.3.min.js'}, function() {
        //         windowContextRemex(tabId, getTable, function() {
        //         })
        //     })
        // })
    })
})(jQuery);