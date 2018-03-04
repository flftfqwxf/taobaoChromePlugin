let content = ''
let columns = [
    {"data": "order_num", title: '订单号'},
    {"data": "order_time", title: '订单日期'},
    {"data": "img", title: '图片',},
    {"data": "href", title: '产品地址'},
    {"data": "pro_name", title: '产品名称'},
    {"data": "color", title: '颜色分类'},
    {"data": "price", title: '原价'},
    {"data": "num", title: '购买数量'},
    {"data": "wangwang", title: '旺旺'},
    {"data": "status", title: '状态'},
    {"data": "pay", title: '实付'},
    {"data": "express", title: '快递'}]
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
// if (request.cmd == 'test') alert(request.value);
    setTimeout(() => {
        let data = request.content
        console.log(JSON.stringify(data));
        $('#example').html('')
        var table = $('#example').DataTable({
            destroy: true,
            columns: columns,
            "order": [[0, "desc"]],
            "iDisplayLength": 100,
            "columnDefs": [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function(data, type, row) {
                        return `<img src="${data}" width="50" />`;
                    },
                    "targets": 2
                },
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function(data, type, row) {
                        return `<img src="${data}" width="50" />`;
                    },
                    "targets": 2
                },
                {"visible": false, "targets": [3]}
            ],
            data: data,
            rowsGroup: [// Always the array (!) of the column-selectors in specified order to which rows groupping is applied
                // (column-selector could be any of specified in https://datatables.net/reference/type/column-selector)
                0, 1, 8, 9, 10, 11
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
                    let mergeCellCount = 1
                    $('row', sheet).each(function(ids, item) {
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
                    console.log(sheet)
                }
            }]
        });
    }, 300)
});
// var data = [
//     ['subgroupN', 'Group1', 'sub-subgroupN', 'ElementN', '2Element N'],
//     ['subgroup1', 'Group2', 'sub-subgroup1', 'Element1', '2Element 1'],
//     ['subgroup2', 'Group2', 'sub-subgroup1', 'Element1', '2Element 1'],
//     ['subgroup2', 'Group2', 'sub-subgroup1', 'Element2', '2Element 2'],
//     ['subgroup2', 'Group2', 'sub-subgroup2', 'Element3', '2Element 2'],
//     ['subgroup2', 'Group2', 'sub-subgroup2', 'Element4', '2Element 4'],
//     ['subgroup2', 'Group2', 'sub-subgroup2', 'Element2', '2Element 2'],
//     ['subgroup3', 'Group1', 'sub-subgroup1', 'Element1', '2Element 1'],
//     ['subgroup3', 'Group1', 'sub-subgroup1', 'Element1', '2Element 1'],
//     ['subgroup2', 'Group2', 'sub-subgroup2', 'Element1', '2Element 1'],
//     ['subgroup4', 'Group2', 'sub-subgroup2', 'Element1', '2Element 1'],
//     ['subgroup4', 'Group2', 'sub-subgroup3', 'Element10', '2Element 17'],
//     ['subgroup4', 'Group2', 'sub-subgroup3', 'Element231', '2Element 211'],
// ];
// var data = [
//     {
//     "order_num": "118964301737554535",
//     "order_time": "2018-02-23 22:20:17",
//     "img": "https://img.alicdn.com/bao/uploaded/i2/125332605/TB20I8OeqzB9uJjSZFMXXXq4XXa_!!125332605.jpg_sum.jpg",
//     "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=118964301738554535&snapShot=true",
//     "pro_name": "红谷皮具专柜正品女士家园钥匙包",
//     "color": "深绿色",
//     "price": "169.00",
//     "num": "1",
//     "wangwang": "青岛美眉",
//     "status": "买家已付款",
//     "pay": "261.00",
//     "express": "(含快递:￥17.00)"
// }, {
//     "order_num": "118964301737554535",
//     "order_time": "2018-02-23 22:20:17",
//     "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB29sCyg46I8KJjSszfXXaZVXXa_!!125332605.jpg_sum.jpg",
//     "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=118964301739554535&snapShot=true",
//     "pro_name": "红谷皮具专柜正品女士牛皮家用钥匙包",
//     "color": "红色",
//     "price": "189.00",
//     "num": "1",
//     "wangwang": "青岛美眉",
//     "status": "买家已付款",
//     "pay": "261.00",
//     "express": "(含快递:￥17.00)"
// }, {
//     "order_num": "118964301737554535",
//     "order_time": "2018-02-23 22:20:17",
//     "img": "https://img.alicdn.com/bao/uploaded/i4/125332605/TB29sCyg46I8KJjSszfXXaZVXXa_!!125332605.jpg_sum.jpg",
//     "href": "https://trade.taobao.com/trade/detail/tradeSnap.htm?tradeID=118964301739554535&snapShot=true",
//     "pro_name": "红谷皮具专柜正品女士牛皮家用钥匙包",
//     "color": "红色2",
//     "price": "189.00",
//     "num": "1",
//     "wangwang": "青岛美眉",
//     "status": "买家已付款",
//     "pay": "261.00",
//     "express": "(含快递:￥17.00)"
// }]
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