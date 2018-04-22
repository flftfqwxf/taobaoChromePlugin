import {DataTable} from './page/components/dataTable.js';

console.log('init preview');
let table;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.event === 'preView') {
        setTimeout(() => {
            if (table) {
                table = new DataTable(request, table);
            } else {
                table = new DataTable(request);
            }
        }, 300)
    }
});
