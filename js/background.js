chrome.runtime.onInstalled.addListener(function() {
    console.log('background')
    window.localStorage.setItem('background', 1111);
});
/**
 * 创建或更新成功执行的动作
 * @param evt
 * @param content
 * @private
 */
var _tabUpdatedCallback = function(evt, content) {
    return function(newTab) {
        if (content) {
            setTimeout(function() {
                chrome.tabs.sendMessage(newTab.id, {
                    type: 'update',
                    content: content,
                    event: evt
                });
            }, 300)
        }
    };
};
var _openFileAndRun = function(file, txt) {
    chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
        var isOpened = false;
        var tabId;
        var reg = new RegExp("^chrome.*" + file + ".html$", "i");
        for (var i = 0, len = tabs.length; i < len; i++) {
            if (reg.test(tabs[i].url)) {
                isOpened = true;
                tabId = tabs[i].id;
                break;
            }
        }
        if (!isOpened) {
            chrome.tabs.create({
                url: 'template/' + file + '.html',
                active: true
            }, _tabUpdatedCallback(file, txt));
        } else {
            chrome.tabs.update(tabId, {highlighted: true}, _tabUpdatedCallback(file, txt));
        }
    });
};

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (callback) callback(response);
        });
    });
}

async function getAuth() {
    let token = await new Promise(function(resolve, reject) {
        chrome.identity.getAuthToken({'interactive': false}, function(token) {
            console.log(token);
            if (chrome.runtime.lastError) {
                reject('获取Token错误：' + chrome.runtime.lastError);
            } else {
                resolve(token)
            }
        });
    }).catch((err) => {
        alert(err);
        return false;
    })
    return token;
}

async function getAuthAndSend(opts) {
    opts = Object.assign({}, {url: 'https://www.googleapis.com/drive/v3/files', data: {}, dataType: 'json', headers: {}, type: 'GET', responseType: null}, opts);
    let token = await getAuth();
    let retry = true;
    opts.headers = Object.assign({}, opts.headers, {
        Authorization: 'Bearer ' + token,
    })
    if (opts.type === 'GET') {
        let queryStr = []
        for (var item in opts.data) {
            queryStr.push(`${item}=${opts.data[item]}`)
        }
        queryStr = queryStr.join('&')
        if (opts.url.indexOf('?') !== -1) {
            opts.url += '&' + queryStr
        } else {
            opts.url += '?' + queryStr
        }
        opts.body = null
    } else {
        // opts.data = JSON.stringify(opts.data);
    }
    return await fetch(opts.url, {
        method: opts.type,
        headers: opts.headers,
        body: opts.data,
        responseType: opts.responseType
    }).then(res => {
            if (opts.responseType === 'arraybuffer') {
                return res.arrayBuffer();
            }
            return res.json()
        }
    ).then((res) => {
        return res
    }).catch((err) => {
        // if (this.status === 401 && retry) {
        // 该状态可能表示缓存的访问令牌无效，
        // 使用新的令牌再试一次。
        retry = false;
        chrome.identity.removeCachedAuthToken(
            {'token': token},
            function() {
                return getAuthAndSend(opts)
            });
        // }
        return err;
    });
}

async function getFiles(url = 'https://www.googleapis.com/drive/v3/files') {
    let opts = {
        url,
        data: {
            corpora: 'user',
            q: `mimeType='${gdocs.data.mimeType.xlsx}'`
        }
    }
    let files = await getAuthAndSend(opts)
    return files;
}

async function getFileContent(url = 'https://www.googleapis.com/drive/v3/files') {
    let files = await getFiles();
    let opts = {
        url: url + '/' + files.files[0].id + '?alt=media',
        dataType: 'binary',
        responseType: 'arraybuffer'
    }
    let content = await getAuthAndSend(opts)
    if (!content.error) {
        return content;
    }
    alert(content.error.message);
    return false;
    // var oReq = new XMLHttpRequest();
    // oReq.open("GET", url + '?alt=media', true);
    // oReq.responseType = "arraybuffer";
    // oReq.setRequestHeader('Authorization', 'Bearer ' + token)
    // oReq.onload = function(oEvent) {
    //     resolve(oReq.response)
    // };
    // oReq.send();
}

async function updateFileToGoogleDrive(file, fileId) {
    var metadata = {
        mimeType: gdocs.data.mimeType.xlsx,
        name: file.name,
        fields: 'id',
        body: file.content
    }
    let opts = {
        url: 'https://www.googleapis.com/upload/drive/v3/files/' + fileId,
        type: 'PATCH',
        body: file.content,
        resource: metadata
    }
    let content = await getAuthAndSend(opts)
    return content;
}

async function createFileToGoogleDrive(file) {
    // var metadata = {
    //     mimeType: gdocs.data.mimeType.xlsx,
    //     name: file.name
    // }
    // if (file.parents) {
    //     metadata.parents = file.parents;
    // }
    let opts = {
        url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
        type: 'post',
        data: file.name,
        headers: {
            'X-Upload-Content-Type': gdocs.data.mimeType.xlsx,
            "content-type": 'application/json; charset=UTF-8',
            'X-Upload-Content-Length': file.content.size
        }, handleFirstResponse: function() {
            if (b.status != gdocs.HttpStatus.OK) {
                var c = gdocs.msgutil.createXhrErrMsg(b);
                gdlog.info("ResumableUploader.handleFirstResponse", "responseText:" + b.responseText + " errMsg:" + c);
                this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, c))
            } else this.uploadUrl_ = b.getResponseHeader("Location"), this.sendUploadRequest_(0, a)
        }, handleRequestFailure: function() {
            if (b.status == gdocs.HttpStatus.CREATED || b.status == gdocs.HttpStatus.OK) this.handleCreated_(b); else {
                goog.asserts.assert(b.status == gdocs.HttpStatus.RESUME_INCOMPLETE);
                var c = b.getResponseHeader("Range");
                goog.isDefAndNotNull(c) ? (c = c ? Number(c.match(gdocs.ResumableUploader.RANGE_END_)[1]) + 1 : 0, this.sendUploadRequest_(c, a)) : (gdlog.info("ResumableUploader.handleResponse", "No Range respose. url:" + this.uploadUrl_ + " errMsg:No Range response in header"),
                    this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, "No Range response in header")))
            }
        }
    }
    let content = await getAuthAndSend(opts)
    return content;
}

class UploadStatus {
    constructor(dataSource, state, c, d, e, title, docId, iconUrl) {
        this.dataSource_ = dataSource;
        this.state_ = state;
        this.errorMsg_ = c || "";
        this.sentBytes_ = d || 0;
        this.openUrl_ = e || "";
        this.title_ = title || "";
        this.docId_ = docId || "";
        this.iconUrl_ = iconUrl || ""
    }

    StatusResponse: {CANCEL: "cancel", PROCEED: "proceed"}
    State: {FAILURE: "failure", IN_PROGRESS: "inProgress", SUCCESS: "success"}

    getUploadRatio() {
        return 0 == this.sentBytes_ ? 0 : this.sentBytes_ / this.dataSource_.getSize()
    }

    isComplete() {
        return this.state_ != this.State.IN_PROGRESS
    }

    isSuccess() {
        return this.state_ == this.State.SUCCESS
    };
}

class ResumableUploader {
    constructor(client, dataSource, folderInfo, chunkSize, extraHeaders, callback) {
        this.client_ = client;
        this.dataSource_ = dataSource;
        this.folderInfo_ = folderInfo;
        this.chunkSize_ = chunkSize;
        this.extraHeaders_ = extraHeaders || {};
        this.callback_ = callback;
        this.uploadUrl_ = "";
        this.RANGE_END_ = /\d+-(\d+)/,
    }

    startResumableUpload(UploadContentType) {
        UploadContentType = this.patchContentType_(UploadContentType);
        let headers = gdocs.DocList.addHeaders({"X-Upload-Content-Type": UploadContentType, "X-Upload-Content-Length": this.dataSource_.getSize()}), c;
        for (item in this.extraHeaders_) headers[item] = this.extraHeaders_[item];
        this.dataSource_.getDriveFilename();
        c = {uploadType: "resumable"};
        this.dataSource_.shouldConvert() && (c.convert = !0);
        var d = {title: this.dataSource_.getDriveFilename()};
        this.folderInfo_ && (d.parents = [{kind: "drive#fileLink", id: this.folderInfo_.folderId}]);
        gdlog.info("ResumableUploader.sendFirstPost", "Starting upload. headers:" + gdlog.prettyPrint(b) + "\nparams:" + gdlog.prettyPrint(c) + "\nJSON:" + gdlog.prettyPrint(d));
        this.client_.sendRequestJson("POST", gdocs.DocList.Feed.UPLOAD, c, b, d, goog.bind(this.handleFirstResponse_, this, a), goog.bind(this.handleRequestFailure_, this), [gdocs.HttpStatus.OK])
    }

    handleFirstResponse_(a, b) {
        if (b.status != gdocs.HttpStatus.OK) {
            var c = gdocs.msgutil.createXhrErrMsg(b);
            gdlog.info("ResumableUploader.handleFirstResponse", "responseText:" + b.responseText + " errMsg:" + c);
            this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, c))
        } else this.uploadUrl_ = b.getResponseHeader("Location"), this.sendUploadRequest_(0, a)
    }

    handleUploadResponse_(a, b) {
        if (b.status == gdocs.HttpStatus.CREATED || b.status == gdocs.HttpStatus.OK) this.handleCreated_(b); else {
            goog.asserts.assert(b.status == gdocs.HttpStatus.RESUME_INCOMPLETE);
            var c = b.getResponseHeader("Range");
            goog.isDefAndNotNull(c) ? (c = c ? Number(c.match(gdocs.ResumableUploader.RANGE_END_)[1]) + 1 : 0, this.sendUploadRequest_(c, a)) : (gdlog.info("ResumableUploader.handleResponse", "No Range respose. url:" + this.uploadUrl_ + " errMsg:No Range response in header"),
                this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, "No Range response in header")))
        }
    }

    handleRequestFailure_() {
        this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, a))
    }

    sendUploadRequest_(a, b) {
        var c = this.dataSource_.getSize(), d = Math.min(c, a + this.chunkSize_) - 1,
            e = new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.IN_PROGRESS, null, Math.max(0, a - 1));
        (e = this.callback_(null, e)) && e == gdocs.UploadStatus.StatusResponse.CANCEL ? (d = chrome.i18n.getMessage("UPLOAD_CANCELED"), this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, d))) : (c = {
            "Content-Type": b, "Content-Range": "bytes " + a + "-" +
            d + "/" + c
        }, d = this.dataSource_.getData(a, d + 1), gdlog.info("ResumableUploader.handleResponse", "Sending " + c["Content-Range"]), this.client_.sendRequest("PUT", this.uploadUrl_, null, c, d, goog.bind(this.handleUploadResponse_, this, b), goog.bind(this.handleRequestFailure_, this), [gdocs.HttpStatus.CREATED, gdocs.HttpStatus.OK, gdocs.HttpStatus.RESUME_INCOMPLETE]))
    }

    handleCreated_(a) {
        gdlog.info("ResumableUploader.handleCreated", "Completed with status:" + a.status);
        var b = JSON.parse(a.responseText);
        this.callback_(a.responseText, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.SUCCESS, null, this.dataSource_.getSize(), b.alternateLink, b.title, b.id, b.iconLink))
    }

    patchContentType_(a) {
        var b = a;
        if (b) {
            var c = b.indexOf(";");
            0 <= c && (b = b.substring(0, c));
            b = b.toLowerCase();
            0 == b.indexOf(gdocs.MimeType.X_PDF) && (b = gdocs.MimeType.PDF)
        } else b = gdocs.MimeType.OCTET_STREAM;
        b != a && gdlog.info("ResumableUploader.patchContentType", "Changing Content-Type from " + a + " to " + b);
        return b
    }
}

class UploadPageState {
    constructor(a) {
        this.defaultFilename_ = defaultFilename;
        this.filename_ = "";
        this.percentage_ = 0;
        this.fatalMsg_ = this.uploadPage_ = null;
        this.fatalMsgHasHtml_ = false;
    }

    fatal(a) {
        gdlog.info("UploadPageState.fatal", a);
        this.fatalMsg_ = this.fatalMsg_ ? this.fatalMsg_ + ("; " + a) : a;
        this.uploadPage_ && this.uploadPage_.fatal(this.fatalMsg_, this.fatalMsgHasHtml_)
    }

    fatalHtml(a) {
        this.fatalMsgHasHtml_ = true;
        this.fatal(a)
    }

    hasFailed() {
        return !!this.fatalMsg_
    }

    isCancel() {
        return this.uploadPage_ && this.uploadPage_.isCancel()
    }

    clearCancel() {
        this.uploadPage_ && this.uploadPage_.clearCancel()
    }

    setUploadPage(a) {
        this.uploadPage_ = uploadPage_;
        this.fatalMsg_ ? this.uploadPage_.fatal(this.fatalMsg_, this.fatalMsgHasHtml_) : this.updateFilename_()
    }

    setPercent(percentage_) {
        this.percentage_ = percentage_;
        this.uploadPage_ && this.uploadPage_.setPercent(this.percentage_)
    }

    setFilename = function(filename_) {
        this.filename_ = filename_;
        this.uploadPage_ && this.updateFilename_()
    }

    getFilename() {
        return this.filename_ ? this.filename_ : this.defaultFilename_
    }

    updateFilename_ = function() {
        var filename = this.filename_ ? chrome.i18n.getMessage("DOWNLOAD_KNOWN_NAME", this.filename_) : chrome.i18n.getMessage("DOWNLOAD_UNKNOWN_NAME");
        this.uploadPage_.updateProgressText(filename)
    }
}

class DocList {
    constructor(client_) {
        this.client_ = client_;
        this.MAJOR_VERSION_PATTERN_=/\d+\.\d+/;
        this.MAJOR_VERSION_=chrome.runtime.getManifest().version.match(gdocs.DocList.MAJOR_VERSION_PATTERN_)[0]
        this.X_USER_AGENT_="google-docschromeextension-" + gdocs.DocList.MAJOR_VERSION_;
        this.Feed = {
            ABOUT: "https://www.googleapis.com/drive/v3/about",
            FILES: "https://www.googleapis.com/drive/v3/files",
            UPLOAD: "https://www.googleapis.com/upload/drive/v3/files",
            USER_INFO: "https://www.googleapis.com/userinfo/v3/me"
        }
    }
    addHeaders(headers) {
        headers = headers|| {};
        headers["X-User-Agent"] = gdocs.DocList.X_USER_AGENT_;
        return headers;
    }
}



gdocs.DocList.prototype.loadMetadata = function(a, b) {
    this.client_.sendRequestJson("GET", gdocs.DocList.Feed.USER_INFO, {fields: "email"}, gdocs.DocList.addHeaders(), null, goog.bind(this.handleMetadataResults_, this, a), b)
};
gdocs.DocList.prototype.handleMetadataResults_ = function(a, b) {
    var c = JSON.parse(b.responseText);
    a(c.email)
};
gdocs.DocList.prototype.renameFile = function(a, b, c, d) {
    a = {title: a};
    this.client_.sendRequestJson("PUT", gdocs.DocList.Feed.FILES + "/" + b, {fileId: b}, gdocs.DocList.addHeaders(), a, c, d)
};
gdocs.DocList.prototype.trashFile = function(a, b, c) {
    this.client_.sendRequest("POST", gdocs.DocList.Feed.FILES + "/" + a + "/trash", {fileId: a}, gdocs.DocList.addHeaders(), null, b, c)
};

async function saveFileToGoogleDrive(file, done) {
    let res;
    if (file.parents) {
        metadata.parents = file.parents;
    }
    if (file.id) { //just update
        res = await updateFileToGoogleDrive(file, fileId);
        if (res) {
            console.log('File just updated', res.result);
            return;
        }
    } else {
        let res = await  createFileToGoogleDrive(file);
        if (res) {
            res = await updateFileToGoogleDrive(file, res.result.id);
            console.log(res)
        }
    }
}

var gdocs = {
    AnimatedBrowserIcon: function(a, b, c) {
        this.browserIconPath_ = a;
        this.browserIconSize_ = b;
        this.params_ = c;
        this.numInProgress_ = 0;
        this.browserIconCanvas_ = document.createElement("canvas");
        this.context_ = this.browserIconCanvas_.getContext("2d");
        this.image_ = new Image;
        this.image_.src = this.browserIconPath_;
        this.lastStart_ = this.intervalId_ = 0;
        this.hasDrawn_ = !1
    }
};
gdocs.DocList = function(a) {
    this.client_ = a
};
gdocs.DocList.MAJOR_VERSION_PATTERN_ = /\d+\.\d+/;
gdocs.DocList.MAJOR_VERSION_ = chrome.runtime.getManifest().version.match(gdocs.DocList.MAJOR_VERSION_PATTERN_)[0];
gdocs.DocList.X_USER_AGENT_ = "google-docschromeextension-" + gdocs.DocList.MAJOR_VERSION_;
gdocs.data = {};
gdocs.data.EXTENSIONS = {
    "application/msword": "doc",
    "application/pdf": "pdf",
    "application/rtf": "rtf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "application/x-chrome-extension": "crx",
    "application/x-gzip": "gzip",
    "application/x-pdf": "pdf",
    "application/zip": "zip",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/vnd.wave": "wav",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/pjpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/tiff": "tif",
    "image/vnd.microsoft.icon": "ico",
    "text/css": "css",
    "text/csv": "csv",
    "text/html": "html",
    "text/mhtml": "mht",
    "text/plain": "txt",
    "text/tsv": "tsv",
    "text/xml": "xml",
    "video/mp4": "mp4",
    "video/mpeg": "mpg",
    "video/ogg": "ogg"
};
gdocs.data.CONVERTIBLE = {
    "application/msword": !0,
    "application/rtf": !0,
    "application/vnd.ms-excel": !0,
    "application/vnd.ms-powerpoint": !0,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": !0,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": !0,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": !0,
    "text/csv": !0,
    "text/html": !0,
    "text/plain": !0,
    "text/tsv": !0
};
gdocs.data.mimeType = {
    'xlsx': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ATOM: "application/atom+xml",
    HTML: "text/html",
    MHTML: "text/mhtml",
    JSON: "application/json",
    OCTET_STREAM: "application/octet-stream",
    PLAIN: "text/plain",
    PDF: "application/pdf",
    PNG: "image/png",
    X_PDF: "application/x-pdf",
    XML: "text/xml"
}
gdocs.DocList.Feed = {
    ABOUT: "https://www.googleapis.com/drive/v3/about",
    FILES: "https://www.googleapis.com/drive/v3/files",
    UPLOAD: "https://www.googleapis.com/upload/drive/v3/files",
    USER_INFO: "https://www.googleapis.com/userinfo/v3/me"
};
// chrome.storage.local.set({'pageDate': 1111})
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     // if (callback) callback(tabs.length ? tabs[0].id : null);
//     let filters = {urls: ["https://trade.taobao.com/trade/itemlist/asyncSold.htm?event_submit_do_query=1&_input_charset=utf8"], types: ['xmlhttprequest']}
//     tabs[0] ? filters.integer = tabs[0].id : '';
//     let cachePage = {};
//     let isNotAjax = true;
//     chrome.webRequest.onBeforeRequest.addListener(
//         function(details) {
//             chrome.storage.local.set({'pageDate': 22222})
//             // window.localStorage.setItem();
//             //https://trade.taobao.com/trade/itemlist/asyncSold.htm?event_submit_do_query=1&_input_charset=utf8
//             console.log('----------------------------------------------')
//             console.log(details.url)
//             // if (details.url.endsWith('&isajax=1')) {
//             //
//             //   return {}
//             // }
//             // if (!details.url.endsWith("#do_not_modify_this_request")) {
//             let formData = details.requestBody.formData;
//             let resultData = {}
//             for (var item in formData) {
//                 resultData[item] = formData[item][0]
//             }
//             console.log(resultData)
//             if (isNotAjax) {
//                 isNotAjax = false
//                 $.ajax({
//                     "beforeSend": function(xhr) {
//                         // Works fine.
//                         xhr.setRequestHeader("X-Requested-With", {
//                             toString: function() {
//                                 return "";
//                             }
//                         });
//                         // Logs error on Chrome (probably others) as "Refused to set unsafe header "Referer".
//                         xhr.setRequestHeader("Referer", {
//                             toString: function() {
//                                 return "sdfsdfsdf";
//                             }
//                         });
//                     },
//                     type: "POST",
//                     url: details.url,
//                     data: resultData,
//                     async:false,
//                     // success: function(data) {
//                     //     console.log(data)
//                     //     return {};
//                     // },
//                     // error: function(msg) {
//                     //     console.log(msg)
//                     // },
//                     dataType: 'json'
//                 }).done(function(data) {
//                     console.log(data)
//                 }).fail(function( jqXHR, textStatus, errorThrown )  {
//                     console.log(textStatus)
//                 })
//                 // var jqxhr = $.post(details.url, resultData, function() {
//                 //         console("success");
//                 //     })
//                 //     .done(function(data) {
//                 //         alert("second success");
//                 //     })
//                 //     .fail(function(data) {
//                 //         alert("error");
//                 //     })
//                 //     .always(function(data) {
//                 //         alert("finished");
//                 //     });
//             } else {
//                 return {}
//             }
//             // return {redirectUrl:details.url+"#do_not_modify_this_request"}
//             // }
//             // 由于 sendResponse 是异步调用的，需要返回 true
//         },
//         filters, ["blocking", "requestBody"]
//     );
// });
