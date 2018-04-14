export default class DocList {
    constructor(client_) {
        this.client_ = client_;
        this.MAJOR_VERSION_PATTERN_ = /\d+\.\d+/;
        this.MAJOR_VERSION_ = chrome.runtime.getManifest().version.match(this.MAJOR_VERSION_PATTERN_)[0]
        this.X_USER_AGENT_ = "google-docschromeextension-" + this.MAJOR_VERSION_;
        this.Feed = {
            ABOUT: "https://www.googleapis.com/drive/v3/about",
            FILES: "https://www.googleapis.com/drive/v3/files",
            UPLOAD: "https://www.googleapis.com/upload/drive/v3/files",
            USER_INFO: "https://www.googleapis.com/userinfo/v3/me"
        }
    }

    addHeaders(headers) {
        headers = headers || {};
        headers["X-User-Agent"] = gdocs.DocList.X_USER_AGENT_;
        return headers;
    }

    loadMetadata(a, b) {
        this.client_.sendRequestJson("GET", this.Feed.USER_INFO, {fields: "email"}, this.addHeaders(), null, this.handleMetadataResults_, b)
    }

    handleMetadataResults_(a, b) {
        var c = JSON.parse(b.responseText);
        a(c.email)
    }

    renameFile(filename, fileId, c, d) {
        filename = {name: filename};
        this.client_.sendRequestJson("PUT", this.Feed.FILES + "/" + fileId, {fileId: fileId}, this.addHeaders(), filename, c, d)
    }

    trashFile(fileId, b, c) {
        this.client_.sendRequest("POST", this.Feed.FILES + "/" + fileId + "/trash", {fileId: fileId}, this.addHeaders(), null, b, c)
    }

    trashFile(fileId, b, c) {
        this.client_.sendRequest("POST", this.Feed.FILES + "/" + fileId + "/trash", {fileId: fileId}, this.addHeaders(), null, b, c)
    }
}
