
import ResumableUploader from './ResumableUploader.js'
import ResumableUploader from './ResumableUploader.js'
import ResumableUploader from './ResumableUploader.js'
export default class {
    constructor(a, b, c, d) {
        this.client_ = a;
        this.uploadPage_ = b;
        this.uploadParams_ = this.uploadPage_.getUploadParams();
        this.dataSource_ = c;
        this.folderInfo_ = d;
        this.startPercent_ = this.uploadParams_.isUploadOnly() ? 0 : 50
        this.UPLOAD_CHUNK_SIZE_=262144;
    }
    startUploadWhenReady : function() {
        this.uploadDataSourceWhenReady_(this.dataSource_)
    }
    uploadDataSourceWhenReady_ (a) {
        var b = new ResumableUploader(this.client_, a, this.folderInfo_, this.UPLOAD_CHUNK_SIZE_, this.uploadParams_.createImpressionHeader(), goog.bind(this.uploadCallback_, this, a));
        a.startWhenReady(b)
    }
    uploadCallback_ (a, b, c) {
        this.setStartFileMsg_(a.getDriveFilename());
        a = this.uploadPage_.isCancel() ? gdocs.UploadStatus.StatusResponse.CANCEL : gdocs.UploadStatus.StatusResponse.PROCEED;
        if (!c.isComplete()) return c = c.getUploadRatio(), this.uploadPage_.setPercent(this.startPercent_ + (100 - this.startPercent_) * c), a;
        if (!c.isSuccess()) return c = chrome.i18n.getMessage("UPLOAD_FAILURE", [c.getErrorMsg()]), this.uploadPage_.fatal(c, !1), a;
        this.uploadPage_.showFinished(c);
        return a
    }
    setStartFileMsg_(a) {
        this.uploadPage_.setPercent(this.startPercent_);
        a = this.uploadParams_.isUploadOnly() ? chrome.i18n.getMessage("UPLOADING", a) : chrome.i18n.getMessage("SAVING", a);
        this.uploadPage_.updateProgressText(a)
    }
}

