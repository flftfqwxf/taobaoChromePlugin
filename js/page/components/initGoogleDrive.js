import Dexie from '/js/common/dexie/dist/dexie.es.js';

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
        var db = new Dexie("FriendDatabase");
        db.version(1).stores({friends: "++id,name,age"});
        db.transaction('rw', db.friends, async () => {

            // Make sure we have something in DB:
            if ((await db.friends.where('name').equals('Josephine').count()) === 0) {
                let id = await db.friends.add({name: "Josephine", age: 21});
                alert(`Addded friend with id ${id}`);
            }
            // Query:
            let youngFriends = await db.friends.where("age").below(25).toArray();
            // Show result:
            alert("My young friends: " + JSON.stringify(youngFriends));
        }).catch(e => {
            alert(e.stack || e);
        });
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