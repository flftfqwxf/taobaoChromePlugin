// document.body.style.backgroundColor="red"
// console.log($("btn:contains('下一页')"))
// $("btn:contains('下一页')").click()
// $('body').css('backgroundColor','red')
function getTable() {
    let tableStr = ""
    $('.trade-order-main').each((ids, item) => {
        tableStr += $(item).html()
    });
//     let tb = `
//     <table id="J_excel_table">
//     ${tableStr}
//     </table>
// `
//     console.log(tableStr)
    tableStr = tableStr.replace(/src\=\"/ig, 'src="https:')
    tableStr = tableStr.replace(/href\=\"/ig, 'href="https:')
    tableStr = tableStr.replace(/___\w{5,5}/ig, '')
    // $('body').append(tableStr);
    return tableStr
}

function checkPageCount(preLastNum) {
    let $pages = $('#sold_container ul.pagination >.pagination-item');
    let last = $pages.last(), lastNum = parseInt(last.text());
    if (lastNum > 1) {
        $pages.last().click()
    } else {
        return lastNum
    }
}

function pageGreaterThanOne() {
    let $pages = $('#sold_container ul.pagination >.pagination-item');
    let last = $pages.last(), lastNum = parseInt(last.text());
    if (lastNum > 1) {
        return true;
    } else {
        return false;
    }
}

function getPageElement() {
    let pageWrap = $('div[class^="simple-pagination-mod__container"]');
    let nextPage = pageWrap.find('button:last');
    if (nextPage.attr('disabled')) {
        return;
    } else {
    }
}

function htmlToJson(str) {
    let tableList = []
    let orderData = {}
    // $('#preContent >table').each((ids, item) => {
    $(str).each((ids, item) => {
        ids++;
        if (ids % 2 === 1) {
            let sp = $(item).find('.item-mod__checkbox-label').find('>span')
            orderData.order_num = sp.eq(2).html()
            orderData.order_time = sp.eq(5).html()
        } else {
            let trList = $(item).find('.suborder-mod__item')
            trList.each((ids, item) => {
                let tableData = {
                    order_num: orderData.order_num,
                    order_time: orderData.order_time
                }
                let info_td = $(item).find('td').eq(0)
                let price_td = $(item).find('td').eq(1)
                let num_td = $(item).find('td').eq(2)
                let wangwang_td = $(item).find('td').eq(4)
                let status_td = $(item).find('td').eq(5)
                let pay_td = $(item).find('td').eq(6)
                if (ids > 0) {
                    wangwang_td = trList.eq(0).find('td').eq(4)
                    status_td = trList.eq(0).find('td').eq(5)
                    pay_td = trList.eq(0).find('td').eq(6)
                }
                tableData.img = info_td.find('.ml-mod__media img').attr('src')
                let pro_info_ele = info_td.find('.production-mod__production >div').eq(1)
                let lnk = pro_info_ele.find('a').eq(0)
                tableData.href = lnk.attr('href')
                tableData.pro_name = lnk.find('span').eq(1).html()
                tableData.color = pro_info_ele.find('.production-mod__sku-item >span').eq(2).html()
                tableData.price = price_td.find('.price-mod__price >p >span').eq(1).html()
                tableData.num = num_td.find('p').html()
                tableData.wangwang = wangwang_td.find('.buyer-mod__buyer >p').eq(0).find('a').html()
                tableData.status = status_td.find('.text-mod__link').html()
                tableData.pay = pay_td.find('.price-mod__price span').eq(1).html()
                tableData.express = pay_td.find('.price-mod__price').next().find('>span').eq(1).html()
                tableData.detailUrl = status_td.find("a:contains('详情')").attr('href')
                // $.ajax({
                //     type: 'get',
                //     url: tableData.detailUrl,
                //     success: (data) => {
                //         console.log('detail',data)
                //     }, error: (err) => {
                //         console.log('err',err)
                //     }
                // })
                tableList.push(tableData);
                // console.log(tableData)
            })
        }
    })
    // console.log(tableList)
    // $('#preContent').html(request.content)
    // chrome.storage.local.set({'table': tableList}, function() {
    //     console.log('缓存成功')
    // })
    return tableList;
}

var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;
    return function(obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer) {
                if (mutations[0].type === 'attributes') {
                    let isLoading = mutations[0].target.getAttribute('class').indexOf('hidden') === -1
                    callback(isLoading);
                }
            });
            // have the observer observe foo for changes in children
            obs.observe(obj, {childList: true, subtree: true, attributes: true});
            return obs;
        }
        else if (eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

function getNextData() {
    let pageWrap = $('div[class^="simple-pagination-mod__container"]');
    let nextPage = pageWrap.find('button:last');
    if (nextPage.attr('disabled')) {
        getOrderDetails(function() {
            chrome.runtime.sendMessage({cmd: 'loaded', tableList: window.tableList}, function(status) {
                if (status === 200) {
                    console.log('获取完成');
                    console.log(window.tableList);
                } else {
                    console.log(status);
                }
            });
            //取消对dom节点的监控
            OBS.disconnect();
        })
        return;
    } else {
        nextPage.click();
    }
}

function getOrderDetails(callback) {
    var deferreds = [];
    window.tableList.forEach((item) => {
        deferreds.push($.ajax({
            type: 'get',
            url: item.detailUrl,
            success: (pagestr) => {
                let detailPage = $(pagestr);
                let reg =/var data = JSON.parse\('.+\);/ig;

                let dataJsString=pagestr.match(reg)
                let dataFun = `
                    ${dataJsString}
                    return data;
                `
                item.detailInfo = new Function(dataFun)();
                // is object a function?


                console.log('detail', item.detailInfo)
            }, error: (err) => {
                console.log('err', err)
            }
        }))
    })
    $.when(...deferreds).done(function() {
        console.log('获取详情完成')
        callback();
        // $("div").append("<p>All done!</p>");
    }).fail((error) => {
        console.log('错误信息：' + error.toString())
    })
}

let pageIndex = 0;

function getAllPageData() {
    pageIndex = 0;
    window.tableList = htmlToJson(getTable());
    console.log(`获取第${++pageIndex}页数据-------------------`)
    getNextData();
}

let isInitLoadingEvent = false;
let OBS = null;
// Observe a specific DOM element:
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log($('#sold_container >div >div:last')[0].innerHTML);
    if (!isInitLoadingEvent) {
        isInitLoadingEvent = true;
        OBS = observeDOM($('#sold_container >div >div:last')[0], function(isLoading) {
            if (isLoading) {
                console.log('page is loading');
            } else {
                console.log('page is loaded');
                setTimeout(() => {
                    let currentPageData = htmlToJson(getTable());
                    console.log(`获取第${++pageIndex}页数据-------------------`)
                    console.log(currentPageData);
                    window.tableList = window.tableList.concat(currentPageData);
                    getNextData();
                }, 300);
            }
        });
    }
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    // if (request.cmd == 'test') alert(request.value);
    switch (request.cmd) {
        case 'createExcel':
            sendResponse(window.tableList);
            break;
        case 'getPageCount':
            getAllPageData();
            break;
        default:
            break;
    }
});

