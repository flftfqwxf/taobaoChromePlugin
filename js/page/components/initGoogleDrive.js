import indexedDB from '../../module/indexedDB/indexedDB.js';

export class Store {
    constructor() {
        this.GDriver = chrome.extension.getBackgroundPage().BG.GDriver;
        this.initGoogleDrive();
    }

    async initGoogleDrive() {
        let folder = await this.GDriver.getFolderByName('taobao', true), parents = null;
        parents = folder.id;
        let content = await this.GDriver.getFileContent({name: 'product.json', autoCreate: true, parents: parents, mimeType: this.GDriver.gdocs.data.mimeType.JSON});
        console.log('内容：product:' + content);
        if (content) {
        }
        this.initDB();
    }

    async initTable(name, parents, model) {
        let product = await this.GDriver.getFileByName({name: 'product', parents: parents});
        if (product) {
            let content = await this.GDriver.getFileContent({name: 'product', parents: parents});
            if (!content) {
                // this.GDriver.uploadFile()
            }
        }
    }

    async initDB() {
        let db = new indexedDB('taobaoStore', 'product', '++id,product_num,product_group_id,product_group_name,product_name,product_price,purchase_price,product_color,product_img')
    }

    async uploadExcel(fileName) {
        var workbook = new ExcelJS.Workbook();
        workbook.creator = 'sky';
        workbook.lastModifiedBy = 'sky';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        var worksheet = workbook.addWorksheet("product");
        worksheet.views = [
            {state: 'frozen', xSplit: 0, ySplit: 1}
        ];
        worksheet.autoFilter = {
            from: 'A1',
            to: 'M1'
        };
        worksheet.properties.defaultRowHeight = 50;
        worksheet.columns = [
            {"key": "id", header: 'ID'},
            {"key": "product_num", header: 'product_num', width: 18},
            {"key": "product_group_id", header: 'product_group_id', width: 20},
            {"key": "product_group_name", header: 'product_group_name'},
            {"key": "product_name", header: 'product_name', width: 45},
            {"key": "product_price", header: 'product_price'},
            {"key": "product_sale_price", header: 'product_sale_price'},
            {"key": "product_color", header: 'product_color'},
            {"key": "product_img", header: 'product_img'}
        ];
        // worksheet.addRows(data);
        workbook.xlsx.writeBuffer().then(function(data) {
                var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                this.GDriver.uploadFile({
                    name: `${fileName}.xlsx`,
                    content: blob
                }, function() {
                })
            }
        );
    }
}