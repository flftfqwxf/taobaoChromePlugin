export default class ResumableUploader {
    constructor(client, dataSource, folderInfo, chunkSize, extraHeaders, callback) {
        this.client_ = client;
        this.dataSource_ = dataSource;
        this.folderInfo_ = folderInfo;
        this.chunkSize_ = chunkSize;
        this.extraHeaders_ = extraHeaders || {};
        this.callback_ = callback;
        this.uploadUrl_ = "";
        this.RANGE_END_ = /\d+-(\d+)/;
    }

    startResumableUpload(UploadContentType) {
        UploadContentType = this.patchContentType_(UploadContentType);
        let headers = DocList.addHeaders({"X-Upload-Content-Type": UploadContentType, "X-Upload-Content-Length": this.dataSource_.getSize()}), c;
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
