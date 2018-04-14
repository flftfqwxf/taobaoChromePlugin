export default class UploadStatus {
    constructor(dataSource, state, c, d, e, title, docId, iconUrl) {
        this.dataSource_ = dataSource;
        this.state_ = state;
        this.errorMsg_ = c || "";
        this.sentBytes_ = d || 0;
        this.openUrl_ = e || "";
        this.title_ = title || "";
        this.docId_ = docId || "";
        this.iconUrl_ = iconUrl || ""
        this.StatusResponse = {CANCEL: "cancel", PROCEED: "proceed"}
        this.State = {FAILURE: "failure", IN_PROGRESS: "inProgress", SUCCESS: "success"}
    }


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
