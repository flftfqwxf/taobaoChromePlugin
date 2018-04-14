export default class Client {
    constructor() {
    }

    sendRequest(a, b, c, d, e, g, f, h) {
        this.authAndSend_(a, b, c, d, e, !0, g, f, h)
    }

    sendRequestJson(a, b, c, d, e, g, f, h) {
        d["Content-Type"] = "application/json; charset=UTF-8";
        e = e ? JSON.stringify(e) : null;
        this.sendRequest(a, b, c, d, e, g, f, h)
    }

    authAndSend_(a, b, c, d, e, g, f, h, n) {
        chrome.identity.getAuthToken({interactive: true}, function(m) {
            if (chrome.runtime.lastError) gdlog.infoLastErr("Client.authAndSend", "getAuthToken"), h(chrome.runtime.lastError.message || "N/A"); else {
                var p = n ? n : [gdocs.HttpStatus.OK], k = new XMLHttpRequest;
                k.onreadystatechange = function() {
                    if (4 == k.readyState) {
                        if (g && k.status == gdocs.HttpStatus.UNAUTHORIZED) {
                            gdlog.info("Client.authAndSend", "Retry. responseText:" + k.responseText + " errMsg:" + gdocs.msgutil.createXhrErrMsg(k)),
                                goog.asserts.assert(m), chrome.identity.removeCachedAuthToken({token: m}, function() {
                                gdocs.Client.authAndSend_(a, b, c, d, e, !1, f, h)
                            });
                        } else if (-1 != p.indexOf(k.status)) {
                            f(k);
                        } else {
                            var l = gdocs.msgutil.createXhrErrMsg(k);
                            gdlog.info("Client.authAndSend", "responseText:" + k.responseText + " errMsg:" + l);
                            h(l)
                        }
                    }
                };
                var l = b;
                c && (l += "?" + gdocs.Client.encodeParams_(c));
                k.open(a, l, !0);
                d.Authorization = "Bearer " + m;
                for (var q in d) k.setRequestHeader(q, d[q]);
                k.send(e)
            }
        })
    }

    encodeParams_(a) {
        var b = [], c = 0, d;
        for (d in a) b[c++] = encodeURIComponent(d) + "=" + encodeURIComponent(a[d]);
        return b.join("&")
    };
}
