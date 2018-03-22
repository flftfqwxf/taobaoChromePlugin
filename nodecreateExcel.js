var Excel = require('exceljs');
var request = require("request");
// var request = require("request-promise-native");
// var request = require('request-promise');
;
var workbook = new Excel.Workbook();
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
var i2b = require("imageurl-base64");
// add image to workbook by base64
// var myBase64Image = "data:image/png;base64,iVBORw0KG...";
// var imageId2 = workbook.addImage({
//     base64: myBase64Image,
//     extension: 'png',
// });
// worksheet.addImage(imageId2, 'B2:D6');
var sheet = workbook.addWorksheet('My Sheet', {properties: {tabColor: {argb: 'FFC0000'}}});
// create a new sheet writer with pageSetup settings for fit-to-page
sheet.columns = [
    {header: 'Id', key: 'id', width: 10},
    {header: 'Name', key: 'name', width: 32},
    {header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1}
];
sheet.addRow({id: 1, name: {text: 'John Doe32', hyperlink: 'https://baidu.com'}, dob: new Date(1970, 1, 1)});
sheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7)});
let img = 'https://img.alicdn.com/bao/uploaded/i4/125332605/TB2PvOScvjM8KJjSZFsXXXdZpXa_!!125332605.jpg_sum.jpg';
let img2 = 'https://img.alicdn.com/bao/uploaded/i4/125332605/TB2SkoEepHM8KJjSZJiXXbx3FXa_!!125332605.jpg_sum.jpg';

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
let rq = function(img) {
    return new Promise((resolve, reject) => {
        i2b(img, (data) => {
            if (data && data.response ) {

                reject(data)
              
            }
            resolve(data)
        })
    })
}
// rq(img).then((data) => {
//     var imageId2 = workbook.addImage({
//         base64: 'data:' + data.mimeType + ';base64,' + data.base64,
//         extension: 'png',
//     });
//     sheet.addImage(imageId2, 'B2:B2');
//     let dir = __dirname + '/aa.xlsx';
//     console.log(dir)
//     workbook.xlsx.writeFile(dir)
//         .then(function(data) {
//             console.log(data)
//         });
// })
let list =[]
list.push(rq(img))
list.push(rq(img2))
Promise.all(list).then((data)=>{
    data.map((item,ids)=>{
        var imageId = workbook.addImage({
            base64: 'data:' + item.mimeType + ';base64,' + item.base64,
            extension: 'png',
        });
        sheet.addImage(imageId, `B${ids+1}:B${ids+1}`);
    })

    let dir = __dirname + '/aa.xlsx';
    console.log(dir)
    workbook.xlsx.writeFile(dir)
        .then(function(data) {
            console.log(data)
        });
}).catch((err)=>{
    console.log(err)
})
// Promise.resolve(i2b(img, function(data) {
//     return Promise.resolve(data)
// })).then((data)=>{
//     console.log(data)
// })
// request
//     .get(img).on('response', function(response) {
//     console.log(response.statusCode) // 200
//     console.log(response.headers['content-type']) // 'image/png'
//     return Promise.reject(response.statusCode);
// })
//
// request( {
//     uri: img,
//     encoding: "binary"
// }).then((data) => {
//     var img = new Buffer(data, "binary").toString("base64");
//
//     return callback(null, {
//         mimeType: resp.headers["content-type"],
//         base64: img,
//         dataUri: prefix + img
//     });
//     console.log(data)
//     var imageId2 = workbook.addImage({
//         base64: data,
//         extension: 'png',
//     });
//     sheet.addImage(imageId2, 'B2:D6');
//     let dir = __dirname + '/aa.xlsx';
//     console.log(dir)
//     workbook.xlsx.writeFile(dir)
//         .then(function(data) {
//             console.log(data)
//         });
// })
// Promise.all(i2b(img)).then((data)=>{
//     console.log('-------------------------------------------------')
//
//     console.log(data)
//     var imageId2 = workbook.addImage({
//         base64: 'data:' + data.mimeType + ';base64,' + data.base64,
//         extension: 'png',
//     });
//     sheet.addImage(imageId2, 'B2:D6');
//     let dir = __dirname + '/aa.xlsx';
//     console.log(dir)
//     workbook.xlsx.writeFile(dir)
//         .then(function(data) {
//             console.log(data)
//         });
// });




