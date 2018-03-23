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

let ORDER_INDEX = 0;

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
            ORDER_INDEX++;
            let trList = $(item).find('.suborder-mod__item')
            trList.each((trids, item) => {
                let tableData = {
                    order_index: ORDER_INDEX,
                    order_num: orderData.order_num,
                    order_time: orderData.order_time
                }
                let info_td = $(item).find('td').eq(0)
                let price_td = $(item).find('td').eq(1)
                let num_td = $(item).find('td').eq(2)
                let wangwang_td = $(item).find('td').eq(4)
                let status_td = $(item).find('td').eq(5)
                let pay_td = $(item).find('td').eq(6)
                if (trids > 0) {
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
                tableData.price = parseFloat(price_td.find('.price-mod__price >p >span').eq(1).html())
                tableData.num = parseFloat(num_td.find('p').html())
                tableData.wangwang = wangwang_td.find('.buyer-mod__buyer >p').eq(0).find('a').html()
                tableData.status = status_td.find('.text-mod__link').html()
                tableData.pay = parseFloat(pay_td.find('.price-mod__price span').eq(1).html().trim())
                tableData.express = pay_td.find('.price-mod__price').next().find('>span').eq(1).html()
                tableData.detailUrl = status_td.find("a:contains('详情')").attr('href')
                //进价
                tableData.purchasePrice = parseFloat(tableData.price / 2);
                //进价快递费
                tableData.purchaseExpress = 10;
                //纸箱
                tableData.purchaseBox = 3.5;
                //利润
                tableData.profit = tableData.pay - tableData.purchasePrice - tableData.purchaseExpress - tableData.purchaseBox;
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
            let tempList = {}
            window.tableList.map((item, ids) => {
                if (tempList[item.order_num]) {
                    tempList[item.order_num].groupPurchasePrice += item.purchasePrice;
                    tempList[item.order_num].group = true;
                    tempList[item.order_num].ids.push(ids)
                } else {
                    tempList[item.order_num]={};
                    tempList[item.order_num].groupPurchasePrice = item.purchasePrice + item.purchaseExpress + item.purchaseBox
                    tempList[item.order_num].ids = [ids];
                }
            });
            for (var tempItem in tempList) {
                if (tempList[tempItem].group) {
                    tempList[tempItem].ids.map((item,ids) => {
                        let profit = window.tableList[item].pay - tempList[tempItem].groupPurchasePrice;
                        console.log('profit:'+profit);
                        if (ids ===0) {
                            window.tableList[item].profit = profit;
                        }else {
                            window.tableList[item].profit = 0;

                        }
                    })
                }
            }

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
                let reg = /var data = JSON.parse\('.+\);/ig;
                let dataJsString = pagestr.match(reg)
                let dataFun = `
                    ${dataJsString}
                    return data;
                `
                item.detailInfo = new Function(dataFun)();
                // is object a function?
                var d = {
                    "mainOrder": {
                        "operations": [],
                        "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                        "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "615.00"}]}, {
                            "type": "line",
                            "content": [{"type": "text", "value": "(快递:12.00"}]
                        }, {"type": "line", "content": [{"type": "text", "value": ")"}]}],
                        "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                        "extra": {"inHold": false, "isShowSellerService": false},
                        "orderInfo": {
                            "lines": [{"type": "line", "content": []}, {
                                "type": "line",
                                "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "137373891121507686"}]}}, {
                                    "type": "namevalue",
                                    "value": {"name": "支付宝交易号:", "value": "2018031821001001900517144809", "type": "text"}
                                }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-18 12:00:44", "type": "text"}}, {
                                    "type": "namevalue",
                                    "value": {"name": "付款时间:", "value": "2018-03-18 12:06:22", "type": "text"}
                                }]
                            }], "type": "group"
                        },
                        "id": "137373891121507686",
                        "subOrders": [{
                            "priceInfo": "899.00",
                            "quantity": "1",
                            "service": [],
                            "extra": {
                                "overSold": false,
                                "alicommunOrderDirect": false,
                                "needShowQuantity": 0,
                                "xt": false,
                                "needDisplay": false,
                                "payStatus": 0,
                                "opWeiQuan": false,
                                "notSupportReturn": false
                            },
                            "tradeStatus": [{"type": "line", "content": [{"type": "text", "value": "未发货"}]}],
                            "id": 137373891121507680,
                            "itemInfo": {
                                "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "黑色", "type": "text"}}]}, {
                                    "type": "line",
                                    "content": [{
                                        "type": "operation",
                                        "value": {
                                            "data": {"width": 820, "crossOrigin": false, "height": 370},
                                            "action": "a8",
                                            "style": "t16",
                                            "text": "修改订单属性",
                                            "type": "operation",
                                            "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=137373891121507686"
                                        }
                                    }]
                                }],
                                "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=137373891121507686",
                                "pic": "//img.alicdn.com/bao/uploaded/i3/125332605/TB2IUuIcBfM8KJjSZFOXXXr5XXa_!!125332605.jpg_sum.jpg",
                                "title": "红谷皮具专柜正品头层牛皮女士休闲双肩包",
                                "serviceIcons": [{
                                    "linkTitle": "保障卡",
                                    "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=137373891121507686",
                                    "type": 3,
                                    "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                                }],
                                "skuId": 0
                            },
                            "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 284.00 元"}]}]
                        }],
                        "payInfo": {
                            "tmallYfx_bizOrderId": 0,
                            "sellerYfx_bizOrderId": 0,
                            "showPayDetail": false,
                            "cod": false,
                            "sendPromotions": [],
                            "xiaobao315Yfx_bizOrderId": 0,
                            "actualFee": {"name": "实收款", "value": "627.00"},
                            "fullPromotion": {"valid": false}
                        },
                        "buyer": {
                            "nick": "tb183139659",
                            "mail": "***",
                            "city": " ",
                            "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=137373891121507686",
                            "phoneNum": "15911****63",
                            "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=tb183139659",
                            "id": 3847508676,
                            "guestUser": false,
                            "alipayAccount": "1***"
                        }
                    },
                    "orderBar": {
                        "nodes": [{"index": 1, "text": "1. 买家下单"}, {"index": 2, "text": "2. 买家付款"}, {"index": 3, "text": "3. 发货"}, {"index": 4, "text": "4. 买家确认收货"}, {
                            "index": 5,
                            "text": "5. 评价"
                        }], "currentStepIndex": 0, "currentIndex": 3
                    },
                    "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521425822161"}, {
                        "text": "已卖出的宝贝",
                        "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521425822161"
                    }],
                    "operationsGuide": [{
                        "layout": "li",
                        "lines": [{"type": "line", "content": [{"type": "text", "value": "请您尽快发货，如果缺货，可联系买家协商退款。"}]}, {
                            "type": "line",
                            "content": [{"type": "text", "value": "买家已付款，请尽快发货，否则买家有权申请退款。"}]
                        }, {"type": "line", "content": [{"type": "text", "value": "如果无法发货，请及时与买家联系并说明情况。"}]}, {
                            "type": "line",
                            "content": [{"type": "text", "value": "买家申请退款后，须征得买家同意后再操作发货，否则买家有权拒收货物。"}]
                        }, {
                            "type": "line",
                            "content": [{"type": "text", "value": "买家付款后超过365天仍未发货，系统将自动关闭订单并退款给买家"}, {
                                "type": "operation",
                                "value": {
                                    "style": "t0",
                                    "text": "[?]",
                                    "type": "operation",
                                    "url": "//service.taobao.com/support/seller/knowledge-5836796.htm?spm=a215a.7392575.1998073017.20.Wpy2GG&_pvf=sellerSearch"
                                }
                            }, {"type": "text", "value": "。"}]
                        }],
                        "type": "group"
                    }, {
                        "lines": [{"type": "line", "content": []}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "style": "t3",
                                    "text": "发货",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=137373891121507686&bizType=200"
                                }
                            }, {
                                "type": "operation",
                                "value": {
                                    "authUrl": "/trade/security/auth_user_info.htm",
                                    "authParam": "{\"modifyAddress\": 1}",
                                    "data": {"width": 900, "crossOrigin": false, "height": 300},
                                    "durexParam": "{\"redirecturl\": \"//trade.taobao.com/tradeitemlist/mid/durex.htm\"}",
                                    "durexUrl": "//aq.taobao.com/durex/validate",
                                    "action": "a8",
                                    "style": "t4",
                                    "text": "修改收货地址",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=137373891121507686"
                                }
                            }, {
                                "type": "operation",
                                "value": {
                                    "style": "t4",
                                    "text": "标记",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=137373891121507686&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D137373891121507686"
                                }
                            }, {
                                "type": "operation",
                                "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=137373891121507686"}
                            }]
                        }], "type": "group"
                    }],
                    "tabs": [{
                        "id": "order",
                        "title": "订单信息",
                        "content": {
                            "mainOrder": {
                                "operations": [],
                                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "615.00"}]}, {
                                    "type": "line",
                                    "content": [{"type": "text", "value": "(快递:12.00"}]
                                }, {"type": "line", "content": [{"type": "text", "value": ")"}]}],
                                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                                "extra": {"inHold": false, "isShowSellerService": false},
                                "orderInfo": {
                                    "lines": [{"type": "line", "content": []}, {
                                        "type": "line",
                                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "137373891121507686"}]}}, {
                                            "type": "namevalue",
                                            "value": {"name": "支付宝交易号:", "value": "2018031821001001900517144809", "type": "text"}
                                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-18 12:00:44", "type": "text"}}, {
                                            "type": "namevalue",
                                            "value": {"name": "付款时间:", "value": "2018-03-18 12:06:22", "type": "text"}
                                        }]
                                    }], "type": "group"
                                },
                                "id": "137373891121507686",
                                "subOrders": [{
                                    "priceInfo": "899.00",
                                    "quantity": "1",
                                    "service": [],
                                    "extra": {
                                        "overSold": false,
                                        "alicommunOrderDirect": false,
                                        "needShowQuantity": 0,
                                        "xt": false,
                                        "needDisplay": false,
                                        "payStatus": 0,
                                        "opWeiQuan": false,
                                        "notSupportReturn": false
                                    },
                                    "tradeStatus": [{"type": "line", "content": [{"type": "text", "value": "未发货"}]}],
                                    "id": 137373891121507680,
                                    "itemInfo": {
                                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "黑色", "type": "text"}}]}, {
                                            "type": "line",
                                            "content": [{
                                                "type": "operation",
                                                "value": {
                                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                                    "action": "a8",
                                                    "style": "t16",
                                                    "text": "修改订单属性",
                                                    "type": "operation",
                                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=137373891121507686"
                                                }
                                            }]
                                        }],
                                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=137373891121507686",
                                        "pic": "//img.alicdn.com/bao/uploaded/i3/125332605/TB2IUuIcBfM8KJjSZFOXXXr5XXa_!!125332605.jpg_sum.jpg",
                                        "title": "红谷皮具专柜正品头层牛皮女士休闲双肩包",
                                        "serviceIcons": [{
                                            "linkTitle": "保障卡",
                                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=137373891121507686",
                                            "type": 3,
                                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                                        }],
                                        "skuId": 0
                                    },
                                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 284.00 元"}]}]
                                }],
                                "payInfo": {
                                    "tmallYfx_bizOrderId": 0,
                                    "sellerYfx_bizOrderId": 0,
                                    "showPayDetail": false,
                                    "cod": false,
                                    "sendPromotions": [],
                                    "xiaobao315Yfx_bizOrderId": 0,
                                    "actualFee": {"name": "实收款", "value": "627.00"},
                                    "fullPromotion": {"valid": false}
                                },
                                "buyer": {
                                    "nick": "tb183139659",
                                    "mail": "***",
                                    "city": " ",
                                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=137373891121507686",
                                    "phoneNum": "15911****63",
                                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=tb183139659",
                                    "id": 3847508676,
                                    "guestUser": false,
                                    "alipayAccount": "1***"
                                }
                            }, "ccc": false, "deliveryInfo": {}
                        }
                    }, {
                        "id": "logistics",
                        "title": "收货和物流信息",
                        "content": {"alingPhone": "15911206263", "nick": "flftfqwxf", "address": "李水松，15911206263，云南省 大理白族自治州 鹤庆县 黄坪镇 街上印象酒店 ，000000", "shipType": "快递"}
                    }],
                    "detailExtra": {
                        "op": false,
                        "b2c": false,
                        "ccc": false,
                        "tradeEnd": false,
                        "outShopOrder": false,
                        "wakeupOrder": false,
                        "refundByTb": false,
                        "success": false,
                        "inRefund": false,
                        "viewed_flag": false
                    }
                }
                // item.wangwang = item.detailInfo.mainOrder.buyer.nick;
                // let orderInfo=item.detailInfo.mainOrder.orderInfo[1].content;
                // orderInfo[0]
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
    //每次将索引设为0
    ORDER_INDEX = 0;
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

