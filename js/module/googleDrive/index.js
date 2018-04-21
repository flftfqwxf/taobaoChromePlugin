export class GDriver {
    constructor() {
        this.gdocs = new Gdocs();
    }

    async getAuth() {
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

    async getAuthAndSend(opts) {
        opts = Object.assign({}, {url: 'https://www.googleapis.com/drive/v3/files', data: {}, dataType: 'json', headers: {}, type: 'GET', responseType: null}, opts);
        let token = await this.getAuth();
        let retry = true;
        opts.headers = Object.assign({}, opts.headers, {
            Authorization: 'Bearer ' + token,
        })
        if (opts.type === 'GET') {
            let queryStr = $.param(opts.data)
            // let queryStr = []
            // for (var item in opts.data) {
            //     queryStr.push(`${item}=${opts.data[item]}`)
            // }
            // queryStr = queryStr.join('&')
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
            alert(err);
            // if (this.status === 401 && retry) {
            // 该状态可能表示缓存的访问令牌无效，
            // 使用新的令牌再试一次。
            retry = false;
            chrome.identity.removeCachedAuthToken(
                {'token': token},
                function() {
                    return this.getAuthAndSend(opts)
                });
            // }
            return err;
        });
    }

    async getFiles(parent, url = 'https://www.googleapis.com/drive/v3/files') {
        let opts = {
            url,
            data: {
                corpora: 'user',
                q: `mimeType='${this.gdocs.data.mimeType.xlsx}'`,
                parents: parent
            }
        }
        if (parent) {
            opts.data.parents = parent
        }
        let files = await this.getAuthAndSend(opts)
        return this.checkError(files);
    }

    async getFileByName(fileName, parent, url = 'https://www.googleapis.com/drive/v3/files') {
        let q = {
            mimeType: this.gdocs.data.mimeType.xlsx
        };
        if (fileName) {
            q.name = fileName
        }
        let opts = {
            url,
            data: {
                corpora: 'user',
                q: $.param(q)
            }
        }
        if (parent) {
            opts.data.parents = parent
        }
        let files = await this.getAuthAndSend(opts)
        return this.checkError(files);
    }

    /**
     * 通过名字获取对应文件夹信息
     * @param url
     * @returns {Promise<*>}
     */
    async getFolderByName(folderName, url = 'https://www.googleapis.com/drive/v3/files') {
        let opts = {
            url,
            data: {
                corpora: 'user',
                q: {
                    mimeType: this.gdocs.data.mimeType.FOLDER,
                    name: folderName
                }
            }
        }
        let files = await this.getAuthAndSend(opts);
        return this.checkError(files);
    }

    objectToQuerystring(obj) {
        if ($.isPlainObject(obj)) {
            return Object.keys(obj).reduce(function(str, key, i) {
                var delimiter, val;
                key = encodeURIComponent(key);
                val = encodeURIComponent(obj[key]);
                return [str, delimiter, key, '=', val].join('');
            }, '');
        }
        return obj;
    }

    /**
     * 判断是否返回数据有错误，如果有错误则返回空数组
     * @param files
     * @returns {*}
     */
    checkError(files) {
        if (!files || !files.files) {
            alert('获取错误，', JSON.stringify(files));
            console.log(files);
            return [];
        }
        return files.files;
    }

    async getFileContent(parent, url = 'https://www.googleapis.com/drive/v3/files') {
        let files = await this.getFiles(parent);
        if (files && files) {
        }
        let opts = {
            url: url + '/' + files.files[0].id + '?alt=media',
            dataType: 'binary',
            responseType: 'arraybuffer'
        }
        let content = await this.getAuthAndSend(opts)
        if (!content.error) {
            return content;
        }
        alert(content.error.message);
        return false;
    }

    async updateFileToGoogleDrive(file, fileId) {
        var metadata = {
            mimeType: this.gdocs.data.mimeType.xlsx,
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
        let content = await this.getAuthAndSend(opts)
        return content;
    }

    async createFileToGoogleDrive(file) {
        var metadata = {
            name: file.name
        }
        if (file.parents) {
            metadata.parents = file.parents;
        }
        let _this = this;
        let opts = {
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
            type: 'post',
            data: JSON.stringify(metadata),
            headers: {
                'X-Upload-Content-Type': _this.gdocs.data.mimeType.xlsx,
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
                        "content-type": _this.gdocs.data.mimeType.xlsx,
                        'Content-Length': file.content.size
                    }
                }
                if (res.status == 201 || res.status == 200) {
                    _this.getAuthAndSend(uploadOpts)
                } else {
                }
            },
            handleRequestFailure_() {
                alert('upload error');
            }
        }
        let content = await this.getAuthAndSend(opts)
        return this.checkError(content);
    }

    async saveFileToGoogleDrive(file, done) {
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
}

export class Gdocs {
    constructor() {
        this.DocList = {}
        this.DocList.MAJOR_VERSION_PATTERN_ = /\d+\.\d+/;
        this.DocList.MAJOR_VERSION_ = chrome.runtime.getManifest().version.match(this.DocList.MAJOR_VERSION_PATTERN_)[0];
        this.DocList.X_USER_AGENT_ = "google-docschromeextension-" + this.DocList.MAJOR_VERSION_;
        this.data = {};
        this.data.EXTENSIONS = {
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
        this.data.CONVERTIBLE = {
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
        this.data.mimeType = {
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
            XML: "text/xml",
            FOLDER: "application/vnd.google-apps.folder"
        }
        this.DocList.Feed = {
            ABOUT: "https://www.googleapis.com/drive/v3/about",
            FILES: "https://www.googleapis.com/drive/v3/files",
            UPLOAD: "https://www.googleapis.com/upload/drive/v3/files",
            USER_INFO: "https://www.googleapis.com/userinfo/v3/me"
        };
    }
}
