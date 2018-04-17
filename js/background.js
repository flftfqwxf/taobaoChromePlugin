/**
 * 创建或更新成功执行的动作
 * @param evt
 * @param content
 * @private
 */
window._tabUpdatedCallback = function(evt, content) {
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
window._openFileAndRun = function(file, txt) {
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
    }
    return await fetch(opts.url, {
        method: opts.type,
        headers: opts.headers,
        body: opts.data,
        responseType: opts.responseType
    }).then(res => {
            if (opts.handleUploadResponse_) {
                opts.handleUploadResponse_(res, opts);
            } else {
                if (opts.responseType === 'arraybuffer') {
                    return res.arrayBuffer();
                }
                return res.json()
            }
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

window.getFiles = async function(url = 'https://www.googleapis.com/drive/v3/files') {
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
window.getFileContent = async function(url = 'https://www.googleapis.com/drive/v3/files') {
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
window.updateFileToGoogleDrive = async function(file, fileId) {
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
window.createFileToGoogleDrive = async function(file) {
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
        data: JSON.stringify({"name": file.name}),
        headers: {
            'X-Upload-Content-Type': gdocs.data.mimeType.xlsx,
            "content-type": 'application/json; charset=UTF-8',
            'X-Upload-Content-Length': file.content.size
        },
        handleUploadResponse_(res, opts) {
            let loc = res.headers.get('location');
            let uploadOpts = {
                url: loc,
                type: 'put',
                data: file.content,
                headers: {
                    "content-type": gdocs.data.mimeType.xlsx,
                    'Content-Length': file.content.size
                }
            }
            if (res.status == 201 || res.status == 200) {
                getAuthAndSend(uploadOpts)
            } else {
            }
        },
        handleRequestFailure_() {
            this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, a))
        }
    }
    let content = await getAuthAndSend(opts)
    return content;
}
window.saveFileToGoogleDrive = async function saveFileToGoogleDrive(file, done) {
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

