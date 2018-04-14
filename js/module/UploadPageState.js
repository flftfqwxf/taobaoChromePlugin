export default class UploadPageState {
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

    setFilename(filename_) {
        this.filename_ = filename_;
        this.uploadPage_ && this.updateFilename_()
    }

    getFilename() {
        return this.filename_ ? this.filename_ : this.defaultFilename_
    }

    updateFilename_() {
        var filename = this.filename_ ? chrome.i18n.getMessage("DOWNLOAD_KNOWN_NAME", this.filename_) : chrome.i18n.getMessage("DOWNLOAD_UNKNOWN_NAME");
        this.uploadPage_.updateProgressText(filename)
    }
}
