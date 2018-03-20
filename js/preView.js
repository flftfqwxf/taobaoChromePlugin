let content = ''
let columns = [
    {"data": "order_index", "name": "order_index", title: 'ID'},
    {"data": "order_num", "name": "order_num", title: '订单号'},
    {"data": "order_time", "name": "order_time", title: '订单日期'},
    {"data": "img", "name": "img", title: '图片'},
    // {"data": "href","name": "href", title: '产品地址'},
    {"data": "pro_name", "name": "pro_name", title: '产品名称'},
    {"data": "color", "name": "color", title: '颜色分类'},
    {"data": "num", "name": "num", title: '购买数量'},
    {"data": "wangwang", "name": "wangwang", title: '旺旺'},
    {"data": "status", "name": "status", title: '状态'},
    {"data": "price", "name": "price", title: '原价'},
    {"data": "pay", "name": "pay", title: '实付'},
    {"data": "express", "name": "express", title: '快递'},
    {"data": "purchasePrice", "name": "purchasePrice", title: '进价'},
    {"data": "purchaseExpress", "name": "purchaseExpress", title: '进价快递费'},
    {"data": "purchaseBox", "name": "purchaseBox", title: '纸箱费'},
    {"data": "profit", "name": "profit", title: '利润'},
]

function getCellVals(tdIndexs) {
    let returnVal = {}, val;
    // alert($('#example >tbody >tr').length)
    $('#example >tbody >tr').each((ids, item) => {
        if ($.isArray(tdIndexs)) {
            tdIndexs.map(tdItem => {
                if (!returnVal[tdItem.key]) {
                    returnVal[tdItem.key] = 0;
                }
                let td = $(item).find('td').eq(tdItem.ids);
                if (td.is(":visible")) {
                    returnVal[tdItem.key] += parseFloat($(item).find('td').eq(tdItem.ids).html())
                }
            })
        }
    })
    return returnVal;
}

console.log('init preview');
let table;
let totalData;

function setTotal() {
    setTimeout(() => {
        let total = getCellVals([
            {ids: 9, key: 'totalPrice'},
            {ids: 10, key: 'totalPay'},
            {ids: 12, key: 'totalPurchasePrice'},
            {ids: 13, key: 'totalPurchaseExpress'},
            {ids: 14, key: 'totalPurchaseBox'},
            {ids: 15, key: 'totalProfit'},
        ]);
        totalData = total;
        let html = ` 
                    <td colspan="9" style="text-align:right">合计：</td>
                    <td>${total.totalPrice}</td>
                    <td>${total.totalPay}</td>
                    <td colspan="2">${total.totalPurchasePrice}</td>
                    <td>${total.totalPurchaseExpress}</td>
                    <td>${total.totalPurchaseBox}</td>
                    <td>${total.totalProfit}</td>`;
        if ($('#total_tr').length === 0) {
            $('#example >tbody').append(`
                            <tr id="total_tr">
                               ${html}
                            </tr>
                `)
        } else {
            $('#total_tr').html(html)
        }
    }, 300)
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
// if (request.cmd == 'test') alert(request.value);
//     try {
//         table.destroy();
//         // $('#example').html('')
//     } catch (e) {
//     }
setTimeout(() => {
    // let data = request.content
    let data = [
        {
        "order_index": 1,
        "order_num": "126520551738297745",
        "order_time": "2018-03-19 20:12:18",
        "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB2PvOScvjM8KJjSZFsXXXdZpXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=126520551738297745&snapShot=true",
        "pro_name": "红谷皮具专柜正品2017新款女士手拎单肩包51441228",
        "color": "粉红色",
        "price": "669.00",
        "num": "1",
        "wangwang": "zhouxiaolian520",
        "status": "买家已付款",
        "pay": "470.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=126520551738297745",
        "purchasePrice": 334.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 122,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "458.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "126520551738297745"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031921001001120540196086"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-19 20:12:18"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-19 20:12:25"}
                        }]
                    }], "type": "group"
                },
                "id": "126520551738297745",
                "subOrders": [{
                    "priceInfo": "669.00",
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
                    "id": 126520551738297740,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "粉红色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=126520551738297745"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=126520551738297745",
                        "pic": "//img.alicdn.com/bao/uploaded/i4/125332605/TB2PvOScvjM8KJjSZFsXXXdZpXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品2017新款女士手拎单肩包51441228",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=126520551738297745",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 211.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "470.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "zhouxiaolian520",
                    "mail": "3***",
                    "city": " ",
                    "name": "周操",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=126520551738297745",
                    "phoneNum": "13798****80",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=zhouxiaolian520",
                    "id": 883294577,
                    "guestUser": false,
                    "alipayAccount": "3***"
                }
            },
            "orderBar": {
                "nodes": [{"index": 1, "text": "1. 买家下单"}, {"index": 2, "text": "2. 买家付款"}, {"index": 3, "text": "3. 发货"}, {"index": 4, "text": "4. 买家确认收货"}, {
                    "index": 5,
                    "text": "5. 评价"
                }], "currentStepIndex": 0, "currentIndex": 3
            },
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515411978"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515411978"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=126520551738297745&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=126520551738297745"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=126520551738297745&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D126520551738297745"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=126520551738297745"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "18684705673", "nick": "flftfqwxf", "address": "周操，86-18684705673，湖南省 长沙市 岳麓区 梅溪湖街道 中建梅溪湖中心6栋704房 ，000000", "shipType": "快递"}
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
    }, {
        "order_index": 2,
        "order_num": "137876208498676995",
        "order_time": "2018-03-19 12:45:19",
        "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB29sCyg46I8KJjSszfXXaZVXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=137876208498676995&snapShot=true",
        "pro_name": "红谷皮具专柜正品女士牛皮家用钥匙包",
        "color": "红色",
        "price": "189.00",
        "num": "1",
        "wangwang": "yutao905qian",
        "status": "买家已付款",
        "pay": "163.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=137876208498676995",
        "purchasePrice": 94.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 55,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "151.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "137876208498676995"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031921001001620554157911"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-19 12:45:19"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-19 12:45:25"}
                        }]
                    }], "type": "group"
                },
                "id": "137876208498676995",
                "subOrders": [{
                    "priceInfo": "189.00",
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
                    "id": 137876208498677000,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "红色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=137876208498676995"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=137876208498676995",
                        "pic": "//img.alicdn.com/bao/uploaded/i4/125332605/TB29sCyg46I8KJjSszfXXaZVXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品女士牛皮家用钥匙包",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=137876208498676995",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 38.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "163.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "yutao905qian",
                    "mail": "***",
                    "city": " ",
                    "name": "赵晓琴",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=137876208498676995",
                    "phoneNum": "15135****52",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=yutao905qian",
                    "id": 2523679569,
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
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515412092"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515412092"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=137876208498676995&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=137876208498676995"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=137876208498676995&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D137876208498676995"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=137876208498676995"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "15135493852", "nick": "flftfqwxf", "address": "赵晓琴，15135493852，山西省 吕梁市 中阳县 宁乡镇 中阳县委大院史志办东一号楼 214室 ，033400", "shipType": "快递"}
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
    }, {
        "order_index": 3,
        "order_num": "137373891121507686",
        "order_time": "2018-03-18 12:00:44",
        "img": "https://img.alicdn.com/bao/uploaded/i3/125332605/TB2IUuIcBfM8KJjSZFOXXXr5XXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=137373891121507686&snapShot=true",
        "pro_name": "红谷皮具专柜正品头层牛皮女士休闲双肩包",
        "color": "黑色",
        "price": "899.00",
        "num": "1",
        "wangwang": "tb183139659",
        "status": "买家已付款",
        "pay": "627.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=137373891121507686",
        "purchasePrice": 449.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 164,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "615.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "137373891121507686"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031821001001900517144809"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-18 12:00:44"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-18 12:06:22"}
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
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "黑色"}}]}, {
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
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515412092"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515412092"
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
    }, {
        "order_index": 4,
        "order_num": "125918156874274540",
        "order_time": "2018-03-18 11:18:23",
        "img": "https://img.alicdn.com/bao/uploaded/i2/125332605/TB2ewWQcpHM8KJjSZFwXXcibXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=125918156874274540&snapShot=true",
        "pro_name": "红谷皮具专柜正品女士单肩小跨包 51243057.51242058.51245059",
        "color": "黑色",
        "price": "639.00",
        "num": "1",
        "wangwang": "wuliaodeyouxi513",
        "status": "买家已付款",
        "pay": "449.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=125918156874274540",
        "purchasePrice": 319.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 116,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "437.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "125918156874274540"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031821001001720550028556"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-18 11:18:23"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-18 11:19:30"}
                        }]
                    }], "type": "group"
                },
                "id": "125918156874274540",
                "subOrders": [{
                    "priceInfo": "639.00",
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
                    "id": 125918156874274540,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "黑色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=125918156874274540"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=125918156874274540",
                        "pic": "//img.alicdn.com/bao/uploaded/i2/125332605/TB2ewWQcpHM8KJjSZFwXXcibXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品女士单肩小跨包 51243057.51242058.51245059",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=125918156874274540",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 202.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "449.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "wuliaodeyouxi513",
                    "mail": "***",
                    "city": " ",
                    "name": "刘辉",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=125918156874274540",
                    "phoneNum": "13725****80",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=wuliaodeyouxi513",
                    "id": 3062274045,
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
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515411976"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515411976"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=125918156874274540&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=125918156874274540"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=125918156874274540&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D125918156874274540"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=125918156874274540"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "13725822580", "nick": "flftfqwxf", "address": "刘彤，13725822580，广东省 东莞市 樟木头镇 樟木头泰安路38号 ，523000", "shipType": "快递"}
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
    }, {
        "order_index": 5,
        "order_num": "125521732999083332",
        "order_time": "2018-03-16 21:01:23",
        "img": "https://img.alicdn.com/bao/uploaded/i2/125332605/TB2MD_6mJfJ8KJjy0FeXXXKEXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=125521732999083332&snapShot=true",
        "pro_name": "红谷皮具专柜正品女士手拎单肩包考拉系列H51442852",
        "color": "粉红色",
        "price": "1099.00",
        "num": "1",
        "wangwang": "月芽溪1983",
        "status": "买家已付款",
        "pay": "764.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=125521732999083332",
        "purchasePrice": 549.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 201,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "752.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "125521732999083332"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031621001001690546141024"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-16 21:01:23"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-16 21:01:37"}
                        }]
                    }], "type": "group"
                },
                "id": "125521732999083332",
                "subOrders": [{
                    "priceInfo": "1099.00",
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
                    "id": 125521732999083330,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "粉红色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=125521732999083332"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=125521732999083332",
                        "pic": "//img.alicdn.com/bao/uploaded/i2/125332605/TB2MD_6mJfJ8KJjy0FeXXXKEXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品女士手拎单肩包考拉系列H51442852",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=125521732999083332",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "新年促销:省 347.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "764.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "月芽溪1983",
                    "mail": "2***",
                    "city": "湖北 武汉",
                    "name": "徐丹",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=125521732999083332",
                    "phoneNum": "18986****57",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=%D4%C2%D1%BF%CF%AA1983",
                    "id": 829083233,
                    "guestUser": false,
                    "alipayAccount": "1***"
                }
            },
            "buyMessage": "大号！粉色女包！",
            "orderBar": {
                "nodes": [{"index": 1, "text": "1. 买家下单"}, {"index": 2, "text": "2. 买家付款"}, {"index": 3, "text": "3. 发货"}, {"index": 4, "text": "4. 买家确认收货"}, {
                    "index": 5,
                    "text": "5. 评价"
                }], "currentStepIndex": 0, "currentIndex": 3
            },
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515411981"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515411981"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=125521732999083332&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=125521732999083332"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=125521732999083332&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D125521732999083332"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=125521732999083332"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "18986135557", "nick": "flftfqwxf", "address": "徐丹，18986135557，湖北省 武汉市 江夏区 纸坊街道 大花岭小区东10栋 ，430200", "shipType": "快递"}
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
    }, {
        "order_index": 6,
        "order_num": "125626259833680141",
        "order_time": "2018-03-16 18:07:17",
        "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB2v7aOg8TH8KJjy0FiXXcRsXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=125626259833680141&snapShot=true",
        "pro_name": "红谷专柜正品钱包女士手拿包化妆包迷你女包H31103196",
        "color": "粉红色",
        "price": "399.00",
        "num": "1",
        "wangwang": "zjycooler520",
        "status": "买家已付款",
        "pay": "273.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=125626259833680141",
        "purchasePrice": 199.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 60,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "261.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "125626259833680141"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031621001001870511971264"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-16 18:07:17"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-16 18:12:10"}
                        }]
                    }], "type": "group"
                },
                "id": "125626259833680141",
                "subOrders": [{
                    "priceInfo": "399.00",
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
                    "id": 125626259833680140,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "粉红色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=125626259833680141"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=125626259833680141",
                        "pic": "//img.alicdn.com/bao/uploaded/i4/125332605/TB2v7aOg8TH8KJjy0FiXXcRsXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷专柜正品钱包女士手拿包化妆包迷你女包H31103196",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=125626259833680141",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "卖家优惠 12.00 元"}]}, {"type": "line", "content": [{"type": "text", "value": "优惠促销:省 126.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "273.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "zjycooler520",
                    "mail": "z***",
                    "city": "云南 昆明",
                    "name": "郑济沅",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=125626259833680141",
                    "phoneNum": "13708****30",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=zjycooler520",
                    "id": 106684101,
                    "guestUser": false,
                    "alipayAccount": "z***"
                }
            },
            "orderBar": {
                "nodes": [{"index": 1, "text": "1. 买家下单"}, {"index": 2, "text": "2. 买家付款"}, {"index": 3, "text": "3. 发货"}, {"index": 4, "text": "4. 买家确认收货"}, {
                    "index": 5,
                    "text": "5. 评价"
                }], "currentStepIndex": 0, "currentIndex": 3
            },
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515411984"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515411984"
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
                "layout": "div",
                "lines": [{
                    "display": "alert",
                    "type": "line",
                    "content": [{"type": "text", "value": "标记信息仅自己可见。若不是本人填写，请小心被骗。"}, {
                        "type": "operation",
                        "value": {"style": "t16", "text": "防骗提醒", "type": "operation", "url": "http://bbs.taobao.com/catalog/thread/154504-256277274.htm"}
                    }]
                }, {"display": "block", "type": "line", "content": [{"type": "text", "value": "标记："}, {"type": "text", "value": "发顺丰 到付"}]}],
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=125626259833680141&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=125626259833680141"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=125626259833680141&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D125626259833680141"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=125626259833680141"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "15331673015", "nick": "flftfqwxf", "address": "郑济沅，15331673015，云南省 大理白族自治州 洱源县 茈碧湖镇 建设小区宁杰路5号 ，671200", "shipType": "快递"}
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
    }, {
        "order_index": 7,
        "order_num": "138181622865643305",
        "order_time": "2018-03-16 16:48:01",
        "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB29zW7g6nD8KJjSspbXXbbEXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=138181622865643305&snapShot=true",
        "pro_name": "红谷皮具专柜正品女士双肩包H51941581.H51941580.H51942582",
        "color": "杏色",
        "price": "799.00",
        "num": "1",
        "wangwang": "itore",
        "status": "买家已付款",
        "pay": "559.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=138181622865643305",
        "purchasePrice": 399.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 146,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "547.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "138181622865643305"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031621001001800519548667"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-16 16:48:01"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-16 17:27:51"}
                        }]
                    }], "type": "group"
                },
                "id": "138181622865643305",
                "subOrders": [{
                    "priceInfo": "799.00",
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
                    "id": 138181622865643310,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "杏色"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=138181622865643305"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=138181622865643305",
                        "pic": "//img.alicdn.com/bao/uploaded/i4/125332605/TB29zW7g6nD8KJjSspbXXbbEXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品女士双肩包H51941581.H51941580.H51942582",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=138181622865643305",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 252.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "559.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "itore",
                    "mail": "s***",
                    "city": "山东 日照",
                    "name": "赵越",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=138181622865643305",
                    "phoneNum": "18663****72",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=itore",
                    "id": 36640533,
                    "guestUser": false,
                    "alipayAccount": "s***"
                }
            },
            "orderBar": {
                "nodes": [{"index": 1, "text": "1. 买家下单"}, {"index": 2, "text": "2. 买家付款"}, {"index": 3, "text": "3. 发货"}, {"index": 4, "text": "4. 买家确认收货"}, {
                    "index": 5,
                    "text": "5. 评价"
                }], "currentStepIndex": 0, "currentIndex": 3
            },
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515412105"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515412105"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=138181622865643305&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=138181622865643305"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=138181622865643305&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D138181622865643305"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=138181622865643305"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "18663387772", "nick": "flftfqwxf", "address": "赵越，18663387772，山东省 日照市 东港区 秦楼街道 威海路80号城建花园34号楼 ，276800", "shipType": "快递"}
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
    }, {
        "order_index": 8,
        "order_num": "135827619426499188",
        "order_time": "2018-03-14 18:06:00",
        "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB2E.e9g4PI8KJjSspfXXcCFXXa_!!125332605.jpg_sum.jpg",
        "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=135827619426499188&snapShot=true",
        "pro_name": "红谷皮具专柜正品头层牛皮女士双肩包H51939794.H51939793",
        "color": "深红",
        "price": "939.00",
        "num": "1",
        "wangwang": "xngfcs",
        "status": "买家已付款",
        "pay": "655.00",
        "express": "(含快递:￥12.00)",
        "detailUrl": "https://trade.taobao.com/trade/detail/trade_item_detail.htm?bizOrderId=135827619426499188",
        "purchasePrice": 469.5,
        "purchaseExpress": 10,
        "purchaseBox": 3.5,
        "profit": 172,
        "detailInfo": {
            "mainOrder": {
                "operations": [],
                "statusInfo": {"text": "当前订单状态：买家已付款，等待商家发货", "type": "t0"},
                "totalPrice": [{"type": "line", "content": [{"type": "text", "value": "643.00"}]}, {"type": "line", "content": [{"type": "text", "value": "(快递:12.00"}]}, {
                    "type": "line",
                    "content": [{"type": "text", "value": ")"}]
                }],
                "columns": ["宝贝", "宝贝属性", "状态", "服务", "单价", "数量", "优惠", "商品总价"],
                "extra": {"inHold": false, "isShowSellerService": false},
                "orderInfo": {
                    "lines": [{"type": "line", "content": []}, {
                        "type": "line",
                        "content": [{"type": "namevalue", "value": {"name": "订单编号:", "value": [{"type": "text", "value": "135827619426499188"}]}}, {
                            "type": "namevalue",
                            "value": {"name": "支付宝交易号:", "value": "2018031421001001570542614811"}
                        }, {"type": "namevalue", "value": {"name": "创建时间:", "value": "2018-03-14 18:06:00"}}, {
                            "type": "namevalue",
                            "value": {"name": "付款时间:", "value": "2018-03-14 18:06:50"}
                        }]
                    }], "type": "group"
                },
                "id": "135827619426499188",
                "subOrders": [{
                    "priceInfo": "939.00",
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
                    "id": 135827619426499180,
                    "itemInfo": {
                        "skuText": [{"type": "line", "content": [{"type": "namevalue", "value": {"name": "颜色分类：", "value": "深红"}}]}, {
                            "type": "line",
                            "content": [{
                                "type": "operation",
                                "value": {
                                    "data": {"width": 820, "crossOrigin": false, "height": 370},
                                    "action": "a8",
                                    "style": "t16",
                                    "text": "修改订单属性",
                                    "type": "operation",
                                    "url": "//trade.taobao.com/trade/modify_sku.htm?bizOrderId=135827619426499188"
                                }
                            }]
                        }],
                        "auctionUrl": "//trade.taobao.com/trade/detail/tradeSnap.htm?trade_id=135827619426499188",
                        "pic": "//img.alicdn.com/bao/uploaded/i4/125332605/TB2E.e9g4PI8KJjSspfXXcCFXXa_!!125332605.jpg_sum.jpg",
                        "title": "红谷皮具专柜正品头层牛皮女士双肩包H51939794.H51939793",
                        "serviceIcons": [{
                            "linkTitle": "保障卡",
                            "linkUrl": "http://trade.taobao.com/trade/security/security_card.htm?bizOrderId=135827619426499188",
                            "type": 3,
                            "url": "//img.alicdn.com/tps/i2/T1S4ysXh8pXXXXXXXX-52-16.png"
                        }],
                        "skuId": 0
                    },
                    "promotionInfo": [{"type": "line", "content": [{"type": "text", "value": "优惠促销:省 296.00 元"}]}]
                }],
                "payInfo": {
                    "tmallYfx_bizOrderId": 0,
                    "sellerYfx_bizOrderId": 0,
                    "showPayDetail": false,
                    "cod": false,
                    "sendPromotions": [],
                    "xiaobao315Yfx_bizOrderId": 0,
                    "actualFee": {"name": "实收款", "value": "655.00"},
                    "fullPromotion": {"valid": false}
                },
                "buyer": {
                    "nick": "xngfcs",
                    "mail": "1***",
                    "city": " ",
                    "name": "谢冰峰",
                    "payToBuyerUrl": "//trade.taobao.com/trade/payToUser.htm?user_type=buyer&biz_order_id=135827619426499188",
                    "phoneNum": "15500****08",
                    "privateMsgUrl": "//member1.taobao.com/message/addPrivateMsg.htm?recipient_nickname=xngfcs",
                    "id": 1874498891,
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
            "crumbs": [{"text": "首页", "url": "//www.taobao.com"}, {"text": "我的淘宝", "url": "//i.taobao.com/myTaobao.htm?nekot=1521515412084"}, {
                "text": "已卖出的宝贝",
                "url": "//trade.taobao.com/trade/itemlist/listSoldItems.htm?nekot=1521515412084"
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
                            "url": "//trade.taobao.com/trade/logistics_status.htm?logisType=1&bizOrderId=135827619426499188&bizType=200"
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
                            "url": "//trade.taobao.com/trade/modifyDeliverAddress.htm?bizOrderId=135827619426499188"
                        }
                    }, {
                        "type": "operation",
                        "value": {
                            "style": "t4",
                            "text": "标记",
                            "type": "operation",
                            "url": "//trade.taobao.com/trade/memo/updateSellMemo.htm?bizOrderId=135827619426499188&sellerId=125332605&returnUrl=%2F%2Ftrade.taobao.com%2Ftrade%2Fdetail%2FtradeItemDetail.htm%3Fbiz_order_id%3D135827619426499188"
                        }
                    }, {
                        "type": "operation",
                        "value": {"style": "t4", "text": "订单优惠详情", "type": "operation", "url": "http://smf.taobao.com/index.htm?menu=yhjk&module=yhjk&orderNo=135827619426499188"}
                    }]
                }], "type": "group"
            }],
            "tabs": [{
                "id": "logistics",
                "title": "收货和物流信息",
                "content": {"alingPhone": "15500600108", "nick": "flftfqwxf", "address": "谢冰峰，15500600108，青海省 西宁市 城东区 乐家湾镇 开发区隆豪万利园小区国峰车饰 ，810000", "shipType": "快递"}
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
    }]
    console.log(JSON.stringify(data));
    if (table) {
        table.clear().rows.add(data).draw();
        setTotal();
    } else {
        table = $('#example').DataTable({
            columns: columns,
            "iDisplayLength": 100,
            "columnDefs": [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function(data, type, row) {
                        return `<img src="${data}" width="50" />`;
                    },
                    "targets": 3
                },
                // {"visible": false, "targets": [4]}
            ],
            data: data,
            rowsGroup:
                [// Always the array (!) of the column-selectors in specified order to which rows groupping is applied
                    // (column-selector could be any of specified in https://datatables.net/reference/type/column-selector)
                    'order_index:name',
                    'order_num:name',
                    'order_time:name',
                    'wangwang:name',
                    'express:name',
                    'pay:name',
                    'purchaseExpress:name',
                    'purchaseBox:name',
                    'status:name',
                    'profit:name',
                    // 0, 1, 2, 7,8, 10, 11, 12,13
                ],
            dom: 'Bfrtip',
            buttons: [{
                extend: 'excelHtml5',
                createEmptyCells: true,
                customize: function(xlsx, a, b, v) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    let ids = 0;
                    columns.map((item, ids) => {
                        excelCellIndex[item.data] = String.fromCharCode(97 + ids).toLocaleUpperCase()
                    })
                    // table.columns()
                    // String.fromCharCode(97 + n)
                    // Loop over the cells in column `C`
                    let group = {}
                    let mergeCellData = {}
                    let mergeCellCount = 1;
                    let rows = $('row', sheet);
                    rows.each(function(ids, item) {
                        // Get the value
                        let row = (this)
                        let order_item = $(this).find('c[r^="A"]')
                        let order_num = $('c v', order_item).text()
                        console.log(order_num)
                        if (!order_num) return;
                        group[order_num] ? group[order_num].count++ : group[order_num] = {start: ids + 1, count: 1}
                        // if ( $('c v', order_num).text() == '118964301737554535' &&  ids ===3) {
                        //     order_num.remove();
                        //     // $(this).attr( 's', '20' );
                        // }
                    });
                    for (var item in group) {
                        if (group[item].count > 1) {
                            mergeCellData[item] = group[item]
                            mergeCellCount++;
                        }
                    }
                    $('mergeCells', sheet).attr('count', mergeCellCount)
                    for (var mergeCell in mergeCellData) {
                        setMergeCells(sheet, mergeCellData, mergeCell, ['order_num', 'order_time', 'wangwang', 'status', 'pay', 'express'])
                    }
                    let totalIndex = rows.length + 1;

                    $('sheetData', sheet).append(`<row r="${totalIndex}">
                        <c r="A${totalIndex}" s="65"><v>-</v></c>
                        <c r="B${totalIndex}" s="65"><v>-</v></c>
                        <c t="inlineStr" r="C${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="D${totalIndex}"><is><t></t></is></c>
                        <c t="inlineStr" r="E${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="F${totalIndex}"><is><t>-</t></is></c>
                        <c r="G${totalIndex}" s="65"><v>-</v></c>
                        <c t="inlineStr" r="H${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="I${totalIndex}"><is><t>-</t></is></c>
                        <c r="J${totalIndex}" s="22"><v>${totalData.totalPrice}</v></c>
                        <c r="K${totalIndex}" s="22"><v>${totalData.totalPay}</v></c>
                        <c t="inlineStr" r="L${totalIndex}"><is><t>-</t></is></c>
                        <c t="n" r="M${totalIndex}"><v>${totalData.totalPurchasePrice}</v></c>
                        <c r="N${totalIndex}" s="22"><v>${totalData.totalPurchaseExpress}</v></c>
                        <c t="n" r="O${totalIndex}"><v>${totalData.totalPurchaseBox}</v></c>
                        <c r="P{totalIndex}" s="22"><v>${totalData.totalProfit}</v></c>
                    </row>`);
                    totalIndex++;
                    $('sheetData', sheet).append(`<row r="${totalIndex}">
                        <c r="A${totalIndex}" s="65"><t>-</t></c>
                        <c r="B${totalIndex}" s="65"><v>-</v></c>
                        <c t="inlineStr" r="C${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="D${totalIndex}"><is><t></t></is></c>
                        <c t="inlineStr" r="E${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="F${totalIndex}"><is><t>-</t></is></c>
                        <c r="G${totalIndex}" s="65"><v>-</v></c>
                        <c t="inlineStr" r="H${totalIndex}"><is><t>-</t></is></c>
                        <c t="inlineStr" r="I${totalIndex}"><is><t>-</t></is></c>
                        <c r="J${totalIndex}" s="22"><v>${totalData.totalPrice}</v></c>
                        <c r="K${totalIndex}" s="22"><v>${totalData.totalPay}</v></c>
                        <c t="inlineStr" r="L${totalIndex}"><is><t>-</t></is></c>
                        <c t="n" r="M${totalIndex}"><v>${totalData.totalPurchasePrice}</v></c>
                        <c r="N${totalIndex}" s="22"><v>${totalData.totalPurchaseExpress}</v></c>
                        <c t="n" r="O${totalIndex}"><v>${totalData.totalPurchaseBox}</v></c>
                        <c r="P{totalIndex}" s="22"><v>${totalData.totalProfit}</v></c>
                    </row>`);
                    // $('worksheet', sheet)[0].createElement('Relationships')
                    // $('worksheet', sheet).append( `<Relationships>
                    //       <Relationship Id="rID4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.jpg/">
                    //  </Relationships>`)
                    console.log(sheet)
                    return false;
                }
            }],
        });
        setTotal()
    }
    // table.order([[0, 'desc']]).draw();
}, 300)
// });
let excelCellIndex = {}

function setMergeCells(sheet, mergeCellData, mergeCell, cell_name) {
    if ($.isArray(cell_name)) {
        cell_name.forEach((item) => {
            $('mergeCells', sheet).append(`<mergeCell ref="${excelCellIndex[item] + mergeCellData[mergeCell].start}:${excelCellIndex[item] + (mergeCellData[mergeCell].start + mergeCellData[mergeCell].count - 1)}"></mergeCell>`)
        })
    } else {
        $('mergeCells', sheet).append(`<mergeCell ref="${excelCellIndex[cell_name] + mergeCellData[mergeCell].start}:${excelCellIndex[cell_name] + (mergeCellData[mergeCell].start + mergeCellData[mergeCell].count - 1)}"></mergeCell>`)
    }
}

function mapToJson(map) {
    return JSON.stringify([...map]);
}

function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

function exportToExcel(tableStr, name) {


    // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
    var html = "<html><head><meta charset='utf-8' /></head><body>" + tableStr + "</body></html>";
    // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
    var blob = new Blob([html], {type: "application/vnd.ms-excel"});
    // var a = document.getElementsByTagName("a")[0];
    var a = document.createElement("a");
    // link.download = name;
    // link.href = uri + base64(format(template, ctx));
    // link.click();
    // 利用URL.createObjectURL()方法为a元素生成blob URL
    a.href = URL.createObjectURL(blob);
    // 设置文件名，目前只有Chrome和FireFox支持此属性
    a.download = name + ".xls";
    a.click();
}

$('#downExcel').click(() => {
    exportToExcel($('#preContent').html(), Date().toString())
})