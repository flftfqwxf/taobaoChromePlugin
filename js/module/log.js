var gdlog = {};
// goog.exportSymbol("gdlog", gdlog);
gdlog.Level = {SEVERE: 1E3, WARNING: 900, INFO: 800, CONFIG: 700, FINE: 500, FINER: 400, FINEST: 300};
gdlog.ENABLE_DEBUG_FLAG = !1;
gdlog.DEFAULT_LEVEL_UNCOMPILED_ = gdlog.Level.INFO;
gdlog.DEFAULT_LEVEL_COMPILED_ = gdlog.Level.WARNING;
gdlog.loglevel = gdlog.ENABLE_DEBUG_FLAG ? gdlog.DEFAULT_LEVEL_UNCOMPILED_ : gdlog.DEFAULT_LEVEL_COMPILED_;
// goog.exportSymbol("gdlog.loglevel", gdlog.loglevel);
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
// goog.exportSymbol("gdlog.logwarn", gdlog.logwarn);
gdlog.loginfo = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.INFO, "INFO")
};
// goog.exportSymbol("gdlog.loginfo", gdlog.loginfo);
gdlog.logfine = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINE, "FINE")
};
// goog.exportSymbol("gdlog.logfine", gdlog.logfine);
gdlog.logfiner = function() {
    return gdlog.setLoggingLevel_(gdlog.Level.FINER, "FINER")
};
// goog.exportSymbol("gdlog.logfiner", gdlog.logfiner);
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
        var g = String(a[e]), f = g.length;
        f > c && (g = g.substr(0, c) + " ... (" + f + " bytes)");
        d[e] = g
    }
    return JSON.stringify(d, null, 2)
};
export default gdlog