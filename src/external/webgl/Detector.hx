package external.webgl;

@:enum abstract WebGLSupport(Int) {
	var SUPPORTED_AND_ENABLED = 0;
	var SUPPORTED_BUT_DISABLED = 1;
	var NOT_SUPPORTED = 2;
}

@:native("WebGLDetector")
extern class Detector {
	public static function detect():WebGLSupport;
}