let content = ''
let columns = [
    {"data": "order_index", "name": "order_index", title: 'ID'},
    {"data": "order_num", "name": "order_num", title: '订单号'},
    {"data": "order_time", "name": "order_time", title: '订单日期'},
    {"data": "img", "name": "img", title: '图片'},
    {"data": "href", "name": "href", title: '产品地址'},
    {"data": "pro_name", "name": "pro_name", title: '产品名称'},
    {"data": "color", "name": "color", title: '颜色分类'},
    {"data": "product_num", "name": "product_num",title: '货号'},
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
// if (request.cmd == 'test') alert(request.value);
//     try {
//         table.destroy();
//         // $('#example').html('')
//     } catch (e) {
//     }
    setTimeout(() => {
        let data = request.content
        $('#downExcel').off().on('click', () => {
            exportToExcel(data)
        })
        console.log(JSON.stringify(data));
        if (table) {
            table.clear().rows.add(data).draw();
            setTotal();
        }
        else {
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
                    {
                        // The `data` parameter refers to the data for the cell (defined by the
                        // `data` option, which defaults to the column being worked with, in
                        // this case `data: 0`.
                        "render": function(data, type, row) {
                            return `<a href="${row.href}" target="_blank"  />${data}</a>`;
                        },
                        "targets": 5
                    },
                    {"visible": false, "targets": [4]}
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
            });
            setTotal()
        }
        // table.order([[0, 'desc']]).draw();
    }, 300)
});
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

function exportToExcel(data) {
    var workbook = new ExcelJS.Workbook();
    workbook.creator = 'Paul Leger';
    workbook.lastModifiedBy = 'Paul Leger';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    var worksheet = workbook.addWorksheet("Publications");
    worksheet.views = [
        {state: 'frozen', xSplit: 0, ySplit: 1}
    ];
    worksheet.autoFilter = {
        from: 'A1',
        to: 'M1'
    };
    worksheet.properties.defaultRowHeight = 50;
    // worksheet.columns = [
    //     {header: 'Index', key: 'Index', width: 15},
    //     {header: 'Title', key: 'title', width: 25, style: {alignment: {wrapText: true}}},
    //     {header: 'Authors', key: 'authors', width: 20, style: {alignment: {wrapText: true}}},
    //     {header: 'Journal/Conference', key: 'jc', width: 25, style: {alignment: {wrapText: true}}},
    //     {header: 'Type', key: 'type', width: 12, style: {alignment: {wrapText: true}}},
    //     {header: 'Year', key: 'year', width: 12, style: {numFmt: "0000"}},
    //     {header: 'Month', key: 'month', width: 12},
    //     {header: 'volume', key: 'volume', width: 12},
    //     {header: 'number', key: 'number', width: 12},
    //     {header: 'Pages', key: 'pages', width: 12},
    //     {header: 'Location', key: 'location', width: 20, style: {alignment: {wrapText: true}}},
    //     {header: 'doi', key: 'doi', width: 22, style: {alignment: {wrapText: true}}},
    //     {header: 'affiliation', key: 'affiliation', width: 20, style: {alignment: {wrapText: true}}}
    // ];
    // var firstRow = worksheet.getRow(1);
    // firstRow.font = {name: 'New Times Roman', family: 4, size: 10, bold: true, color: {argb: '80EF1C1C'}};
    // firstRow.alignment = {vertical: 'middle', horizontal: 'center'};
    // firstRow.height = 20;
    worksheet.columns = [
        {"key": "order_index", header: 'ID'},
        {"key": "order_num", header: '订单号',width:18},
        {"key": "order_time", header: '订单日期',width:20},
        {"key": "img", header: '图片',},
        {"key": "pro_name", header: '产品名称',width:45},
        {"key": "color", header: '颜色分类'},
        {"key": "product_num", header: '货号'},
        {"key": "num", header: '购买数量'},
        {"key": "wangwang", header: '旺旺',width:11},
        {"key": "status", header: '状态',width:11},
        {"key": "price", header: '原价'},
        {"key": "pay", header: '实付'},
        {"key": "express", header: '快递'},
        {"key": "purchasePrice", header: '进价'},
        {"key": "purchaseExpress", header: '进价快递费'},
        {"key": "purchaseBox", header: '纸箱费'},
        {"key": "profit", header: '利润'},
    ];
    worksheet.addRows(data);
    let list = []
    // worksheet.getColumn('R').width = 10;
    // worksheet.getColumn('R').eachCell({ includeEmpty: true },function(cell, rowNumber) {
    //     if (rowNumber > 1) {
    //         cell.width = 20;
    //         cell.height = 20;
    //     }
    // });
    worksheet.eachRow(function(row, rowNumber) {
        if (rowNumber > 1) {
            row.height = 80;
            let imgCell =row.getCell('img');
            imgCell.value = '';
            imgCell.height = 80;
            imgCell.width = 80;
            row.alignment = {vertical: 'middle', horizontal: 'center',wrapText: true}
            // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        }
    });
    worksheet.addRow({
            "order_index": '-',
            "order_num": "-",
            "order_time": "-",
            "img": "-",
            "href": "-",
            "pro_name": "-",
            "color": "-",
            "price": 0,
            "num": 0,
            "wangwang": "-",
            "status": "-",
            "pay": 0,
            "express": 0,
            "detailUrl": "-",
            "purchasePrice": 0,
            "purchaseExpress": 0,
            "purchaseBox": 0,
            "profit": 0,
        },
    )

    setCount(worksheet,['price','num','pay','express','purchasePrice','purchaseExpress','purchaseBox','profit'])

    data.map((item, ids) => {
        list.push(getImg(item.img));
    })
    Promise.all(list).then((data) => {
        data.map((item, ids) => {
            var imageId = workbook.addImage({
                base64: 'data:image/jpeg;base64,' + item,
                extension: 'png',
            });
            worksheet.addImage(imageId, `D${ids + 2}:D${ids + 2}`);
        })
        var buff = workbook.xlsx.writeBuffer().then(function(data) {
            var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            saveAs(blob, "publications.xlsx");
        });
    }).catch((err) => {
        console.log(err)
    })
}
function setCount(worksheet, cellName) {

    cellName.map((item)=>{
        let cell = worksheet.lastRow.getCell(item);
        let colAndRowIndex = cell.$col$row.split('$');
        cell.value = {formula: `SUM(${colAndRowIndex[1]}2:${colAndRowIndex[1] + (colAndRowIndex[2] - 1)})`}
    })

}
const image2base64 = (url, param) => {
    return new Promise(
        (resolve, reject) => {
            let valid = new RegExp("(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?", "gi");
            fetch(
                url,
                param || {}
            ).then(
                (response) => response.arrayBuffer()
                )
                .then(
                    (buffer) => {
                        return window.btoa(
                            [].slice.call(
                                new Uint8Array(buffer)
                            ).map(
                                (bin) => String.fromCharCode(bin)
                            ).join("")
                        );
                    }
                )
                .then(
                    (body) => {
                        resolve(body);
                    }
                ).catch(reject);
        }
    );
};

function getImg(url) {
    return new Promise((resolve, reject) => {
        image2base64(url)
            .then(
                (response) => {
                    resolve(response)
                    console.log(response); //data:image/jpeg;base64,iVBORw0KGgoAAAANSwCAIA...
                }
            )
            .catch(
                (error) => {
                    reject(error)
                    console.log(error); //Exepection error....
                }
            )
    })
}

