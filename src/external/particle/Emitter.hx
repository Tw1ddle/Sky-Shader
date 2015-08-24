package external.particle;

import js.three.Color;
import js.three.Vector3;

@:native("SPE.Emitter")
extern class Emitter {
	var particleCount:Float;
	var type:String;
	var position:Vector3;
	var positionSpread:Vector3;
	var radius:Float;
	var radiusSpread:Float;
	var radiusScale:Vector3;
	var radiusSpreadClamp:Float;
	var acceleration:Vector3;
	var accelerationSpread:Vector3;
	var velocity:Vector3;
	var velocitySpread:Vector3;
	var speed:Float;
	var speedSpread:Float;
	var sizeStart:Float;
	var sizeStartSpread:Float;
	var sizeEnd:Float;
	var sizeEndSpread:Float;
	var sizeMiddle:Float;
	var sizeMiddleSpread:Float;
	var angleStart:Float;
	var angleStartSpread:Float;
	var angleEnd:Float;
	var angleEndSpread:Float;
	var angleMiddle:Float;
	var angleMiddleSpread:Float;
	var angleAlignVelocity:Float;
	var colorStart:Vector3;
	var colorStartSpread:Color;
	var colorEnd:Color;
	var colorEndSpread:Color;
	var colorMiddle:Color;
	var colorMiddleSpread:Vector3;
	var opacityStart:Float;
	var opacityStartSpread:Float;
	var opacityEnd:Float;
	var opacityEndSpread:Float;
	var opacityMiddle:Float;
	var opacityMiddleSpread:Float;
	var duration:Float;
	var alive:Float;
	var isStatic:Float;
	var userData:Dynamic;
	function new(options:Dynamic):Void;
	function reset(force:Bool):Dynamic;
	function enable():Dynamic;
	function disable():Dynamic;
}