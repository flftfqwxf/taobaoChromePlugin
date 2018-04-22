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
                if (res.status !== 200) {
                    return Promise.reject(res)
                }
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
                if (err.status === 401 && retry) {
                    // 该状态可能表示缓存的访问令牌无效，
                    //使用新的令牌再试一次。
                    retry = false;
                    chrome.identity.removeCachedAuthToken(
                        {'token': token},
                        function() {
                            return this.getAuthAndSend(opts)
                        });
                    // }
                    return err;
                } else {
                    return err.json().then((val) => {
                        alert(JSON.stringify(val))
                    })
                }
            }
        );
    }

    async getFiles(parents, url = 'https://www.googleapis.com/drive/v3/files') {
        let opts = {
            url,
            data: {
                corpora: 'user',
                q: `trashed=false and  mimeType='${this.gdocs.data.mimeType.xlsx}'`,
                parents: parents
            }
        }
        if (parents) {
            opts.data.parents = parents
        }
        let files = await this.getAuthAndSend(opts)
        return this.checkError(files);
    }

    async getFilesByName(opts) {
        opts = Object.assign({}, {name: '', parents: null, mimeType: this.gdocs.data.mimeType.xlsx, autoCreate: false}, opts)
        let sendOpts = {
            url: this.gdocs.DocList.Feed.FILES,
            data: {
                corpora: 'user',
                q: `trashed=false and name='${opts.name}' and mimeType='${opts.mimeType}'`
            }
        }
        if (opts.parents) {
            sendOpts.data.q += ` and parents='${opts.parents}' `;
        }
        let files = await this.getAuthAndSend(sendOpts)
        files = this.checkError(files);
        if (files.length === 0 && opts.autoCreate) {
            files = this.createFile(opts)
        }
        return files;
    }

    async getFileByName(opts) {
        opts = Object.assign({}, {name: '', parents: null, mimeType: this.gdocs.data.mimeType.xlsx, autoCreate: false}, opts)
        let files = await this.getFilesByName(opts)
        if (files.length > 1) {
            alert('有多个同名的文件存在，默认读取返回的第一个文件');
        }
        return files[0]
    }

    /**
     * 获取文件夹
     * @param folderName
     * @param {Boolean} autoCreate 如果未找到文夹，并为true时，则自动创建
     * @param url
     * @returns {Promise<*>}
     */
    async getFolderByName(folderName, autoCreate, url = 'https://www.googleapis.com/drive/v3/files') {
        let opts = {
            url,
            data: {
                corpora: 'user',
                q: `trashed=false and mimeType='${this.gdocs.data.mimeType.FOLDER}' and name='${folderName}'`
            }
        }
        let files = await this.getAuthAndSend(opts);
        let folders = this.checkError(files);
        if (folders.length === 0) {
            folders = await  BG.GDriver.createFolder({
                name: folderName
            })
            if (folders.length === 0) {
                alert('创建文件夹失败');
                return [];
            }
        }
        return folders;
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

    async getFileContent(opts) {
        opts = Object.assign({}, {name: '', parents: null, mimeType: this.gdocs.data.mimeType.xlsx, autoCreate: false}, opts)
        let files = await this.getFileByName(opts);
        if (!files.error) {
            return files;
        }
        alert(files.error.message);
        return false;
    }

    async uploadFile(file) {
        var metadata = {
            name: file.name
        }
        if (file.parents) {
            metadata.parents = file.parents;
        }
        let uploadOpts = this.gdocs.DocList.Feed.UPLOAD(file.id)
        let _this = this;
        let opts = {
            url: uploadOpts.url,
            type: uploadOpts.type,
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
        if (file.id) {
            opts.url = `https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=resumable`
        }
        let content = await this.getAuthAndSend(opts)
        return this.checkError(content);
    }

    async createFolder(folder = {name: 'taobao', parents: null}) {
        var metadata = {
            name: folder.name,
            mimeType: this.gdocs.data.mimeType.FOLDER
        }
        if (folder.parents) {
            metadata.parents = folder.parents;
        }
        let _this = this;
        let opts = {
            url: this.gdocs.DocList.Feed.FILES,
            type: 'post',
            data: JSON.stringify(metadata),
            headers: {
                "content-type": 'application/json; charset=UTF-8',
            }
        }
        let content = await this.getAuthAndSend(opts)
        if (content.error) {
            alert(content.error.message);
            return '';
        }
        return content;
    }

    async createFile(opts) {
        opts = Object.assign({}, {name: 'taobao', parents: null, mimeType: this.gdocs.data.mimeType.xlsx}, opts)
        var metadata = {
            name: opts.name,
            mimeType: opts.mimeType
        }
        if (opts.parents) {
            metadata.parents = [opts.parents];
        }
        let _this = this;
        let sendPpts = {
            url: this.gdocs.DocList.Feed.FILES,
            type: 'post',
            data: JSON.stringify(metadata),
            headers: {
                "content-type": 'application/json; charset=UTF-8',
            }
        }
        let content = await this.getAuthAndSend(sendPpts)
        if (content.error) {
            alert(content.error.message);
            return '';
        }
        return content;
    }

    async saveFile(file, done) {
        let res;
        if (file.parents) {
            metadata.parents = file.parents;
        }
        if (file.id) { //just update
            res = await this.updateFileToGoogleDrive(file, fileId);
            if (res) {
                console.log('File just updated', res.result);
                return;
            }
        } else {
            let res = await  this.createFileToGoogleDrive(file);
            if (res) {
                res = await this.updateFileToGoogleDrive(file, res.result.id);
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
            UPLOAD: (id) => {
                return {
                    url: `https://www.googleapis.com/upload/drive/v3/files${id ? '/' + id : ''}?uploadType=resumable`,
                    type: id ? 'patch' : 'post'
                }
            },
            USER_INFO: "https://www.googleapis.com/userinfo/v3/me"
        };
    }
}
