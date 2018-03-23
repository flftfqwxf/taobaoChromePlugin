var Excel = require('exceljs');
var request = require("request");
var i2b = function(url, callback) {
    "use strict";
    var options = {
        uri: url,
        encoding: "binary"
    };
    return request(options, function(e, resp, body) {
        if (e) {
            return callback(e);
        }
        if (resp.statusCode !== 200) {
            var error = new Error('response was non 200');
            error.response = body;
            return callback(error);
        }
        var prefix = "data:" + resp.headers["content-type"] + ";base64,";
        var img = new Buffer(body.toString(), "binary").toString("base64");
        return callback({
            mimeType: resp.headers["content-type"],
            base64: img,
            dataUri: prefix + img
        });
    });
};

let createExcel = async function(ctx, next) {
    var workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);
    var sheet = workbook.addWorksheet('My Sheet', {properties: {tabColor: {argb: 'FFC0000'}}});
    sheet.columns = [
        {"key": "order_index", header: 'ID'},
        {"key": "order_num", header: '订单号'},
        {"key": "order_time", header: '订单日期'},
        {"key": "img", header: '图片', width: 50, height: 50},
        {"key": "href", header: '产品地址'},
        {"key": "pro_name", header: '产品名称'},
        {"key": "color", header: '颜色分类'},
        {"key": "num", header: '购买数量'},
        {"key": "wangwang", header: '旺旺'},
        {"key": "status", header: '状态'},
        {"key": "price", header: '原价'},
        {"key": "pay", header: '实付'},
        {"key": "express", header: '快递'},
        {"key": "purchasePrice", header: '进价'},
        {"key": "purchaseExpress", header: '进价快递费'},
        {"key": "purchaseBox", header: '纸箱费'},
        {"key": "profit", header: '利润'},
    ];
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
        },
        {
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
        }
    ]
    sheet.addRows(data);
    let list = []
    sheet.getColumn('img').width = 50;
    sheet.getColumn('img').eachCell(function(cell, rowNumber) {
        if (rowNumber > 1) {
            cell.value = '';
            cell.width = 50;
            cell.height = 50;
        }
    });
    let getImg = function(img) {
        return new Promise((resolve, reject) => {
            i2b(img, (data) => {
                if (data && data.response) {
                    reject(data)
                }
                resolve(data)
            })
        })
    }
    data.map((item, ids) => {
        list.push(getImg(item.img));
    })

    return await Promise.all(list).then((data) => {
        data.map((item, ids) => {
            var imageId = workbook.addImage({
                base64: 'data:' + item.mimeType + ';base64,' + item.base64,
                extension: 'png',
            });
            sheet.addImage(imageId, `D${ids + 2}:D${ids + 2}`);
        })
        // let dir = __dirname + '/aa.xlsx';
        // console.log(dir)
        ctx.response.attachment("report.xlsx")
        ctx.status = 200;
        return workbook.xlsx.write(ctx.res).then(() => {
            ctx.res.end();
        })
    }).catch((err) => {
        console.log(err)
    })
}
module.exports = async function(ctx, next) {
    await createExcel(ctx, next);
}

