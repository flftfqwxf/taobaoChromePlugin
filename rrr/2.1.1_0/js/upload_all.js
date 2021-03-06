var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
    return void 0 !== a
};
goog.exportPath_ = function(a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    a[0] in c || !c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
};
goog.define = function(a, b) {
    var c = b;
    COMPILED || (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, a) ? c = goog.global.CLOSURE_UNCOMPILED_DEFINES[a] : goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]));
    goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a; (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
    return !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a))
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
    for (var c = a.split("."), d = b || goog.global, e; e = c.shift();) if (goog.isDefAndNotNull(d[e])) d = d[e]; else return null;
    return d
};
goog.globalize = function(a, b) {
    var c = b || goog.global, d;
    for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
    if (goog.DEPENDENCIES_ENABLED) {
        var d;
        a = a.replace(/\\/g, "/");
        for (var e = goog.dependencies_, f = 0; d = b[f]; f++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
        for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        if (goog.useStrictRequires) throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames: {}, nameToPath: {}, requires: {}, visited: {}, written: {}}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH; else if (goog.inHtmlDocument_()) for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length :
            d;
        if ("base.js" == c.substr(d - 7, 7)) {
            goog.basePath = c.substr(0, d - 7);
            break
        }
    }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in d.written)) {
            if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) for (var g in d.requires[e]) if (!goog.isProvided_(g)) if (g in d.nameToPath) a(d.nameToPath[g]); else throw Error("Undefined nameToPath for " + g);
            e in c || (c[e] = !0, b.push(e))
        }
    }

    var b = [], c = {}, d = goog.dependencies_, e;
    for (e in goog.included_) d.written[e] || a(e);
    for (e = 0; e < b.length; e++) if (b[e]) goog.importScript_(goog.basePath + b[e]); else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
    var b = typeof a;
    if ("object" == b) if (a) {
        if (a instanceof Array) return "array";
        if (a instanceof Object) return b;
        var c = Object.prototype.toString.call(a);
        if ("[object Window]" == c) return "object";
        if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
        if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
    } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isNull = function(a) {
    return null === a
};
goog.isDefAndNotNull = function(a) {
    return null != a
};
goog.isArray = function(a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
    return "string" == typeof a
};
goog.isBoolean = function(a) {
    return "boolean" == typeof a
};
goog.isNumber = function(a) {
    return "number" == typeof a
};
goog.isFunction = function(a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
    return !!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {
    }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {}, c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function(a, b, c) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};
goog.bind = function(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
        var b = c.slice();
        b.push.apply(b, arguments);
        return a.apply(this, b)
    }
};
goog.mixin = function(a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript"); else if (goog.global.eval) if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a); else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
    } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
    var c = function(a) {
        return goog.cssNameMapping_[a] || a
    }, d = function(a) {
        a = a.split("-");
        for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
        return b.join("-")
    }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
        return a
    };
    return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
    b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
        return d in b ? b[d] : a
    }));
    return a
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
    a[b] = c
};
goog.inherits = function(a, b) {
    function c() {
    }

    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.base = function(a, c, f) {
        var g = Array.prototype.slice.call(arguments, 2);
        return b.prototype[c].apply(a, g)
    }
};
goog.base = function(a, b, c) {
    var d = arguments.callee.caller;
    if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (d.superClass_) return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor) if (g.prototype[b] === d) f = !0; else if (f) return g.prototype[b].apply(a,
        e);
    if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(a, b) {
    if (1 < arguments.length) {
        var c = Array.prototype.slice.call(arguments, 1);
        c.unshift(this, a);
        return goog.bind.apply(null, c)
    }
    return goog.bind(this, a)
}, Function.prototype.partial = function(a) {
    var b = Array.prototype.slice.call(arguments);
    b.unshift(this, null);
    return goog.bind.apply(null, b)
}, Function.prototype.inherits = function(a) {
    goog.inherits(this, a)
}, Function.prototype.mixin = function(a) {
    goog.mixin(this.prototype,
        a)
});
goog.defineClass = function(a, b) {
    var c = b.constructor, d = b.statics;
    c && c != Object.prototype.constructor || (c = function() {
        throw Error("cannot instantiate an interface (no constructor defined).");
    });
    c = goog.defineClass.createSealingConstructor_(c);
    a && goog.inherits(c, a);
    delete b.constructor;
    delete b.statics;
    goog.defineClass.applyProperties_(c.prototype, b);
    null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
    return c
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a) {
    if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
        var b = function() {
            var c = a.apply(this, arguments) || this;
            this.constructor === b && Object.seal(c);
            return c
        };
        return b
    }
    return a
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
    for (var c in b) Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
    for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c])
};
var gdocs = {data: {}};
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
gdocs.DataSource = function() {
};
gdocs.DataSource.prototype.startWhenReady = function(a) {
    a.startResumableUpload(this.getContentType())
};
gdocs.CaptureDataSource = function(a) {
    gdocs.DataSource.call(this);
    this.capturer_ = a
};
goog.inherits(gdocs.CaptureDataSource, gdocs.DataSource);
gdocs.CaptureDataSource.prototype.shouldConvert = function() {
    return this.capturer_.getAllowConvert() && this.getContentType() in gdocs.data.CONVERTIBLE
};
gdocs.CaptureDataSource.prototype.getDriveFilename = function() {
    return this.capturer_.getFilename()
};
gdocs.CaptureDataSource.prototype.startWhenReady = function(a) {
    null != this.capturer_.getDownloadResults() ? a.startResumableUpload(this.getContentType()) : this.capturer_.setResumableUploader(a)
};
gdocs.CaptureDataSource.prototype.getContentType = function() {
    return this.capturer_.getDownloadResults().getContentType()
};
gdocs.CaptureDataSource.prototype.getSize = function() {
    return this.capturer_.getDownloadResults().getBlobData().size
};
gdocs.CaptureDataSource.prototype.getData = function(a, b) {
    return this.capturer_.getDownloadResults().getBlobData().slice(a, b)
};
goog.debug = {};
goog.debug.Error = function(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, goog.debug.Error); else {
        var b = Error().stack;
        b && (this.stack = b)
    }
    a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.Unicode = {NBSP: "\u00a0"};
goog.string.startsWith = function(a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
    return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
    return " " == a
};
goog.string.isUnicodeChar = function(a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
    var c = String(a).toLowerCase(), d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
        var g = c[f], h = d[f];
        if (g != h) return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
    return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
    return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
    if (b) a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;")); else {
        if (!goog.string.ALL_RE_.test(a)) return a;
        -1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));
        -1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_,
            "&lt;"));
        -1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));
        -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));
        -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
        -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
        goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"))
    }
    return a
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
    return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
    return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
    var c = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"'}, d;
    d = b ? b.createElement("div") : goog.global.document.createElement("div");
    return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
        var g = c[a];
        if (g) return g;
        if ("#" == b.charAt(0)) {
            var h = Number("0" + b.substr(1));
            isNaN(h) || (g = String.fromCharCode(h))
        }
        g || (d.innerHTML = a + " ", g = d.firstChild.nodeValue.slice(0, -1));
        return c[a] = g
    })
};
goog.string.unescapePureXmlEntities_ = function(a) {
    return a.replace(/&([^;]+);/g, function(a, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if ("#" == c.charAt(0)) {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return a
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.preserveSpaces = function(a) {
    return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP)
};
goog.string.stripQuotes = function(a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = 1 == c ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
};
goog.string.truncate = function(a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d && a.length > b) {
        d > b && (d = b);
        var e = a.length - d;
        a = a.substring(0, b - d) + "..." + a.substring(e)
    } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {"\x00": "\\0", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\x0B", '"': '\\"', "\\": "\\\\"};
goog.string.jsEscapeCache_ = {"'": "\\'"};
goog.string.quote = function(a) {
    a = String(a);
    if (a.quote) return a.quote();
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var d = a.charAt(c), e = d.charCodeAt(0);
        b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
};
goog.string.escapeString = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
    return b.join("")
};
goog.string.escapeChar = function(a) {
    if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
    if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
    var b = a, c = a.charCodeAt(0);
    if (31 < c && 127 > c) b = a; else {
        if (256 > c) {
            if (b = "\\x", 16 > c || 256 < c) b += "0"
        } else b = "\\u", 4096 > c && (b += "0");
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
    for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
    return b
};
goog.string.contains = function(a, b) {
    return -1 != a.indexOf(b)
};
goog.string.caseInsensitiveContains = function(a, b) {
    return goog.string.contains(a.toLowerCase(), b.toLowerCase())
};
goog.string.countOf = function(a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
    var c = new RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf(".");
    -1 == c && (c = a.length);
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
    return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
        var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), p = RegExp("(\\d*)(\\D*)", "g");
        do {
            var m = l.exec(h) || ["", "", ""], n = p.exec(k) || ["", "", ""];
            if (0 == m[0].length && 0 == n[0].length) break;
            var c = 0 == m[1].length ? 0 : parseInt(m[1], 10), q = 0 == n[1].length ? 0 : parseInt(n[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 ==
                m[2].length, 0 == n[2].length) || goog.string.compareElements_(m[2], n[2])
        } while (0 == c)
    }
    return c
};
goog.string.compareElements_ = function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
    return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
    var b = Number(a);
    return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
    return String(a).replace(/\-([a-z])/g, function(a, c) {
        return c.toUpperCase()
    })
};
goog.string.toSelectorCase = function(a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
    var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
    return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
        return b + c.toUpperCase()
    })
};
goog.string.parseInt = function(a) {
    isFinite(a) && (a = String(a));
    return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
    a.length && d.push(a.join(b));
    return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
    throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) var e = e + (": " + c), f = d; else a && (e += ": " + a, f = b);
    a = new goog.asserts.AssertionError("" + e, f || []);
    goog.asserts.errorHandler_(a)
};
goog.asserts.setErrorHandler = function(a) {
    goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a)
};
goog.asserts.assert = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function(a, b) {
    goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
};
goog.asserts.assertNumber = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertElement = function(a, b, c) {
    !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
    !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
    return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
    return a[a.length - 1]
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
    for (; c < a.length; c++) if (c in a && a[c] === b) return c;
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
    c = null == c ? a.length - 1 : c;
    0 > c && (c = Math.max(0, a.length + c));
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
    for (; 0 <= c; c--) if (c in a && a[c] === b) return c;
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
};
goog.array.forEachRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) d in e && b.call(c, e[d], d, a)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++) if (h in g) {
        var k = g[h];
        b.call(c, k, h, a) && (e[f++] = k)
    }
    return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
    return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEach(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEachRight(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return !0;
    return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && !b.call(c, e[f], f, a)) return !1;
    return !0
};
goog.array.count = function(a, b, c) {
    var d = 0;
    goog.array.forEach(a, function(a, f, g) {
        b.call(c, a, f, g) && ++d
    }, c);
    return d
};
goog.array.find = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) if (f in e && b.call(c, e[f], f, a)) return f;
    return -1
};
goog.array.findRight = function(a, b, c) {
    b = goog.array.findIndexRight(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--) if (d in e && b.call(c, e[d], d, a)) return d;
    return -1
};
goog.array.contains = function(a, b) {
    return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
    return 0 == a.length
};
goog.array.clear = function(a) {
    if (!goog.isArray(a)) for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
};
goog.array.insert = function(a, b) {
    goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
    goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
    goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
    var d;
    2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
    var c = goog.array.indexOf(a, b), d;
    (d = 0 <= c) && goog.array.removeAt(a, c);
    return d
};
goog.array.removeAt = function(a, b) {
    goog.asserts.assert(null != a.length);
    return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.join = function(a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
        return c
    }
    return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d = arguments[c], e;
        if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) a.push.apply(a, d); else if (e) for (var f = a.length, g = d.length, h = 0; h < g; h++) a[f + h] = d[h]; else a.push(d)
    }
};
goog.array.splice = function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b, c) {
    b = b || a;
    var d = function(a) {
        return goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g
    };
    c = c || d;
    for (var d = {}, e = 0, f = 0; f < a.length;) {
        var g = a[f++], h = c(g);
        Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g)
    }
    b.length = e
};
goog.array.binarySearch = function(a, b, c) {
    return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
    return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
    for (var f = 0, g = a.length, h; f < g;) {
        var k = f + g >> 1, l;
        l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
        0 < l ? f = k + 1 : (g = k, h = !l)
    }
    return h ? f : ~f
};
goog.array.sort = function(a, b) {
    a.sort(b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
    for (var c = 0; c < a.length; c++) a[c] = {index: c, value: a[c]};
    var d = b || goog.array.defaultCompare;
    goog.array.sort(a, function(a, b) {
        return d(a.value, b.value) || a.index - b.index
    });
    for (c = 0; c < a.length; c++) a[c] = a[c].value
};
goog.array.sortObjectsByKey = function(a, b, c) {
    var d = c || goog.array.defaultCompare;
    goog.array.sort(a, function(a, c) {
        return d(a[b], c[b])
    })
};
goog.array.isSorted = function(a, b, c) {
    b = b || goog.array.defaultCompare;
    for (var d = 1; d < a.length; d++) {
        var e = b(a[d - 1], a[d]);
        if (0 < e || 0 == e && c) return !1
    }
    return !0
};
goog.array.equals = function(a, b, c) {
    if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;
    var d = a.length;
    c = c || goog.array.defaultCompareEquality;
    for (var e = 0; e < d; e++) if (!c(a[e], b[e])) return !1;
    return !0
};
goog.array.compare3 = function(a, b, c) {
    c = c || goog.array.defaultCompare;
    for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
        var f = c(a[e], b[e]);
        if (0 != f) return f
    }
    return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
    return a === b
};
goog.array.binaryInsert = function(a, b, c) {
    c = goog.array.binarySearch(a, b, c);
    return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
    b = goog.array.binarySearch(a, b, c);
    return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
    for (var d = {}, e = 0; e < a.length; e++) {
        var f = a[e], g = b.call(c, f, e, a);
        goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
    }
    return d
};
goog.array.toObject = function(a, b, c) {
    var d = {};
    goog.array.forEach(a, function(e, f) {
        d[b.call(c, e, f, a)] = e
    });
    return d
};
goog.array.range = function(a, b, c) {
    var d = [], e = 0, f = a;
    c = c || 1;
    void 0 !== b && (e = a, f = b);
    if (0 > c * (f - e)) return [];
    if (0 < c) for (a = e; a < f; a += c) d.push(a); else for (a = e; a > f; a += c) d.push(a);
    return d
};
goog.array.repeat = function(a, b) {
    for (var c = [], d = 0; d < b; d++) c[d] = a;
    return c
};
goog.array.flatten = function(a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
        var d = arguments[c];
        goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
    }
    return b
};
goog.array.rotate = function(a, b) {
    goog.asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
    return a
};
goog.array.moveItem = function(a, b, c) {
    goog.asserts.assert(0 <= b && b < a.length);
    goog.asserts.assert(0 <= c && c < a.length);
    b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
    if (!arguments.length) return [];
    for (var b = [], c = 0; ; c++) {
        for (var d = [], e = 0; e < arguments.length; e++) {
            var f = arguments[e];
            if (c >= f.length) return b;
            d.push(f[c])
        }
        b.push(d)
    }
};
goog.array.shuffle = function(a, b) {
    for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
        var e = Math.floor(c() * (d + 1)), f = a[d];
        a[d] = a[e];
        a[e] = f
    }
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
    var a = goog.labs.userAgent.util.getNavigator_();
    return a && (a = a.userAgent) ? a : ""
};
goog.labs.userAgent.util.getNavigator_ = function() {
    return goog.global.navigator
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
    goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_()
};
goog.labs.userAgent.util.getUserAgent = function() {
    return goog.labs.userAgent.util.userAgent_
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
    var b = goog.labs.userAgent.util.getUserAgent();
    return goog.string.contains(b, a)
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
    var b = goog.labs.userAgent.util.getUserAgent();
    return goog.string.caseInsensitiveContains(b, a)
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
    for (var b = RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?", "g"), c = [], d; d = b.exec(a);) c.push([d[1], d[2], d[3] || void 0]);
    return c
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR")
};
goog.labs.userAgent.browser.matchIE_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Firefox")
};
goog.labs.userAgent.browser.matchSafari_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android")
};
goog.labs.userAgent.browser.matchChrome_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
    return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS")
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
    return goog.labs.userAgent.util.matchUserAgent("Silk")
};
goog.labs.userAgent.browser.getVersion = function() {
    var a = goog.labs.userAgent.util.getUserAgent();
    if (goog.labs.userAgent.browser.isIE()) return goog.labs.userAgent.browser.getIEVersion_(a);
    if (goog.labs.userAgent.browser.isOpera()) return goog.labs.userAgent.browser.getOperaVersion_(a);
    a = goog.labs.userAgent.util.extractVersionTuples(a);
    return goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a)
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
    var b = /rv: *([\d\.]*)/.exec(a);
    if (b && b[1]) return b[1];
    var b = "", c = /MSIE +([\d\.]+)/.exec(a);
    if (c && c[1]) if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) if (a && a[1]) switch (a[1]) {
        case "4.0":
            b = "8.0";
            break;
        case "5.0":
            b = "9.0";
            break;
        case "6.0":
            b = "10.0";
            break;
        case "7.0":
            b = "11.0"
    } else b = "7.0"; else b = c[1];
    return b
};
goog.labs.userAgent.browser.getOperaVersion_ = function(a) {
    a = goog.labs.userAgent.util.extractVersionTuples(a);
    var b = goog.array.peek(a);
    return "OPR" == b[0] && b[1] ? b[1] : goog.labs.userAgent.browser.getVersionFromTuples_(a)
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(a) {
    goog.asserts.assert(2 < a.length, "Couldn't extract version tuple from user agent string");
    return a[2] && a[2][1] ? a[2][1] : ""
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
    return goog.labs.userAgent.util.matchUserAgent("Presto")
};
goog.labs.userAgent.engine.isTrident = function() {
    return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE")
};
goog.labs.userAgent.engine.isWebKit = function() {
    return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")
};
goog.labs.userAgent.engine.isGecko = function() {
    return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident()
};
goog.labs.userAgent.engine.getVersion = function() {
    var a = goog.labs.userAgent.util.getUserAgent();
    if (a) {
        var a = goog.labs.userAgent.util.extractVersionTuples(a), b = a[1];
        if (b) return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
        var a = a[0], c;
        if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) return c[1]
    }
    return ""
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
    return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a)
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
    var c = goog.array.find(a, function(a) {
        return b == a[0]
    });
    return c && c[1] || ""
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
    return goog.labs.userAgent.util.getUserAgent()
};
goog.userAgent.getNavigator = function() {
    return goog.global.navigator || null
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
    return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile")
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
    var a = goog.userAgent.getNavigator();
    return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
    goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
    goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
    goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
    goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
    var a = goog.userAgent.getUserAgentString();
    goog.userAgent.detectedAndroid_ = !!a &&
        goog.string.contains(a, "Android");
    goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
    goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
    var a = "", b;
    if (goog.userAgent.OPERA && goog.global.opera) return a = goog.global.opera.version, goog.isFunction(a) ? a() : a;
    goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/);
    b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : "");
    return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
    var a = goog.global.document;
    return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
    return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
    return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
    return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
    var a = goog.global.document;
    return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND: 38, EQUAL: 61, HASH: 35, QUESTION: 63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
    var h = "";
    a && (h += a + ":");
    c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
    e && (h += e);
    f && (h += "?" + f);
    g && (h += "#" + g);
    return h
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME: 1, USER_INFO: 2, DOMAIN: 3, PORT: 4, PATH: 5, QUERY_DATA: 6, FRAGMENT: 7};
goog.uri.utils.split = function(a) {
    goog.uri.utils.phishingProtection_();
    return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
    if (goog.uri.utils.needsPhishingProtection_) {
        goog.uri.utils.needsPhishingProtection_ = !1;
        var a = goog.global.location;
        if (a) {
            var b = a.href;
            if (b && (b = goog.uri.utils.getDomain(b)) && b != a.hostname) throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
        }
    }
};
goog.uri.utils.decodeIfPossible_ = function(a) {
    return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
    return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getEffectiveScheme = function(a) {
    a = goog.uri.utils.getScheme(a);
    !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
    return a ? a.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
    return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
    return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
    var b = a.indexOf("#");
    return 0 > b ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
    return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
    return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
    a = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
    a = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
    var b = a.indexOf("#");
    return 0 > b ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
    var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
    return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
    if (goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
};
goog.uri.utils.appendQueryData_ = function(a) {
    if (a[1]) {
        var b = a[0], c = b.indexOf("#");
        0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
        c = b.indexOf("?");
        0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
    }
    return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
    if (goog.isArray(b)) {
        goog.asserts.assertArray(b);
        for (var d = 0; d < b.length; d++) goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c)
    } else null != b && c.push("&", a, "" === b ? "" : "=", goog.string.urlEncode(b))
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
    goog.asserts.assert(0 == Math.max(b.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
    for (c = c || 0; c < b.length; c += 2) goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a);
    return a
};
goog.uri.utils.buildQueryData = function(a, b) {
    var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
    c[0] = "";
    return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
    for (var c in b) goog.uri.utils.appendKeyValuePairs_(c, b[c], a);
    return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
    a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
    a[0] = "";
    return a.join("")
};
goog.uri.utils.appendParams = function(a, b) {
    return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
    return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
    a = [a, "&", b];
    goog.isDefAndNotNull(c) && a.push("=", goog.string.urlEncode(c));
    return goog.uri.utils.appendQueryData_(a)
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
    for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
        var f = a.charCodeAt(b - 1);
        if (f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) if (f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) return b;
        b += e + 1
    }
    return -1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
    return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_))
};
goog.uri.utils.getParamValue = function(a, b) {
    var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
    if (0 > d) return null;
    var e = a.indexOf("&", d);
    if (0 > e || e > c) e = c;
    d += b.length + 1;
    return goog.string.urlDecode(a.substr(d, e - d))
};
goog.uri.utils.getParamValues = function(a, b) {
    for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
        d = a.indexOf("&", e);
        if (0 > d || d > c) d = c;
        e += b.length + 1;
        f.push(goog.string.urlDecode(a.substr(e, d - e)))
    }
    return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
    for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c);
    f.push(a.substr(d));
    return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
    return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
    goog.uri.utils.assertNoFragmentsOrQueries_(a);
    goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
    goog.string.startsWith(b, "/") && (b = b.substr(1));
    return goog.string.buildString(a, "/", b)
};
goog.uri.utils.setPath = function(a, b) {
    goog.string.startsWith(b, "/") || (b = "/" + b);
    var c = goog.uri.utils.split(a);
    return goog.uri.utils.buildFromEncodedParts(c[goog.uri.utils.ComponentIndex.SCHEME], c[goog.uri.utils.ComponentIndex.USER_INFO], c[goog.uri.utils.ComponentIndex.DOMAIN], c[goog.uri.utils.ComponentIndex.PORT], b, c[goog.uri.utils.ComponentIndex.QUERY_DATA], c[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.StandardQueryParam = {RANDOM: "zx"};
goog.uri.utils.makeUnique = function(a) {
    return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
var gdlog = {};
goog.exportSymbol("gdlog", gdlog);
gdlog.Level = {SEVERE: 1E3, WARNING: 900, INFO: 800, CONFIG: 700, FINE: 500, FINER: 400, FINEST: 300};
gdlog.ENABLE_DEBUG_FLAG = !0;
gdlog.DEFAULT_LEVEL_UNCOMPILED_ = gdlog.Level.INFO;
gdlog.DEFAULT_LEVEL_COMPILED_ = gdlog.Level.WARNING;
gdlog.loglevel = gdlog.ENABLE_DEBUG_FLAG ? gdlog.DEFAULT_LEVEL_UNCOMPILED_ : gdlog.DEFAULT_LEVEL_COMPILED_;
goog.exportSymbol("gdlog.loglevel", gdlog.loglevel);
gdlog.msg_ = function(a, b) {
    return a + ": " + b
};
gdlog.isLoggable_ = function(a) {
    return a >= gdlog.loglevel
};
gdlog.error = function(a, b) {
    window.console.error(gdlog.msg_(a, b))
};
gdlog.errorLastErr = function(a, b) {
    window.console.error(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.warn = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b))
};
gdlog.warnLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.WARNING) && window.console.warn(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.info = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b))
};
gdlog.infoLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.INFO) && window.console.info(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.fine = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b))
};
gdlog.fineLastErr = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINE) && window.console.log(gdlog.msg_(a, b + gdlog.lastErr()))
};
gdlog.finer = function(a, b) {
    gdlog.isLoggable_(gdlog.Level.FINER) && window.console.debug(gdlog.msg_(a, b))
};
gdlog.logwarn = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.WARNING, "WARN")
};
goog.exportSymbol("gdlog.logwarn", gdlog.logwarn);
gdlog.loginfo = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.INFO, "INFO")
};
goog.exportSymbol("gdlog.loginfo", gdlog.loginfo);
gdlog.logfine = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINE, "FINE")
};
goog.exportSymbol("gdlog.logfine", gdlog.logfine);
gdlog.logfiner = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINER, "FINER")
};
goog.exportSymbol("gdlog.logfiner", gdlog.logfiner);
gdlog.setLoggingLevel_ = function(a, b) {
    gdlog.loglevel = a;
    return "Log level is now " + b
};
gdlog.lastErr = function() {
    return chrome.runtime.lastError ? chrome.runtime.lastError.message ? " lastError:" + chrome.runtime.lastError.message : " lastError (no message)" : ""
};
gdlog.prettyPrint = function(a, b) {
    if (!a) return '""';
    var c = b || 100, d = {}, e;
    for (e in a) {
        var f = String(a[e]), g = f.length;
        g > c && (f = f.substr(0, c) + " ... (" + g + " bytes)");
        d[e] = f
    }
    return JSON.stringify(d, null, 2)
};
gdocs.DocList = function(a) {
    this.client_ = a
};
gdocs.DocList.MAJOR_VERSION_PATTERN_ = /\d+\.\d+/;
gdocs.DocList.MAJOR_VERSION_ = chrome.runtime.getManifest().version.match(gdocs.DocList.MAJOR_VERSION_PATTERN_)[0];
gdocs.DocList.X_USER_AGENT_ = "google-docschromeextension-" + gdocs.DocList.MAJOR_VERSION_;
gdocs.DocList.Feed = {
    ABOUT: "https://www.googleapis.com/drive/v2/about",
    FILES: "https://www.googleapis.com/drive/v2/files",
    UPLOAD: "https://www.googleapis.com/upload/drive/v2/files",
    USER_INFO: "https://www.googleapis.com/userinfo/v2/me"
};
gdocs.DocList.addHeaders = function(a) {
    a = a || {};
    a["X-User-Agent"] = gdocs.DocList.X_USER_AGENT_;
    return a
};
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
gdocs.domUtil = {};
gdocs.domUtil.HIDDEN_CLASS_ = "gdocs-hidden";
gdocs.domUtil.getHtmlElementByIdAssert = function(a) {
    var b = document.getElementById(a);
    if (!b) throw'Could not find Element with id: "' + a + '"';
    return b
};
gdocs.domUtil.setTextContent = function(a, b) {
    a.textContent = b
};
gdocs.domUtil.setTextContentId = function(a, b) {
    var c = document.getElementById(a);
    c && gdocs.domUtil.setTextContent(c, b)
};
gdocs.domUtil.hideElem = function(a) {
    for (var b = 0; b < arguments.length; b++) arguments[b].classList.add(gdocs.domUtil.HIDDEN_CLASS_)
};
gdocs.domUtil.showElem = function(a) {
    for (var b = 0; b < arguments.length; b++) arguments[b].classList.remove(gdocs.domUtil.HIDDEN_CLASS_)
};
goog.math = {};
goog.math.Size = function(a, b) {
    this.width = a;
    this.height = b
};
goog.math.Size.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
    return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
    return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
};
goog.math.Size.prototype.ceil = function() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Size.prototype.fitsInside = function(a) {
    return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Size.prototype.round = function() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Size.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.width *= a;
    this.height *= c;
    return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
    a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
    return this.scale(a)
};
gdocs.global = {};
gdocs.Impression = {
    OTHER: 0,
    LINK: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    PAGE_ACTION_URL: 6,
    PAGE_ACTION_DOC: 7,
    PAGE_ACTION_HTML: 8,
    PAGE_ACTION_CAPTURE_IMAGE_VISIBLE: 9,
    PAGE_ACTION_CAPTURE_MHTML: 10,
    PAGE_ACTION_CAPTURE_IMAGE_ENTIRE: 15
};
gdocs.HttpStatus = {OK: 200, CREATED: 201, ACCEPTED: 202, RESUME_INCOMPLETE: 308, UNAUTHORIZED: 401};
gdocs.global.MAX_GENERATED_TITLE_LEN = 50;
gdocs.global.MAX_SUFFIX_LEN = 8;
gdocs.global.SAVE_DIALOG_SIZE = new goog.math.Size(417, 170);
gdocs.MimeType = {
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
};
gdocs.ActionId = {
    BUG_INTERNAL: "bug-internal",
    CHANGE_FOLDER: "change-folder",
    FEEDBACK_INTERNAL: "feedback-internal",
    HELP: "help",
    HTML: "html",
    HTML_DOC: "htmldoc",
    IMAGE_ENTIRE: "image-entire",
    IMAGE_VISIBLE: "image-visible",
    MHTML: "mhtml",
    OPTIONS: "options",
    SEND_FEEDBACK: "send-feedback",
    URL: "url"
};
gdocs.msgutil = {};
gdocs.msgutil.createXhrErrMsg = function(a) {
    var b = a.statusText;
    b || (b = chrome.i18n.getMessage("UNSPECIFIED_ERROR"));
    a.status && (b += " (" + a.status + ")");
    return b
};
gdocs.msgutil.createBaseFilenameFromContentType = function(a) {
    a = a.toLowerCase();
    return 0 == a.indexOf("image") ? chrome.i18n.getMessage("IMAGE_DEFAULT_FILENAME") : 0 == a.indexOf("video") ? chrome.i18n.getMessage("VIDEO_DEFAULT_FILENAME") : 0 == a.indexOf("audio") ? chrome.i18n.getMessage("AUDIO_DEFAULT_FILENAME") : chrome.i18n.getMessage("DEFAULT_FILENAME")
};
gdocs.UploadStatus = function(a, b, c, d, e, f, g, h) {
    this.dataSource_ = a;
    this.state_ = b;
    this.errorMsg_ = c || "";
    this.sentBytes_ = d || 0;
    this.openUrl_ = e || "";
    this.title_ = f || "";
    this.docId_ = g || "";
    this.iconUrl_ = h || ""
};
gdocs.UploadStatus.StatusResponse = {CANCEL: "cancel", PROCEED: "proceed"};
gdocs.UploadStatus.State = {FAILURE: "failure", IN_PROGRESS: "inProgress", SUCCESS: "success"};
gdocs.UploadStatus.prototype.getDataSource = function() {
    return this.dataSource_
};
gdocs.UploadStatus.prototype.getErrorMsg = function() {
    return this.errorMsg_
};
gdocs.UploadStatus.prototype.getSentBytes = function() {
    return this.sentBytes_
};
gdocs.UploadStatus.prototype.getOpenUrl = function() {
    return this.openUrl_
};
gdocs.UploadStatus.prototype.getTitle = function() {
    return this.title_
};
gdocs.UploadStatus.prototype.getDocId = function() {
    return this.docId_
};
gdocs.UploadStatus.prototype.getIconUrl = function() {
    return this.iconUrl_
};
gdocs.UploadStatus.prototype.getUploadRatio = function() {
    return 0 == this.sentBytes_ ? 0 : this.sentBytes_ / this.dataSource_.getSize()
};
gdocs.UploadStatus.prototype.isComplete = function() {
    return this.state_ != gdocs.UploadStatus.State.IN_PROGRESS
};
gdocs.UploadStatus.prototype.isSuccess = function() {
    return this.state_ == gdocs.UploadStatus.State.SUCCESS
};
gdocs.ResumableUploader = function(a, b, c, d, e, f) {
    this.client_ = a;
    this.dataSource_ = b;
    this.folderInfo_ = c;
    this.chunkSize_ = d;
    this.extraHeaders_ = e || {};
    this.callback_ = f;
    this.uploadUrl_ = ""
};
gdocs.ResumableUploader.RANGE_END_ = /\d+-(\d+)/;
gdocs.ResumableUploader.prototype.startResumableUpload = function(a) {
    a = this.patchContentType_(a);
    var b = gdocs.DocList.addHeaders({"X-Upload-Content-Type": a, "X-Upload-Content-Length": this.dataSource_.getSize()}), c;
    for (c in this.extraHeaders_) b[c] = this.extraHeaders_[c];
    this.dataSource_.getDriveFilename();
    c = {uploadType: "resumable"};
    this.dataSource_.shouldConvert() && (c.convert = !0);
    var d = {title: this.dataSource_.getDriveFilename()};
    this.folderInfo_ && (d.parents = [{kind: "drive#fileLink", id: this.folderInfo_.folderId}]);
    gdlog.info("ResumableUploader.sendFirstPost", "Starting upload. headers:" + gdlog.prettyPrint(b) + "\nparams:" + gdlog.prettyPrint(c) + "\nJSON:" + gdlog.prettyPrint(d));
    this.client_.sendRequestJson("POST", gdocs.DocList.Feed.UPLOAD, c, b, d, goog.bind(this.handleFirstResponse_, this, a), goog.bind(this.handleRequestFailure_, this), [gdocs.HttpStatus.OK])
};
gdocs.ResumableUploader.prototype.handleFirstResponse_ = function(a, b) {
    if (b.status != gdocs.HttpStatus.OK) {
        var c = gdocs.msgutil.createXhrErrMsg(b);
        gdlog.info("ResumableUploader.handleFirstResponse", "responseText:" + b.responseText + " errMsg:" + c);
        this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, c))
    } else this.uploadUrl_ = b.getResponseHeader("Location"), this.sendUploadRequest_(0, a)
};
gdocs.ResumableUploader.prototype.handleUploadResponse_ = function(a, b) {
    if (b.status == gdocs.HttpStatus.CREATED || b.status == gdocs.HttpStatus.OK) this.handleCreated_(b); else {
        goog.asserts.assert(b.status == gdocs.HttpStatus.RESUME_INCOMPLETE);
        var c = b.getResponseHeader("Range");
        goog.isDefAndNotNull(c) ? (c = c ? Number(c.match(gdocs.ResumableUploader.RANGE_END_)[1]) + 1 : 0, this.sendUploadRequest_(c, a)) : (gdlog.info("ResumableUploader.handleResponse", "No Range respose. url:" + this.uploadUrl_ + " errMsg:No Range response in header"),
            this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, "No Range response in header")))
    }
};
gdocs.ResumableUploader.prototype.handleRequestFailure_ = function(a) {
    this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, a))
};
gdocs.ResumableUploader.prototype.sendUploadRequest_ = function(a, b) {
    var c = this.dataSource_.getSize(), d = Math.min(c, a + this.chunkSize_) - 1,
        e = new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.IN_PROGRESS, null, Math.max(0, a - 1));
    (e = this.callback_(null, e)) && e == gdocs.UploadStatus.StatusResponse.CANCEL ? (d = chrome.i18n.getMessage("UPLOAD_CANCELED"), this.callback_(null, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.FAILURE, d))) : (c = {
        "Content-Type": b, "Content-Range": "bytes " + a + "-" +
        d + "/" + c
    }, d = this.dataSource_.getData(a, d + 1), gdlog.info("ResumableUploader.handleResponse", "Sending " + c["Content-Range"]), this.client_.sendRequest("PUT", this.uploadUrl_, null, c, d, goog.bind(this.handleUploadResponse_, this, b), goog.bind(this.handleRequestFailure_, this), [gdocs.HttpStatus.CREATED, gdocs.HttpStatus.OK, gdocs.HttpStatus.RESUME_INCOMPLETE]))
};
gdocs.ResumableUploader.prototype.handleCreated_ = function(a) {
    gdlog.info("ResumableUploader.handleCreated", "Completed with status:" + a.status);
    var b = JSON.parse(a.responseText);
    this.callback_(a.responseText, new gdocs.UploadStatus(this.dataSource_, gdocs.UploadStatus.State.SUCCESS, null, this.dataSource_.getSize(), b.alternateLink, b.title, b.id, b.iconLink))
};
gdocs.ResumableUploader.prototype.patchContentType_ = function(a) {
    var b = a;
    if (b) {
        var c = b.indexOf(";");
        0 <= c && (b = b.substring(0, c));
        b = b.toLowerCase();
        0 == b.indexOf(gdocs.MimeType.X_PDF) && (b = gdocs.MimeType.PDF)
    } else b = gdocs.MimeType.OCTET_STREAM;
    b != a && gdlog.info("ResumableUploader.patchContentType", "Changing Content-Type from " + a + " to " + b);
    return b
};
gdocs.Uploader = function(a, b, c, d) {
    this.client_ = a;
    this.uploadPage_ = b;
    this.uploadParams_ = this.uploadPage_.getUploadParams();
    this.dataSource_ = c;
    this.folderInfo_ = d;
    this.startPercent_ = this.uploadParams_.isUploadOnly() ? 0 : 50
};
gdocs.Uploader.UPLOAD_CHUNK_SIZE_ = 262144;
gdocs.Uploader.prototype.startUploadWhenReady = function() {
    this.uploadDataSourceWhenReady_(this.dataSource_)
};
gdocs.Uploader.prototype.uploadDataSourceWhenReady_ = function(a) {
    var b = new gdocs.ResumableUploader(this.client_, a, this.folderInfo_, gdocs.Uploader.UPLOAD_CHUNK_SIZE_, this.uploadParams_.createImpressionHeader(), goog.bind(this.uploadCallback_, this, a));
    a.startWhenReady(b)
};
gdocs.Uploader.prototype.uploadCallback_ = function(a, b, c) {
    this.setStartFileMsg_(a.getDriveFilename());
    a = this.uploadPage_.isCancel() ? gdocs.UploadStatus.StatusResponse.CANCEL : gdocs.UploadStatus.StatusResponse.PROCEED;
    if (!c.isComplete()) return c = c.getUploadRatio(), this.uploadPage_.setPercent(this.startPercent_ + (100 - this.startPercent_) * c), a;
    if (!c.isSuccess()) return c = chrome.i18n.getMessage("UPLOAD_FAILURE", [c.getErrorMsg()]), this.uploadPage_.fatal(c, !1), a;
    this.uploadPage_.showFinished(c);
    return a
};
gdocs.Uploader.prototype.setStartFileMsg_ = function(a) {
    this.uploadPage_.setPercent(this.startPercent_);
    a = this.uploadParams_.isUploadOnly() ? chrome.i18n.getMessage("UPLOADING", a) : chrome.i18n.getMessage("SAVING", a);
    this.uploadPage_.updateProgressText(a)
};
gdocs.UploadPage = function(a, b) {
    this.resizeWindow_(gdocs.global.SAVE_DIALOG_SIZE);
    this.client_ = a;
    this.docList_ = new gdocs.DocList(a);
    this.uploadParams_ = b;
    this.uploadStatus_ = null;
    this.destFolderName_ = this.lastFilename_ = "";
    this.progressContainerEl_ = gdocs.domUtil.getHtmlElementByIdAssert("progress-container");
    this.resultsContainerEl_ = gdocs.domUtil.getHtmlElementByIdAssert("results-container");
    this.renameContainerEl_ = gdocs.domUtil.getHtmlElementByIdAssert("rename-container");
    this.errorContainerEl_ = gdocs.domUtil.getHtmlElementByIdAssert("error-container");
    this.userIdEl_ = gdocs.domUtil.getHtmlElementByIdAssert("user-id");
    this.progressTextEl_ = gdocs.domUtil.getHtmlElementByIdAssert("progress-text");
    this.percentEl_ = gdocs.domUtil.getHtmlElementByIdAssert("percent");
    this.uploadProgressEl_ = gdocs.domUtil.getHtmlElementByIdAssert("upload-progress");
    this.fileIconEl_ = gdocs.domUtil.getHtmlElementByIdAssert("file-icon");
    this.resultsTextEl_ = gdocs.domUtil.getHtmlElementByIdAssert("results-text");
    this.errorTextEl_ = gdocs.domUtil.getHtmlElementByIdAssert("error-text");
    this.renameInputEl_ = gdocs.domUtil.getHtmlElementByIdAssert("rename-input");
    this.renameInputEl_.addEventListener("keyup", goog.bind(this.handleRenameInputChanged_, this), !1);
    this.cancelButtonEl_ = this.setupDivButton_("cancel-button", chrome.i18n.getMessage("CANCEL"), goog.bind(this.handleCancel_, this));
    this.applyButtonEl_ = this.setupDivButton_("apply-button", chrome.i18n.getMessage("APPLY"), goog.bind(this.handleApply_, this));
    this.closeButtonEl_ = this.setupDivButton_("close-button", chrome.i18n.getMessage("CLOSE"),
        goog.bind(this.handleClose_, this));
    this.renameButtonEl_ = this.setupDivButton_("rename-button", chrome.i18n.getMessage("RENAME"), goog.bind(this.handleRename_, this));
    this.trashButtonEl_ = this.setupDivButton_("trash-button", chrome.i18n.getMessage("TRASH"), goog.bind(this.trash_, this));
    this.currentContainerEl_ = this.progressContainerEl_;
    this.cancel_ = !1;
    gdocs.domUtil.setTextContentId("dialog-title", chrome.i18n.getMessage("CHROME_EXTENSION_NAME"));
    gdocs.domUtil.setTextContentId("product-name", chrome.i18n.getMessage("GOOGLE_DRIVE"));
    gdocs.domUtil.setTextContentId("rename-text", chrome.i18n.getMessage("RENAME_PROMPT"));
    window.addEventListener("keyup", goog.bind(this.handleDialogKeyUp_, this), !1)
};
gdocs.UploadPage.keyCodes_ = {ENTER: 13, ESCAPE: 27, SPACE: 32};
gdocs.UploadPage.GOOGLE_DRIVE_ROOT_URL_ = "https://drive.google.com/";
gdocs.UploadPage.JFK_BUTTON_DISABLED_CLASS_ = "jfk-button-disabled";
gdocs.UploadPage.prototype.getUploadParams = function() {
    return this.uploadParams_
};
gdocs.UploadPage.prototype.startLoading = function(a) {
    a.getUserId().getUserIdStr(goog.bind(this.setUserId_, this, a))
};
gdocs.UploadPage.prototype.isCancel = function() {
    return this.cancel_
};
gdocs.UploadPage.prototype.clearCancel = function() {
    this.cancel_ = !1;
    this.setButtonState_(this.cancelButtonEl_, !0)
};
gdocs.UploadPage.prototype.setupDivButton_ = function(a, b, c) {
    var d = gdocs.domUtil.getHtmlElementByIdAssert(a);
    gdocs.domUtil.setTextContent(d, b);
    d.addEventListener("click", function(a) {
        d.classList.contains(gdocs.UploadPage.JFK_BUTTON_DISABLED_CLASS_) || c()
    }, !1);
    d.addEventListener("keyup", function(a) {
        gdocs.UploadPage.isApply_(a) && (d.classList.contains(gdocs.UploadPage.JFK_BUTTON_DISABLED_CLASS_) || c())
    }, !1);
    return d
};
gdocs.UploadPage.prototype.setButtonState_ = function(a, b) {
    b ? a.classList.remove(gdocs.UploadPage.JFK_BUTTON_DISABLED_CLASS_) : a.classList.add(gdocs.UploadPage.JFK_BUTTON_DISABLED_CLASS_)
};
gdocs.UploadPage.prototype.setUserId_ = function(a, b) {
    gdocs.domUtil.setTextContent(this.userIdEl_, b);
    var c = a.getOptions().getDestFolderInfo(b);
    this.destFolderName_ = c ? c.folderName : chrome.i18n.getMessage("MY_DRIVE");
    (new gdocs.Uploader(this.client_, this, this.createDataSource(), c)).startUploadWhenReady()
};
gdocs.UploadPage.prototype.handleDialogKeyUp_ = function(a) {
    a.keyCode == gdocs.UploadPage.keyCodes_.ESCAPE && this.handleClose_()
};
gdocs.UploadPage.prototype.handleRenameInputChanged_ = function(a) {
    var b = 0 < this.renameInputEl_.value.length && this.renameInputEl_.value != this.lastFilename_;
    this.setButtonState_(this.applyButtonEl_, b);
    b && a.keyCode == gdocs.UploadPage.keyCodes_.ENTER && this.handleApply_()
};
gdocs.UploadPage.isApply_ = function(a) {
    return a.keyCode == gdocs.UploadPage.keyCodes_.ENTER || a.keyCode == gdocs.UploadPage.keyCodes_.SPACE
};
gdocs.UploadPage.prototype.handleApply_ = function() {
    this.setButtonState_(this.applyButtonEl_, !1);
    var a = this.renameInputEl_.value.replace(/^\s+|\s+$/, "");
    this.docList_.renameFile(a, this.uploadStatus_.getDocId(), goog.bind(this.handleRenameFileSuccess_, this), goog.bind(this.handleRenameFileFailure_, this))
};
gdocs.UploadPage.prototype.handleRenameFileSuccess_ = function(a) {
    this.lastFilename_ = JSON.parse(a.responseText).title;
    this.setFinalResults_();
    gdocs.domUtil.hideElem(this.applyButtonEl_, this.cancelButtonEl_);
    gdocs.domUtil.showElem(this.closeButtonEl_, this.renameButtonEl_, this.trashButtonEl_);
    this.display_(this.resultsContainerEl_)
};
gdocs.UploadPage.prototype.handleRenameFileFailure_ = function(a) {
    this.setButtonState_(this.applyButtonEl_, !0);
    this.displayErrorMsg_(a)
};
gdocs.UploadPage.prototype.displayErrorMsg_ = function(a) {
    gdocs.domUtil.setTextContent(this.errorTextEl_, a);
    this.display_(this.errorContainerEl_)
};
gdocs.UploadPage.prototype.displayErrorMsgHtml_ = function(a) {
    this.errorContainerEl_.innerHTML = a;
    this.display_(this.errorContainerEl_)
};
gdocs.UploadPage.prototype.updateProgressText = function(a) {
    gdocs.domUtil.setTextContent(this.progressTextEl_, a);
    this.display_(this.progressContainerEl_)
};
gdocs.UploadPage.prototype.setPercent = function(a) {
    a = String(Math.floor(a));
    this.uploadProgressEl_.value = a;
    gdocs.domUtil.setTextContent(this.percentEl_, chrome.i18n.getMessage("PERCENT", a))
};
gdocs.UploadPage.prototype.fatal = function(a, b) {
    b ? this.displayErrorMsgHtml_(a) : this.displayErrorMsg_(a);
    gdocs.domUtil.hideElem(this.cancelButtonEl_);
    gdocs.domUtil.showElem(this.closeButtonEl_)
};
gdocs.UploadPage.prototype.showFinished = function(a) {
    this.uploadStatus_ = a;
    this.lastFilename_ = a.getTitle();
    this.setFinalResults_();
    gdocs.domUtil.showElem(this.renameButtonEl_, this.trashButtonEl_);
    gdocs.domUtil.hideElem(this.cancelButtonEl_);
    gdocs.domUtil.showElem(this.closeButtonEl_);
    this.display_(this.resultsContainerEl_)
};
gdocs.UploadPage.prototype.setFinalResults_ = function() {
    this.fileIconEl_.src = this.uploadStatus_.getIconUrl();
    this.resultsTextEl_.innerHTML = chrome.i18n.getMessage("FILE_WAS_SAVED", ["file-link", this.uploadStatus_.getOpenUrl(), "docs-link", this.createDocListUrl_(), "change-text", chrome.extension.getURL("options.html")]);
    this.setupLink_("file-link", this.lastFilename_);
    this.setupLink_("docs-link", this.destFolderName_);
    this.addCloseFromLinkHandler_(gdocs.domUtil.getHtmlElementByIdAssert("change-text"))
};
gdocs.UploadPage.prototype.setupLink_ = function(a, b) {
    var c = document.getElementById(a);
    c ? (gdocs.domUtil.setTextContent(c, b), this.addCloseFromLinkHandler_(c)) : gdlog.warn("UploadPage.setupLink", 'Could not find Element with id: "' + a + '" for text:' + b)
};
gdocs.UploadPage.prototype.addCloseFromLinkHandler_ = function(a) {
    a.addEventListener("click", goog.bind(this.handleClose_, this), !1)
};
gdocs.UploadPage.prototype.createDocListUrl_ = function() {
    return goog.uri.utils.setFragmentEncoded(gdocs.UploadPage.GOOGLE_DRIVE_ROOT_URL_, "?action=locate&id=" + this.uploadStatus_.getDocId())
};
gdocs.UploadPage.prototype.handleCancel_ = function() {
    gdlog.info("UploadPage.handleCancel", "Cancel pressed. cancel:" + this.cancel_);
    this.currentContainerEl_ == this.renameContainerEl_ ? (gdocs.domUtil.hideElem(this.applyButtonEl_, this.cancelButtonEl_), gdocs.domUtil.showElem(this.closeButtonEl_, this.renameButtonEl_, this.trashButtonEl_), this.display_(this.resultsContainerEl_)) : (this.cancel_ = !0, this.setButtonState_(this.cancelButtonEl_, !1))
};
gdocs.UploadPage.prototype.handleClose_ = function() {
    this.cancel_ = !0;
    window.close()
};
gdocs.UploadPage.prototype.handleRename_ = function() {
    this.renameInputEl_.value = this.lastFilename_;
    this.display_(this.renameContainerEl_);
    gdocs.domUtil.hideElem(this.closeButtonEl_, this.renameButtonEl_, this.trashButtonEl_);
    gdocs.domUtil.showElem(this.applyButtonEl_, this.cancelButtonEl_);
    this.setButtonState_(this.applyButtonEl_, !1);
    this.renameInputEl_.focus();
    this.renameInputEl_.select();
    var a = this.lastFilename_.lastIndexOf(".");
    -1 != a && this.lastFilename_.length - (a + 1) <= gdocs.global.MAX_SUFFIX_LEN && (this.renameInputEl_.selectionEnd =
        a)
};
gdocs.UploadPage.prototype.display_ = function(a) {
    gdocs.domUtil.hideElem(this.currentContainerEl_);
    gdocs.domUtil.showElem(a);
    this.currentContainerEl_ = a
};
gdocs.UploadPage.prototype.trash_ = function() {
    this.setButtonState_(this.trashButtonEl_, !1);
    this.setButtonState_(this.renameButtonEl_, !1);
    this.docList_.trashFile(this.uploadStatus_.getDocId(), goog.bind(this.handleTrashSuccess_, this), goog.bind(this.handleTrashFailure_, this))
};
gdocs.UploadPage.prototype.handleTrashSuccess_ = function() {
    this.resultsTextEl_.innerHTML = chrome.i18n.getMessage("FILE_WAS_TRASHED", ["filename-text", "docs-link", gdocs.UploadPage.GOOGLE_DRIVE_ROOT_URL_]);
    gdocs.domUtil.setTextContentId("filename-text", this.lastFilename_);
    this.addCloseFromLinkHandler_(gdocs.domUtil.getHtmlElementByIdAssert("docs-link"));
    this.display_(this.resultsContainerEl_);
    gdocs.domUtil.hideElem(this.cancelButtonEl_, this.renameButtonEl_, this.trashButtonEl_)
};
gdocs.UploadPage.prototype.handleTrashFailure_ = function(a) {
    this.setButtonState_(this.trashButtonEl_, !0);
    this.setButtonState_(this.renameButtonEl_, !0);
    this.displayErrorMsg_(a)
};
gdocs.UploadPage.prototype.resizeWindow_ = function(a) {
    var b = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        c = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight, d = a.width - b, e = a.height - c;
    gdlog.info("UploadPage.resizeWindow", "Window innerWidthxHeight:" + b + "x" + c + " outerWidthxHeight:" + window.outerWidth + "x" + window.outerHeight + " size:" + a + " requires resizeWidthxHeight:" + d + "x" + e);
    if (d || e) window.resizeBy(d, e), gdlog.info("UploadPage.resizeWindow",
        "Consider adjusting navigator.platform:" + navigator.platform + " navigator.userAgent:" + navigator.userAgent)
};
gdocs.CaptureUploadPage = function(a, b) {
    gdocs.UploadPage.call(this, a, b)
};
goog.inherits(gdocs.CaptureUploadPage, gdocs.UploadPage);
gdocs.CaptureUploadPage.prototype.createDataSource = function() {
    var a = this.getUploadParams();
    a.getCapturer().setUploadPage(this);
    return new gdocs.CaptureDataSource(a.getCapturer())
};
gdocs.UrlDataSource = function(a) {
    gdocs.DataSource.call(this);
    this.urlDownloader_ = a
};
goog.inherits(gdocs.UrlDataSource, gdocs.DataSource);
gdocs.UrlDataSource.prototype.getDriveFilename = function() {
    return this.urlDownloader_.getFilename()
};
gdocs.UrlDataSource.prototype.startWhenReady = function(a) {
    this.urlDownloader_.hasFailed() || (null != this.urlDownloader_.getDownloadResults() ? a.startResumableUpload(this.getContentType()) : this.urlDownloader_.setResumableUploader(a))
};
gdocs.UrlDataSource.prototype.getContentType = function() {
    return this.urlDownloader_.getDownloadResults().getContentType()
};
gdocs.UrlDataSource.prototype.shouldConvert = function() {
    return this.urlDownloader_.getAllowConvert() && this.getContentType() in gdocs.data.CONVERTIBLE
};
gdocs.UrlDataSource.prototype.getSize = function() {
    return this.urlDownloader_.getDownloadResults().getBlobData().size
};
gdocs.UrlDataSource.prototype.getData = function(a, b) {
    return this.urlDownloader_.getDownloadResults().getBlobData().slice(a, b)
};
gdocs.UrlUploadPage = function(a, b) {
    gdocs.UploadPage.call(this, a, b)
};
goog.inherits(gdocs.UrlUploadPage, gdocs.UploadPage);
gdocs.UrlUploadPage.prototype.createDataSource = function() {
    var a = this.getUploadParams();
    a.getUrlDownloader().setUploadPage(this);
    return new gdocs.UrlDataSource(a.getUrlDownloader())
};
window.addEventListener("load", function() {
    var a = chrome.extension.getBackgroundPage().bg;
    gdlog.loglevel = a.getLogLevel();
    var b = a.getUploadParams();
    (b.getCapturer ? new gdocs.CaptureUploadPage(a.getClient(), b) : new gdocs.UrlUploadPage(a.getClient(), b)).startLoading(a)
}, !1);
