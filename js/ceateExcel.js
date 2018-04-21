(function($) {
    const BG = chrome.extension.getBackgroundPage().BG;

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
        sendMessageToContentScript({cmd: 'createExcel'}, function(response) {
            BG.Utils.openFileAndRun('preView', response);
            // console.log('来自content的回复：' + response);
            // exportToExcel(response, '报表')
        });

    })
    $('#getPageCount').click(() => {
        // chrome.storage.local.get((items) => {
        //     console.log(items)
        //     $('#pageCount').html('asdfsadf' + items)
        // })
        sendMessageToContentScript({cmd: 'getPageCount'}, function(response) {
            // console.log('来自content的回复：' + response);
            // exportToExcel(response, '报表')
        });
    })
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.cmd === 'loaded') {
            let tableList = request.tableList;
            $('#pageCount').html(tableList.length);
            let filters=request.taobaoFilters;
            $('.filter_wrap').html(filters.join('<br>'));
            sendResponse(200)
        }
    });
})(jQuery);
