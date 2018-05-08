import Dexie from '/js/common/dexie/dist/dexie.es.js';

export default class indexedDB {
    constructor(dbName, tableName, rule) {
        this.initDB(dbName, tableName, rule);
    }

    initDB(dbName, tableName, rule) {
        this.db = this.createDB(dbName, tableName, rule);
    }

    async openDB(dbName) {
        return await new Dexie(dbName).open().then(function(db) {
            log("Found database: " + db.name);
            log("Database version: " + db.verno);
            db.tables.forEach(function(table) {
                log("Found table: " + table.name);
                log("Table Schema: " +
                    JSON.stringify(table.schema, null, 4));
            });
        }).catch('NoSuchDatabaseError', function(e) {
            // Database with that name did not exist
            log("Database not found");
        }).catch(function(e) {
            log("Oh uh: " + e);
        });
    }

    createDB(dbName, tableName, rule) {
        var db = new Dexie(dbName);
        this.createTable(tableName, rule);
        return db;
    }

    createTable(tableName, rule, db) {
        db = db || this.db;
        if (tableName && rule) {
            let schema = {}
            schema[this.tableName] = rule;
            db.version(1).stores(schema);
        }
        return this.db;
    }

    async getTableData(tableName) {
        return await this.db.table(tableName)
            .toArray()
            .then((gitDB) => {
                return gitDB;
            });
    }

    async getTableObj(tableName) {
        return await this.db.table(tableName)
    }

    addItem(tableName, item) {
        // console.log(this)
        this.db.table(tableName)
            .add(item)
            .then((id) => {
                return id
            });
    }

    updateItem(tableName, changes, key) {
        // console.log(this)
        this.db.table(tableName).where(":id").equals(key).modify(changes);
    }
}
