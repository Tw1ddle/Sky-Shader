package external.particle;

import external.particle.Emitter;
import js.three.Mesh;
import js.three.Vector3;

@:native("SPE.Group")
extern class Group {
	var mesh:Mesh;
	function new(options:Dynamic):Void;
	function addEmitter(particleEmitter:Emitter):Group;
	function removeEmitter(emitter:Dynamic):Dynamic;
	function getFromPool():Emitter;
	function releaseIntoPool(emitter:Emitter):Group;
	function addPool(numEmitters:Float, emitterSettings:Dynamic, createNew:Bool):Group;
	function triggerPoolEmitter(numEmitters:Float, position:Vector3):Group;
	function tick(?dt:Float):Dynamic;
}