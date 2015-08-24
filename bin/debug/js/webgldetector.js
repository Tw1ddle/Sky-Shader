var WebGLSupport;
(function (WebGLSupport) {
    WebGLSupport[WebGLSupport["SUPPORTED_AND_ENABLED"] = 0] = "SUPPORTED_AND_ENABLED";
    WebGLSupport[WebGLSupport["SUPPORTED_BUT_DISABLED"] = 1] = "SUPPORTED_BUT_DISABLED";
    WebGLSupport[WebGLSupport["NOT_SUPPORTED"] = 2] = "NOT_SUPPORTED";
})(WebGLSupport || (WebGLSupport = {}));
var WebGLDetector = (function () {
    function WebGLDetector() {
    }
    WebGLDetector.detect = function () {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas");
            var names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
            for (var i = 0; i < 4; i++) {
                try {
                    var context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        return WebGLSupport.SUPPORTED_AND_ENABLED;
                    }
                }
                catch (e) { }
            }
            return WebGLSupport.SUPPORTED_BUT_DISABLED;
        }
        return WebGLSupport.NOT_SUPPORTED;
    };
    return WebGLDetector;
})();