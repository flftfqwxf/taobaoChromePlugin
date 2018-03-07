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
    console.log(tableStr)
    tableStr = tableStr.replace(/src\=\"/ig, 'src="https:')
    tableStr = tableStr.replace(/href\=\"/ig, 'href="https:')
    tableStr = tableStr.replace(/___\w{5,5}/ig, '')
    // $('body').append(tableStr);
    return tableStr
}

function getPageCount(preLastNum) {
    let $pages = $('#sold_container ul.pagination >.pagination-item');
    let last = $pages.last(), lastNum = parseInt(last.text());
    if (lastNum > 1) {
        $pages.last().click()
    } else {
        return lastNum
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
    chrome.storage.local.set({'table': tableList}, function() {
        console.log('缓存成功')
    })
    return tableList;
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    $('#content').bind('DOMSubtreeModified', function(e) {
        if (e.target.innerHTML.length > 0) {
            // Content change handler
        }
    });
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    // if (request.cmd == 'test') alert(request.value);
    switch (request.cmd) {
        case 'createExcel':
            sendResponse(htmlToJson(getTable()));
            break;
        case 'getPageCount':
            sendResponse(getPageCount());
            break;

        default:
            break;
    }
});

