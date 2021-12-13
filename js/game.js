(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {};
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() {
	this.dt = 0.0;
	this.lastAnimationTime = 0.0;
	this.worldScene = new THREE.Scene();
	this.sceneGUI = new dat.GUI({ autoPlace : true});
	this.shaderGUI = new dat.GUI({ autoPlace : true});
	this.guiItemCount = 0;
	window.onload = $bind(this,this.onWindowLoaded);
};
Main.__name__ = true;
Main.main = function() {
	var main = new Main();
};
Main.prototype = {
	onWindowLoaded: function() {
		this.gameAttachPoint = window.document.getElementById("game");
		var gameDiv = window.document.createElement("attach");
		this.gameAttachPoint.appendChild(gameDiv);
		var glSupported = WebGLDetector.detect();
		if(glSupported != 0) {
			var unsupportedInfo = window.document.createElement("div");
			unsupportedInfo.style.position = "absolute";
			unsupportedInfo.style.top = "10px";
			unsupportedInfo.style.width = "100%";
			unsupportedInfo.style.textAlign = "center";
			unsupportedInfo.style.color = "#ffffff";
			switch(glSupported) {
			case 1:
				unsupportedInfo.innerHTML = "Your browser supports WebGL, but the feature appears to be disabled. Click <a href=\"" + "https://github.com/Tw1ddle/Sky-Shader" + "\" target=\"_blank\">here for screenshots</a> instead.";
				break;
			case 2:
				unsupportedInfo.innerHTML = "Your browser does not support WebGL. Click <a href=\"" + "https://github.com/Tw1ddle/Sky-Shader" + "\" target=\"_blank\">here for screenshots</a> instead.";
				break;
			default:
				unsupportedInfo.innerHTML = "Could not detect WebGL support. Click <a href=\"" + "https://github.com/Tw1ddle/Sky-Shader" + "\" target=\"_blank\">here for screenshots</a> instead.";
			}
			gameDiv.appendChild(unsupportedInfo);
			return;
		}
		var credits = window.document.createElement("div");
		credits.style.position = "absolute";
		credits.style.bottom = "-70px";
		credits.style.width = "100%";
		credits.style.textAlign = "center";
		credits.style.color = "#333333";
		credits.innerHTML = "Created by <a href=" + "https://samcodes.co.uk/" + " target=\"_blank\">" + "Sam Twidale" + "</a> for Ludum Dare 33 using <a href=" + "https://haxe.org/" + " target=\"_blank\">Haxe</a> and <a href=" + "https://github.com/mrdoob/three.js/" + " target=\"_blank\">three.js</a>. Get the code <a href=" + "https://github.com/Tw1ddle/Sky-Shader" + " target=\"_blank\">here</a>.";
		gameDiv.appendChild(credits);
		this.renderer = new THREE.WebGLRenderer({ antialias : false});
		this.renderer.sortObjects = false;
		this.renderer.autoClear = false;
		this.renderer.setSize(1200,800);
		this.renderer.setClearColor(new THREE.Color(2236962));
		this.worldCamera = new THREE.PerspectiveCamera(30,1.5,0.5,2000000);
		this.skyEffectController = new shaders_SkyEffectController(this);
		var skyMaterial = new THREE.ShaderMaterial({ fragmentShader : shaders_SkyShader.fragmentShader, vertexShader : shaders_SkyShader.vertexShader, uniforms : shaders_SkyShader.uniforms, side : 1});
		var skyMesh = new THREE.Mesh(new THREE.SphereGeometry(450000,32,15),skyMaterial);
		this.worldScene.add(skyMesh);
		window.document.addEventListener("resize",function(event) {
		},false);
		window.document.addEventListener("contextmenu",function(event) {
			event.preventDefault();
		},true);
		this.addGUIItem(this.shaderGUI,this.skyEffectController,"Sky Shader");
		this.addGUIItem(this.sceneGUI,this.worldCamera,"World Camera");
		gameDiv.appendChild(this.renderer.domElement);
		window.requestAnimationFrame($bind(this,this.animate));
	}
	,animate: function(time) {
		this.dt = (time - this.lastAnimationTime) * 0.001;
		this.lastAnimationTime = time;
		this.renderer.clear();
		this.renderer.render(this.worldScene,this.worldCamera);
		window.requestAnimationFrame($bind(this,this.animate));
	}
	,setupGUI: function() {
		this.addGUIItem(this.shaderGUI,this.skyEffectController,"Sky Shader");
		this.addGUIItem(this.sceneGUI,this.worldCamera,"World Camera");
	}
	,addGUIItem: function(gui,object,tag) {
		if(gui == null || object == null) {
			return null;
		}
		var folder = null;
		if(tag != null) {
			folder = gui.addFolder(tag + " (" + this.guiItemCount++ + ")");
		} else {
			var name = Std.string(Reflect.field(object,"name"));
			if(name == null || name.length == 0) {
				folder = gui.addFolder("Item (" + this.guiItemCount++ + ")");
			} else {
				folder = gui.addFolder(Std.string(Reflect.getProperty(object,"name")) + " (" + this.guiItemCount++ + ")");
			}
		}
		if(((object) instanceof THREE.Object3D)) {
			var object3d = object;
			folder.add(object3d.position,"x",-5000.0,5000.0,2).listen();
			folder.add(object3d.position,"y",-5000.0,5000.0,2).listen();
			folder.add(object3d.position,"z",-20000.0,20000.0,2).listen();
			folder.add(object3d.rotation,"x",0.0,Math.PI * 2,0.1).listen();
			folder.add(object3d.rotation,"y",0.0,Math.PI * 2,0.1).listen();
			folder.add(object3d.rotation,"z",0.0,Math.PI * 2,0.1).listen();
			folder.add(object3d.scale,"x",0.0,10.0,0.1).listen();
			folder.add(object3d.scale,"y",0.0,10.0,0.1).listen();
			folder.add(object3d.scale,"z",0.0,10.0,0.1).listen();
		}
		if(((object) instanceof shaders_SkyEffectController)) {
			var controller = object;
			controller.addGUIItem(controller,gui);
		}
		return folder;
	}
	,__class__: Main
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) {
		return null;
	} else {
		var tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["get_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			return o[tmp]();
		} else {
			return o[field];
		}
	}
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	var tmp1;
	if(o.__properties__) {
		tmp = o.__properties__["set_" + field];
		tmp1 = tmp;
	} else {
		tmp1 = false;
	}
	if(tmp1) {
		o[tmp](value);
	} else {
		o[field] = value;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var Type = function() { };
Type.__name__ = true;
Type.createInstance = function(cl,args) {
	var ctor = Function.prototype.bind.apply(cl,[null].concat(args));
	return new (ctor);
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
	,__class__: haxe_Exception
	,__properties__: {get_native:"get_native"}
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	__class__: haxe_ValueException
});
var haxe_ds_ObjectMap = function() {
	this.h = { __keys__ : { }};
};
haxe_ds_ObjectMap.__name__ = true;
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) {
			return false;
		}
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__implements = function(o,iface) {
	return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_three_ArrayLike = {};
js_three_ArrayLike.get = function(this1,key) {
	return this1[key];
};
js_three_ArrayLike.arrayWrite = function(this1,k,v) {
	this1[k] = v;
	return v;
};
var motion_actuators_IGenericActuator = function() { };
motion_actuators_IGenericActuator.__name__ = true;
motion_actuators_IGenericActuator.__isInterface__ = true;
motion_actuators_IGenericActuator.prototype = {
	__class__: motion_actuators_IGenericActuator
};
var motion_actuators_GenericActuator = function(target,duration,properties) {
	this._autoVisible = true;
	this._delay = 0;
	this._reflect = false;
	this._repeat = 0;
	this._reverse = false;
	this._smartRotation = false;
	this._snapping = false;
	this.special = false;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	this._ease = motion_Actuate.defaultEase;
};
motion_actuators_GenericActuator.__name__ = true;
motion_actuators_GenericActuator.__interfaces__ = [motion_actuators_IGenericActuator];
motion_actuators_GenericActuator.prototype = {
	apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,i)) {
				this.target[i] = Reflect.field(this.properties,i);
			} else {
				Reflect.setProperty(this.target,i,Reflect.field(this.properties,i));
			}
		}
	}
	,autoVisible: function(value) {
		if(value == null) {
			value = true;
		}
		this._autoVisible = value;
		return this;
	}
	,callMethod: function(method,params) {
		if(params == null) {
			params = [];
		}
		return method.apply(method,params);
	}
	,change: function() {
		if(this._onUpdate != null) {
			var method = this._onUpdate;
			var params = this._onUpdateParams;
			if(params == null) {
				params = [];
			}
			method.apply(method,params);
		}
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) {
			sendEvent = true;
		}
		if(sendEvent) {
			this.change();
			if(this._onComplete != null) {
				var method = this._onComplete;
				var params = this._onCompleteParams;
				if(params == null) {
					params = [];
				}
				method.apply(method,params);
			}
		}
		motion_Actuate.unload(this);
	}
	,delay: function(duration) {
		this._delay = duration;
		return this;
	}
	,ease: function(easing) {
		this._ease = easing;
		return this;
	}
	,move: function() {
	}
	,onComplete: function(handler,parameters) {
		this._onComplete = handler;
		if(parameters == null) {
			this._onCompleteParams = [];
		} else {
			this._onCompleteParams = parameters;
		}
		if(this.duration == 0) {
			this.complete();
		}
		return this;
	}
	,onRepeat: function(handler,parameters) {
		this._onRepeat = handler;
		if(parameters == null) {
			this._onRepeatParams = [];
		} else {
			this._onRepeatParams = parameters;
		}
		return this;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) {
			this._onUpdateParams = [];
		} else {
			this._onUpdateParams = parameters;
		}
		return this;
	}
	,onPause: function(handler,parameters) {
		this._onPause = handler;
		if(parameters == null) {
			this._onPauseParams = [];
		} else {
			this._onPauseParams = parameters;
		}
		return this;
	}
	,onResume: function(handler,parameters) {
		this._onResume = handler;
		if(parameters == null) {
			this._onResumeParams = [];
		} else {
			this._onResumeParams = parameters;
		}
		return this;
	}
	,pause: function() {
		if(this._onPause != null) {
			var method = this._onPause;
			var params = this._onPauseParams;
			if(params == null) {
				params = [];
			}
			method.apply(method,params);
		}
	}
	,reflect: function(value) {
		if(value == null) {
			value = true;
		}
		this._reflect = value;
		this.special = true;
		return this;
	}
	,repeat: function(times) {
		if(times == null) {
			times = -1;
		}
		this._repeat = times;
		return this;
	}
	,resume: function() {
		if(this._onResume != null) {
			var method = this._onResume;
			var params = this._onResumeParams;
			if(params == null) {
				params = [];
			}
			method.apply(method,params);
		}
	}
	,reverse: function(value) {
		if(value == null) {
			value = true;
		}
		this._reverse = value;
		this.special = true;
		return this;
	}
	,smartRotation: function(value) {
		if(value == null) {
			value = true;
		}
		this._smartRotation = value;
		this.special = true;
		return this;
	}
	,snapping: function(value) {
		if(value == null) {
			value = true;
		}
		this._snapping = value;
		this.special = true;
		return this;
	}
	,stop: function(properties,complete,sendEvent) {
	}
	,__class__: motion_actuators_GenericActuator
};
var motion_actuators_SimpleActuator = function(target,duration,properties) {
	this.active = true;
	this.propertyDetails = [];
	this.sendChange = false;
	this.paused = false;
	this.cacheVisible = false;
	this.initialized = false;
	this.setVisible = false;
	this.toggleVisible = false;
	this.startTime = window.performance.now() / 1000;
	motion_actuators_GenericActuator.call(this,target,duration,properties);
	if(!motion_actuators_SimpleActuator.addedEvent) {
		motion_actuators_SimpleActuator.addedEvent = true;
		window.requestAnimationFrame(motion_actuators_SimpleActuator.stage_onEnterFrame);
	}
};
motion_actuators_SimpleActuator.__name__ = true;
motion_actuators_SimpleActuator.stage_onEnterFrame = function(deltaTime) {
	var currentTime = deltaTime / 1000;
	var actuator;
	var j = 0;
	var cleanup = false;
	var _g = 0;
	var _g1 = motion_actuators_SimpleActuator.actuatorsLength;
	while(_g < _g1) {
		var i = _g++;
		actuator = motion_actuators_SimpleActuator.actuators[j];
		if(actuator != null && actuator.active) {
			if(currentTime >= actuator.timeOffset) {
				actuator.update(currentTime);
			}
			++j;
		} else {
			motion_actuators_SimpleActuator.actuators.splice(j,1);
			--motion_actuators_SimpleActuator.actuatorsLength;
		}
	}
	window.requestAnimationFrame(motion_actuators_SimpleActuator.stage_onEnterFrame);
};
motion_actuators_SimpleActuator.__super__ = motion_actuators_GenericActuator;
motion_actuators_SimpleActuator.prototype = $extend(motion_actuators_GenericActuator.prototype,{
	apply: function() {
		motion_actuators_GenericActuator.prototype.apply.call(this);
		if(this.toggleVisible && Object.prototype.hasOwnProperty.call(this.properties,"alpha")) {
			var target = this.target;
			var value = null;
			if(Object.prototype.hasOwnProperty.call(target,"visible")) {
				value = Reflect.field(target,"visible");
			} else {
				value = Reflect.getProperty(target,"visible");
			}
			if(value != null) {
				var target = this.target;
				var value = Reflect.field(this.properties,"alpha") > 0;
				if(Object.prototype.hasOwnProperty.call(target,"visible")) {
					target["visible"] = value;
				} else {
					Reflect.setProperty(target,"visible",value);
				}
			}
		}
	}
	,autoVisible: function(value) {
		if(value == null) {
			value = true;
		}
		this._autoVisible = value;
		if(!value) {
			this.toggleVisible = false;
			if(this.setVisible) {
				var target = this.target;
				var value = this.cacheVisible;
				if(Object.prototype.hasOwnProperty.call(target,"visible")) {
					target["visible"] = value;
				} else {
					Reflect.setProperty(target,"visible",value);
				}
			}
		}
		return this;
	}
	,delay: function(duration) {
		this._delay = duration;
		this.timeOffset = this.startTime + duration;
		return this;
	}
	,getField: function(target,propertyName) {
		var value = null;
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) {
			value = Reflect.field(target,propertyName);
		} else {
			value = Reflect.getProperty(target,propertyName);
		}
		return value;
	}
	,initialize: function() {
		var details;
		var start;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var isField = true;
			if(Object.prototype.hasOwnProperty.call(this.target,i)) {
				start = Reflect.field(this.target,i);
			} else {
				isField = false;
				start = Reflect.getProperty(this.target,i);
			}
			if(typeof(start) == "number") {
				var target = this.properties;
				var value = null;
				if(Object.prototype.hasOwnProperty.call(target,i)) {
					value = Reflect.field(target,i);
				} else {
					value = Reflect.getProperty(target,i);
				}
				var value1 = value;
				if(start == null) {
					start = 0;
				}
				if(value1 == null) {
					value1 = 0;
				}
				details = new motion_actuators_PropertyDetails(this.target,i,start,value1 - start,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,move: function() {
		this.toggleVisible = Object.prototype.hasOwnProperty.call(this.properties,"alpha") && Object.prototype.hasOwnProperty.call(this.properties,"visible");
		var tmp;
		if(this.toggleVisible && this.properties.alpha != 0) {
			var target = this.target;
			var value = null;
			if(Object.prototype.hasOwnProperty.call(target,"visible")) {
				value = Reflect.field(target,"visible");
			} else {
				value = Reflect.getProperty(target,"visible");
			}
			tmp = !value;
		} else {
			tmp = false;
		}
		if(tmp) {
			this.setVisible = true;
			var target = this.target;
			var value = null;
			if(Object.prototype.hasOwnProperty.call(target,"visible")) {
				value = Reflect.field(target,"visible");
			} else {
				value = Reflect.getProperty(target,"visible");
			}
			this.cacheVisible = value;
			var target = this.target;
			var value = true;
			if(Object.prototype.hasOwnProperty.call(target,"visible")) {
				target["visible"] = value;
			} else {
				Reflect.setProperty(target,"visible",value);
			}
		}
		this.timeOffset = this.startTime;
		motion_actuators_SimpleActuator.actuators.push(this);
		++motion_actuators_SimpleActuator.actuatorsLength;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) {
			this._onUpdateParams = [];
		} else {
			this._onUpdateParams = parameters;
		}
		this.sendChange = true;
		return this;
	}
	,pause: function() {
		if(!this.paused) {
			this.paused = true;
			motion_actuators_GenericActuator.prototype.pause.call(this);
			this.pauseTime = window.performance.now() / 1000;
		}
	}
	,resume: function() {
		if(this.paused) {
			this.paused = false;
			this.timeOffset += (window.performance.now() - this.pauseTime) / 1000;
			motion_actuators_GenericActuator.prototype.resume.call(this);
		}
	}
	,setField: function(target,propertyName,value) {
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) {
			target[propertyName] = value;
		} else {
			Reflect.setProperty(target,propertyName,value);
		}
	}
	,setProperty: function(details,value) {
		if(details.isField) {
			details.target[details.propertyName] = value;
		} else {
			Reflect.setProperty(details.target,details.propertyName,value);
		}
	}
	,stop: function(properties,complete,sendEvent) {
		if(this.active) {
			if(properties == null) {
				this.active = false;
				if(complete) {
					this.apply();
				}
				this.complete(sendEvent);
				return;
			}
			var _g = 0;
			var _g1 = Reflect.fields(properties);
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(this.properties,i)) {
					this.active = false;
					if(complete) {
						this.apply();
					}
					this.complete(sendEvent);
					return;
				}
			}
		}
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var i;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) {
				tweenPosition = 1;
			}
			if(!this.initialized) {
				this.initialize();
			}
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g = 0;
				var _g1 = this.detailsLength;
				while(_g < _g1) {
					var i = _g++;
					details = this.propertyDetails[i];
					var value = details.start + details.change * easing;
					if(details.isField) {
						details.target[details.propertyName] = value;
					} else {
						Reflect.setProperty(details.target,details.propertyName,value);
					}
				}
			} else {
				if(!this._reverse) {
					easing = this._ease.calculate(tweenPosition);
				} else {
					easing = this._ease.calculate(1 - tweenPosition);
				}
				var endValue;
				var _g = 0;
				var _g1 = this.detailsLength;
				while(_g < _g1) {
					var i = _g++;
					details = this.propertyDetails[i];
					if(this._smartRotation && (details.propertyName == "rotation" || details.propertyName == "rotationX" || details.propertyName == "rotationY" || details.propertyName == "rotationZ")) {
						var rotation = details.change % 360;
						if(rotation > 180) {
							rotation -= 360;
						} else if(rotation < -180) {
							rotation += 360;
						}
						endValue = details.start + rotation * easing;
					} else {
						endValue = details.start + details.change * easing;
					}
					if(!this._snapping) {
						var value = endValue;
						if(details.isField) {
							details.target[details.propertyName] = value;
						} else {
							Reflect.setProperty(details.target,details.propertyName,value);
						}
					} else {
						var value1 = Math.round(endValue);
						if(details.isField) {
							details.target[details.propertyName] = value1;
						} else {
							Reflect.setProperty(details.target,details.propertyName,value1);
						}
					}
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					var tmp;
					if(this.toggleVisible) {
						var target = this.target;
						var value = null;
						if(Object.prototype.hasOwnProperty.call(target,"alpha")) {
							value = Reflect.field(target,"alpha");
						} else {
							value = Reflect.getProperty(target,"alpha");
						}
						tmp = value == 0;
					} else {
						tmp = false;
					}
					if(tmp) {
						var target = this.target;
						var value = false;
						if(Object.prototype.hasOwnProperty.call(target,"visible")) {
							target["visible"] = value;
						} else {
							Reflect.setProperty(target,"visible",value);
						}
					}
					this.complete(true);
					return;
				} else {
					if(this._onRepeat != null) {
						var method = this._onRepeat;
						var params = this._onRepeatParams;
						if(params == null) {
							params = [];
						}
						method.apply(method,params);
					}
					if(this._reflect) {
						this._reverse = !this._reverse;
					}
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) {
						this._repeat--;
					}
				}
			}
			if(this.sendChange) {
				this.change();
			}
		}
	}
	,__class__: motion_actuators_SimpleActuator
});
var motion_easing_IEasing = function() { };
motion_easing_IEasing.__name__ = true;
motion_easing_IEasing.__isInterface__ = true;
motion_easing_IEasing.prototype = {
	__class__: motion_easing_IEasing
};
var motion_easing__$Expo_ExpoEaseIn = function() {
};
motion_easing__$Expo_ExpoEaseIn.__name__ = true;
motion_easing__$Expo_ExpoEaseIn.__interfaces__ = [motion_easing_IEasing];
motion_easing__$Expo_ExpoEaseIn.prototype = {
	calculate: function(k) {
		if(k == 0) {
			return 0;
		} else {
			return Math.exp(6.931471805599453 * (k - 1));
		}
	}
	,ease: function(t,b,c,d) {
		if(t == 0) {
			return b;
		} else {
			return c * Math.exp(6.931471805599453 * (t / d - 1)) + b;
		}
	}
	,__class__: motion_easing__$Expo_ExpoEaseIn
};
var motion_easing__$Expo_ExpoEaseInOut = function() {
};
motion_easing__$Expo_ExpoEaseInOut.__name__ = true;
motion_easing__$Expo_ExpoEaseInOut.__interfaces__ = [motion_easing_IEasing];
motion_easing__$Expo_ExpoEaseInOut.prototype = {
	calculate: function(k) {
		if(k == 0) {
			return 0;
		}
		if(k == 1) {
			return 1;
		}
		if((k /= 0.5) < 1.0) {
			return 0.5 * Math.exp(6.931471805599453 * (k - 1));
		}
		return 0.5 * (2 - Math.exp(-6.931471805599453 * --k));
	}
	,ease: function(t,b,c,d) {
		if(t == 0) {
			return b;
		}
		if(t == d) {
			return b + c;
		}
		if((t /= d / 2.0) < 1.0) {
			return c / 2 * Math.exp(6.931471805599453 * (t - 1)) + b;
		}
		return c / 2 * (2 - Math.exp(-6.931471805599453 * --t)) + b;
	}
	,__class__: motion_easing__$Expo_ExpoEaseInOut
};
var motion_easing__$Expo_ExpoEaseOut = function() {
};
motion_easing__$Expo_ExpoEaseOut.__name__ = true;
motion_easing__$Expo_ExpoEaseOut.__interfaces__ = [motion_easing_IEasing];
motion_easing__$Expo_ExpoEaseOut.prototype = {
	calculate: function(k) {
		if(k == 1) {
			return 1;
		} else {
			return 1 - Math.exp(-6.931471805599453 * k);
		}
	}
	,ease: function(t,b,c,d) {
		if(t == d) {
			return b + c;
		} else {
			return c * (1 - Math.exp(-6.931471805599453 * t / d)) + b;
		}
	}
	,__class__: motion_easing__$Expo_ExpoEaseOut
};
var motion_easing_Expo = function() { };
motion_easing_Expo.__name__ = true;
var motion_Actuate = function() { };
motion_Actuate.__name__ = true;
motion_Actuate.apply = function(target,properties,customActuator) {
	motion_Actuate.stop(target,properties);
	if(customActuator == null) {
		customActuator = motion_Actuate.defaultActuator;
	}
	var actuator = Type.createInstance(customActuator,[target,0,properties]);
	actuator.apply();
	return actuator;
};
motion_Actuate.getLibrary = function(target,allowCreation) {
	if(allowCreation == null) {
		allowCreation = true;
	}
	if(motion_Actuate.targetLibraries.h.__keys__[target.__id__] == null && allowCreation) {
		motion_Actuate.targetLibraries.set(target,[]);
	}
	return motion_Actuate.targetLibraries.h[target.__id__];
};
motion_Actuate.isActive = function() {
	var result = false;
	var library = motion_Actuate.targetLibraries.iterator();
	while(library.hasNext()) {
		var library1 = library.next();
		result = true;
		break;
	}
	return result;
};
motion_Actuate.motionPath = function(target,duration,properties,overwrite) {
	if(overwrite == null) {
		overwrite = true;
	}
	return motion_Actuate.tween(target,duration,properties,overwrite,motion_actuators_MotionPathActuator);
};
motion_Actuate.pause = function(target) {
	if(js_Boot.__implements(target,motion_actuators_IGenericActuator)) {
		var actuator = target;
		actuator.pause();
	} else {
		var library = motion_Actuate.getLibrary(target,false);
		if(library != null) {
			var _g = 0;
			while(_g < library.length) {
				var actuator = library[_g];
				++_g;
				actuator.pause();
			}
		}
	}
};
motion_Actuate.pauseAll = function() {
	var library = motion_Actuate.targetLibraries.iterator();
	while(library.hasNext()) {
		var library1 = library.next();
		var _g = 0;
		while(_g < library1.length) {
			var actuator = library1[_g];
			++_g;
			actuator.pause();
		}
	}
};
motion_Actuate.reset = function() {
	var library = motion_Actuate.targetLibraries.iterator();
	while(library.hasNext()) {
		var library1 = library.next();
		var i = library1.length - 1;
		while(i >= 0) {
			library1[i].stop(null,false,false);
			--i;
		}
	}
	motion_Actuate.targetLibraries = new haxe_ds_ObjectMap();
};
motion_Actuate.resume = function(target) {
	if(js_Boot.__implements(target,motion_actuators_IGenericActuator)) {
		var actuator = target;
		actuator.resume();
	} else {
		var library = motion_Actuate.getLibrary(target,false);
		if(library != null) {
			var _g = 0;
			while(_g < library.length) {
				var actuator = library[_g];
				++_g;
				actuator.resume();
			}
		}
	}
};
motion_Actuate.resumeAll = function() {
	var library = motion_Actuate.targetLibraries.iterator();
	while(library.hasNext()) {
		var library1 = library.next();
		var _g = 0;
		while(_g < library1.length) {
			var actuator = library1[_g];
			++_g;
			actuator.resume();
		}
	}
};
motion_Actuate.stop = function(target,properties,complete,sendEvent) {
	if(sendEvent == null) {
		sendEvent = true;
	}
	if(complete == null) {
		complete = false;
	}
	if(target != null) {
		if(js_Boot.__implements(target,motion_actuators_IGenericActuator)) {
			var actuator = target;
			actuator.stop(null,complete,sendEvent);
		} else {
			var library = motion_Actuate.getLibrary(target,false);
			if(library != null) {
				if(typeof(properties) == "string") {
					var temp = { };
					temp[properties] = null;
					properties = temp;
				} else if(((properties) instanceof Array)) {
					var temp = { };
					var _g = 0;
					var _g1 = js_Boot.__cast(properties , Array);
					while(_g < _g1.length) {
						var property = _g1[_g];
						++_g;
						temp[property] = null;
					}
					properties = temp;
				}
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(properties,complete,sendEvent);
					--i;
				}
			}
		}
	}
};
motion_Actuate.timer = function(duration,customActuator) {
	return motion_Actuate.tween(new motion__$Actuate_TweenTimer(0),duration,new motion__$Actuate_TweenTimer(1),false,customActuator);
};
motion_Actuate.tween = function(target,duration,properties,overwrite,customActuator) {
	if(overwrite == null) {
		overwrite = true;
	}
	if(target != null) {
		if(duration > 0) {
			if(customActuator == null) {
				customActuator = motion_Actuate.defaultActuator;
			}
			var actuator = Type.createInstance(customActuator,[target,duration,properties]);
			var library = motion_Actuate.getLibrary(actuator.target);
			if(overwrite) {
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(actuator.properties,false,false);
					--i;
				}
				library = motion_Actuate.getLibrary(actuator.target);
			}
			library.push(actuator);
			actuator.move();
			return actuator;
		} else {
			return motion_Actuate.apply(target,properties,customActuator);
		}
	}
	return null;
};
motion_Actuate.unload = function(actuator) {
	var target = actuator.target;
	if(motion_Actuate.targetLibraries.h.__keys__[target.__id__] != null) {
		HxOverrides.remove(motion_Actuate.targetLibraries.h[target.__id__],actuator);
		if(motion_Actuate.targetLibraries.h[target.__id__].length == 0) {
			motion_Actuate.targetLibraries.remove(target);
		}
	}
};
motion_Actuate.update = function(target,duration,start,end,overwrite) {
	if(overwrite == null) {
		overwrite = true;
	}
	var properties = { start : start, end : end};
	return motion_Actuate.tween(target,duration,properties,overwrite,motion_actuators_MethodActuator);
};
var motion__$Actuate_TweenTimer = function(progress) {
	this.progress = progress;
};
motion__$Actuate_TweenTimer.__name__ = true;
motion__$Actuate_TweenTimer.prototype = {
	__class__: motion__$Actuate_TweenTimer
};
var motion_MotionPath = function() {
	this._x = new motion__$MotionPath_ComponentPath();
	this._y = new motion__$MotionPath_ComponentPath();
	this._rotation = null;
};
motion_MotionPath.__name__ = true;
motion_MotionPath.prototype = {
	bezier: function(x,y,controlX,controlY,strength) {
		if(strength == null) {
			strength = 1;
		}
		return this.bezierN(x,y,[controlX],[controlY],strength);
	}
	,bezierN: function(x,y,controlX,controlY,strength) {
		if(strength == null) {
			strength = 1;
		}
		this._x.addPath(new motion__$MotionPath_BezierPath(x,controlX,strength));
		this._y.addPath(new motion__$MotionPath_BezierPath(y,controlY,strength));
		return this;
	}
	,bezierSpline: function(x,y,strength) {
		if(strength == null) {
			strength = 1;
		}
		this._x.addPath(new motion__$MotionPath_BezierSplinePath(x,strength));
		this._y.addPath(new motion__$MotionPath_BezierSplinePath(y,strength));
		return this;
	}
	,line: function(x,y,strength) {
		if(strength == null) {
			strength = 1;
		}
		return this.bezierN(x,y,[],[],strength);
	}
	,get_rotation: function() {
		if(this._rotation == null) {
			this._rotation = new motion__$MotionPath_RotationPath(this._x,this._y);
		}
		return this._rotation;
	}
	,get_x: function() {
		return this._x;
	}
	,get_y: function() {
		return this._y;
	}
	,__class__: motion_MotionPath
	,__properties__: {get_y:"get_y",get_x:"get_x",get_rotation:"get_rotation"}
};
var motion_IComponentPath = function() { };
motion_IComponentPath.__name__ = true;
motion_IComponentPath.__isInterface__ = true;
motion_IComponentPath.prototype = {
	__class__: motion_IComponentPath
	,__properties__: {get_end:"get_end",set_start:"set_start",get_start:"get_start"}
};
var motion__$MotionPath_ComponentPath = function() {
	this.paths = [];
	this.strength = 0;
};
motion__$MotionPath_ComponentPath.__name__ = true;
motion__$MotionPath_ComponentPath.__interfaces__ = [motion_IComponentPath];
motion__$MotionPath_ComponentPath.prototype = {
	addPath: function(path) {
		if(this.paths.length > 0) {
			path.set_start(this.paths[this.paths.length - 1].get_end());
		}
		this.paths.push(path);
		this.strength += path.strength;
	}
	,calculate: function(k) {
		if(this.paths.length == 1) {
			return this.paths[0].calculate(k);
		} else {
			var ratio = k * this.strength;
			var _g = 0;
			var _g1 = this.paths;
			while(_g < _g1.length) {
				var path = _g1[_g];
				++_g;
				if(ratio > path.strength) {
					ratio -= path.strength;
				} else {
					return path.calculate(ratio / path.strength);
				}
			}
		}
		return 0;
	}
	,get_start: function() {
		if(this.paths.length > 0) {
			return this.paths[0].get_start();
		} else {
			return 0;
		}
	}
	,set_start: function(value) {
		if(this.paths.length > 0) {
			return this.paths[0].set_start(value);
		} else {
			return 0;
		}
	}
	,get_end: function() {
		if(this.paths.length > 0) {
			var path = this.paths[this.paths.length - 1];
			return path.get_end();
		} else {
			return this.get_start();
		}
	}
	,__class__: motion__$MotionPath_ComponentPath
	,__properties__: {get_end:"get_end",set_start:"set_start",get_start:"get_start"}
};
var motion__$MotionPath_BezierPath = function(end,control,strength) {
	this._end = end;
	this.control = control;
	this.strength = strength;
};
motion__$MotionPath_BezierPath.__name__ = true;
motion__$MotionPath_BezierPath.__interfaces__ = [motion_IComponentPath];
motion__$MotionPath_BezierPath.prototype = {
	calculate: function(k) {
		var l = 1 - k;
		switch(this.control.length) {
		case 0:
			return l * this._start + k * this._end;
		case 1:
			return l * l * this._start + 2 * l * k * this.control[0] + k * k * this._end;
		case 2:
			return l * l * l * this._start + 3 * l * l * k * this.control[0] + 3 * l * k * k * this.control[1] + k * k * k * this._end;
		default:
			if(l < 1e-7) {
				return this._end;
			}
			var r = k / l;
			var n = this.control.length + 1;
			var coeff = Math.pow(l,n);
			var res = coeff * this._start;
			var _g = 1;
			var _g1 = n;
			while(_g < _g1) {
				var i = _g++;
				coeff *= r * (n + 1 - i) / i;
				res += coeff * this.control[i - 1];
			}
			coeff *= r / n;
			return res + coeff * this._end;
		}
	}
	,get_start: function() {
		return this._start;
	}
	,set_start: function(value) {
		return this._start = value;
	}
	,get_end: function() {
		return this._end;
	}
	,__class__: motion__$MotionPath_BezierPath
	,__properties__: {get_end:"get_end",set_start:"set_start",get_start:"get_start"}
};
var motion__$MotionPath_BezierSplinePath = function(through,strength) {
	motion__$MotionPath_ComponentPath.call(this);
	this.through = through;
	this.strength = strength;
};
motion__$MotionPath_BezierSplinePath.__name__ = true;
motion__$MotionPath_BezierSplinePath.__super__ = motion__$MotionPath_ComponentPath;
motion__$MotionPath_BezierSplinePath.prototype = $extend(motion__$MotionPath_ComponentPath.prototype,{
	computeControlPoints: function(start) {
		var K = [start].concat(this.through);
		var n = K.length;
		var _g = [];
		var _g1 = 0;
		var _g2 = n;
		while(_g1 < _g2) {
			var _ = _g1++;
			_g.push([0.0,0.0]);
		}
		var control = _g;
		var a = [];
		var b = [];
		var c = [];
		var r = [];
		a[0] = 0;
		b[0] = 2;
		c[0] = 1;
		r[0] = K[0] + 2 * K[1];
		var _g = 1;
		var _g1 = n - 1;
		while(_g < _g1) {
			var i = _g++;
			a[i] = 1;
			b[i] = 4;
			c[i] = 1;
			r[i] = 4 * K[i] + 2 * K[i + 1];
		}
		a[n - 1] = 1;
		b[n - 1] = 2;
		c[n - 1] = 0;
		r[n - 1] = 3 * K[n - 1];
		var _g = 1;
		var _g1 = n;
		while(_g < _g1) {
			var i = _g++;
			var m = a[i] / b[i - 1];
			b[i] -= m * c[i - 1];
			r[i] -= m * r[i - 1];
		}
		control[n - 1][0] = r[n - 1] / b[n - 1];
		var i = n - 2;
		while(i >= 0) {
			control[i][0] = (r[i] - c[i] * control[i + 1][0]) / b[i];
			--i;
		}
		var _g = 0;
		var _g1 = n - 1;
		while(_g < _g1) {
			var i = _g++;
			control[i][1] = 2 * K[i + 1] - control[i + 1][0];
		}
		control[n - 1][1] = 0.5 * (K[n] + control[n - 1][0]);
		control.pop();
		return control;
	}
	,set_start: function(value) {
		if(this.paths.length == 0 || Math.abs(value - this.get_start()) > 1e-7) {
			var control = this.computeControlPoints(value);
			var pathStrength = this.strength / control.length;
			this.strength = 0;
			this.paths.splice(0,this.paths.length);
			var _g = 0;
			var _g1 = control.length;
			while(_g < _g1) {
				var i = _g++;
				this.addPath(new motion__$MotionPath_BezierPath(this.through[i],control[i],pathStrength));
			}
		}
		return motion__$MotionPath_ComponentPath.prototype.set_start.call(this,value);
	}
	,get_end: function() {
		return this.through[this.through.length - 1];
	}
	,__class__: motion__$MotionPath_BezierSplinePath
});
var motion__$MotionPath_RotationPath = function(x,y) {
	this.step = 0.01;
	this._x = x;
	this._y = y;
	this.offset = 0;
	this.set_start(this.calculate(0.0));
};
motion__$MotionPath_RotationPath.__name__ = true;
motion__$MotionPath_RotationPath.__interfaces__ = [motion_IComponentPath];
motion__$MotionPath_RotationPath.prototype = {
	calculate: function(k) {
		var dX = this._x.calculate(k) - this._x.calculate(k + this.step);
		var dY = this._y.calculate(k) - this._y.calculate(k + this.step);
		var angle = Math.atan2(dY,dX) * (180 / Math.PI);
		angle = (angle + this.offset) % 360;
		return angle;
	}
	,get_start: function() {
		return this._start;
	}
	,set_start: function(value) {
		return this._start;
	}
	,get_end: function() {
		return this.calculate(1.0);
	}
	,__class__: motion__$MotionPath_RotationPath
	,__properties__: {set_start:"set_start",get_start:"get_start",get_end:"get_end"}
};
var motion_actuators_MethodActuator = function(target,duration,properties) {
	this.currentParameters = [];
	this.tweenProperties = { };
	motion_actuators_SimpleActuator.call(this,target,duration,properties);
	if(!Object.prototype.hasOwnProperty.call(properties,"start")) {
		this.properties.start = [];
	}
	if(!Object.prototype.hasOwnProperty.call(properties,"end")) {
		this.properties.end = this.properties.start;
	}
	var _g = 0;
	var _g1 = this.properties.start.length;
	while(_g < _g1) {
		var i = _g++;
		this.currentParameters.push(this.properties.start[i]);
	}
};
motion_actuators_MethodActuator.__name__ = true;
motion_actuators_MethodActuator.__super__ = motion_actuators_SimpleActuator;
motion_actuators_MethodActuator.prototype = $extend(motion_actuators_SimpleActuator.prototype,{
	apply: function() {
		var method = this.target;
		var params = this.properties.end;
		if(params == null) {
			params = [];
		}
		method.apply(method,params);
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) {
			sendEvent = true;
		}
		var _g = 0;
		var _g1 = this.properties.start.length;
		while(_g < _g1) {
			var i = _g++;
			this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
		}
		var method = this.target;
		var params = this.currentParameters;
		if(params == null) {
			params = [];
		}
		method.apply(method,params);
		motion_actuators_SimpleActuator.prototype.complete.call(this,sendEvent);
	}
	,initialize: function() {
		var details;
		var propertyName;
		var start;
		var _g = 0;
		var _g1 = this.properties.start.length;
		while(_g < _g1) {
			var i = _g++;
			propertyName = "param" + i;
			start = this.properties.start[i];
			this.tweenProperties[propertyName] = start;
			if(typeof(start) == "number" || typeof(start) == "number" && ((start | 0) === start)) {
				details = new motion_actuators_PropertyDetails(this.tweenProperties,propertyName,start,this.properties.end[i] - start);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		motion_actuators_SimpleActuator.prototype.update.call(this,currentTime);
		if(this.active && !this.paused) {
			var _g = 0;
			var _g1 = this.properties.start.length;
			while(_g < _g1) {
				var i = _g++;
				this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
			}
			var method = this.target;
			var params = this.currentParameters;
			if(params == null) {
				params = [];
			}
			method.apply(method,params);
		}
	}
	,__class__: motion_actuators_MethodActuator
});
var motion_actuators_MotionPathActuator = function(target,duration,properties) {
	motion_actuators_SimpleActuator.call(this,target,duration,properties);
};
motion_actuators_MotionPathActuator.__name__ = true;
motion_actuators_MotionPathActuator.__super__ = motion_actuators_SimpleActuator;
motion_actuators_MotionPathActuator.prototype = $extend(motion_actuators_SimpleActuator.prototype,{
	apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) {
				this.target[propertyName] = (js_Boot.__cast(Reflect.field(this.properties,propertyName) , motion_IComponentPath)).get_end();
			} else {
				Reflect.setProperty(this.target,propertyName,(js_Boot.__cast(Reflect.field(this.properties,propertyName) , motion_IComponentPath)).get_end());
			}
		}
	}
	,initialize: function() {
		var details;
		var path;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			path = js_Boot.__cast(Reflect.field(this.properties,propertyName) , motion_IComponentPath);
			if(path != null) {
				var isField = true;
				if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) {
					path.set_start(Reflect.field(this.target,propertyName));
				} else {
					isField = false;
					path.set_start(Reflect.getProperty(this.target,propertyName));
				}
				details = new motion_actuators_PropertyPathDetails(this.target,propertyName,path,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) {
				tweenPosition = 1;
			}
			if(!this.initialized) {
				this.initialize();
			}
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g = 0;
				var _g1 = this.propertyDetails;
				while(_g < _g1.length) {
					var details = _g1[_g];
					++_g;
					if(details.isField) {
						details.target[details.propertyName] = (js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing);
					} else {
						Reflect.setProperty(details.target,details.propertyName,(js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing));
					}
				}
			} else {
				if(!this._reverse) {
					easing = this._ease.calculate(tweenPosition);
				} else {
					easing = this._ease.calculate(1 - tweenPosition);
				}
				var endValue;
				var _g = 0;
				var _g1 = this.propertyDetails;
				while(_g < _g1.length) {
					var details = _g1[_g];
					++_g;
					if(!this._snapping) {
						if(details.isField) {
							details.target[details.propertyName] = (js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing);
						} else {
							Reflect.setProperty(details.target,details.propertyName,(js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing));
						}
					} else if(details.isField) {
						details.target[details.propertyName] = Math.round((js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing));
					} else {
						Reflect.setProperty(details.target,details.propertyName,Math.round((js_Boot.__cast(details , motion_actuators_PropertyPathDetails)).path.calculate(easing)));
					}
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					var tmp;
					if(this.toggleVisible) {
						var target = this.target;
						var value = null;
						if(Object.prototype.hasOwnProperty.call(target,"alpha")) {
							value = Reflect.field(target,"alpha");
						} else {
							value = Reflect.getProperty(target,"alpha");
						}
						tmp = value == 0;
					} else {
						tmp = false;
					}
					if(tmp) {
						var target = this.target;
						var value = false;
						if(Object.prototype.hasOwnProperty.call(target,"visible")) {
							target["visible"] = value;
						} else {
							Reflect.setProperty(target,"visible",value);
						}
					}
					this.complete(true);
					return;
				} else {
					if(this._onRepeat != null) {
						var method = this._onRepeat;
						var params = this._onRepeatParams;
						if(params == null) {
							params = [];
						}
						method.apply(method,params);
					}
					if(this._reflect) {
						this._reverse = !this._reverse;
					}
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) {
						this._repeat--;
					}
				}
			}
			if(this.sendChange) {
				this.change();
			}
		}
	}
	,__class__: motion_actuators_MotionPathActuator
});
var motion_actuators_PropertyDetails = function(target,propertyName,start,change,isField) {
	if(isField == null) {
		isField = true;
	}
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.change = change;
	this.isField = isField;
};
motion_actuators_PropertyDetails.__name__ = true;
motion_actuators_PropertyDetails.prototype = {
	__class__: motion_actuators_PropertyDetails
};
var motion_actuators_PropertyPathDetails = function(target,propertyName,path,isField) {
	if(isField == null) {
		isField = true;
	}
	motion_actuators_PropertyDetails.call(this,target,propertyName,0,0,isField);
	this.path = path;
};
motion_actuators_PropertyPathDetails.__name__ = true;
motion_actuators_PropertyPathDetails.__super__ = motion_actuators_PropertyDetails;
motion_actuators_PropertyPathDetails.prototype = $extend(motion_actuators_PropertyDetails.prototype,{
	__class__: motion_actuators_PropertyPathDetails
});
var shaders_SkyShader = function() { };
shaders_SkyShader.__name__ = true;
var shaders_SkyEffectController = function(main) {
	this.mieKCoefficient = new THREE.Vector3();
	this.primaries = new THREE.Vector3();
	this.cameraPos = new THREE.Vector3();
	this.sunPosition = new THREE.Vector3();
	this.main = main;
	this.sunPosition.set(0,-700000,0);
	this.cameraPos.set(100000.0,-40000.0,0.0);
	this.turbidity = 2.0;
	this.rayleigh = 1.0;
	this.mieCoefficient = 0.005;
	this.mieDirectionalG = 0.8;
	this.luminance = 1.0;
	this.inclination = 0.49;
	this.azimuth = 0.25;
	this.refractiveIndex = 1.0003;
	this.numMolecules = 2.542e25;
	this.depolarizationFactor = 0.035;
	this.primaries.set(6.8e-7,5.5e-7,4.5e-7);
	this.mieKCoefficient.set(0.686,0.678,0.666);
	this.mieV = 4.0;
	this.rayleighZenithLength = 8.4e3;
	this.mieZenithLength = 1.25e3;
	this.sunIntensityFactor = 1000.0;
	this.sunIntensityFalloffSteepness = 1.5;
	this.sunAngularDiameterDegrees = 0.0093333;
	this.tonemapWeighting = 9.50;
	this.updateUniforms();
	this.presetTransitionDuration = 5.0;
	this.set_preset("stellarDawn");
};
shaders_SkyEffectController.__name__ = true;
shaders_SkyEffectController.prototype = {
	setInitialValues: function() {
		this.sunPosition.set(0,-700000,0);
		this.cameraPos.set(100000.0,-40000.0,0.0);
		this.turbidity = 2.0;
		this.rayleigh = 1.0;
		this.mieCoefficient = 0.005;
		this.mieDirectionalG = 0.8;
		this.luminance = 1.0;
		this.inclination = 0.49;
		this.azimuth = 0.25;
		this.refractiveIndex = 1.0003;
		this.numMolecules = 2.542e25;
		this.depolarizationFactor = 0.035;
		this.primaries.set(6.8e-7,5.5e-7,4.5e-7);
		this.mieKCoefficient.set(0.686,0.678,0.666);
		this.mieV = 4.0;
		this.rayleighZenithLength = 8.4e3;
		this.mieZenithLength = 1.25e3;
		this.sunIntensityFactor = 1000.0;
		this.sunIntensityFalloffSteepness = 1.5;
		this.sunAngularDiameterDegrees = 0.0093333;
		this.tonemapWeighting = 9.50;
	}
	,updateUniforms: function() {
		shaders_SkyShader.uniforms.cameraPos.value = this.cameraPos;
		shaders_SkyShader.uniforms.turbidity.value = this.turbidity;
		shaders_SkyShader.uniforms.rayleigh.value = this.rayleigh;
		shaders_SkyShader.uniforms.mieCoefficient.value = this.mieCoefficient;
		shaders_SkyShader.uniforms.mieDirectionalG.value = this.mieDirectionalG;
		shaders_SkyShader.uniforms.luminance.value = this.luminance;
		var theta = Math.PI * (this.inclination - 0.5);
		var phi = 2 * Math.PI * (this.azimuth - 0.5);
		var distance = 400000;
		this.sunPosition.x = distance * Math.cos(phi);
		this.sunPosition.y = distance * Math.sin(phi) * Math.sin(theta);
		this.sunPosition.z = distance * Math.sin(phi) * Math.cos(theta);
		shaders_SkyShader.uniforms.sunPosition.value.copy(this.sunPosition);
		shaders_SkyShader.uniforms.refractiveIndex.value = this.refractiveIndex;
		shaders_SkyShader.uniforms.numMolecules.value = this.numMolecules;
		shaders_SkyShader.uniforms.depolarizationFactor.value = this.depolarizationFactor;
		shaders_SkyShader.uniforms.rayleighZenithLength.value = this.rayleighZenithLength;
		shaders_SkyShader.uniforms.primaries.value.copy(this.primaries);
		shaders_SkyShader.uniforms.mieKCoefficient.value.copy(this.mieKCoefficient);
		shaders_SkyShader.uniforms.mieV.value = this.mieV;
		shaders_SkyShader.uniforms.mieZenithLength.value = this.mieZenithLength;
		shaders_SkyShader.uniforms.sunIntensityFactor.value = this.sunIntensityFactor;
		shaders_SkyShader.uniforms.sunIntensityFalloffSteepness.value = this.sunIntensityFalloffSteepness;
		shaders_SkyShader.uniforms.sunAngularDiameterDegrees.value = this.sunAngularDiameterDegrees;
		shaders_SkyShader.uniforms.tonemapWeighting.value = this.tonemapWeighting;
	}
	,presetChanged: function(preset,duration) {
		if(duration == null) {
			duration = 3;
		}
		switch(preset) {
		case "alienDay":
			this.alienDay(duration);
			break;
		case "bloodSky":
			this.bloodSky(duration);
			break;
		case "blueDusk":
			this.blueDusk(duration);
			break;
		case "purpleDusk":
			this.purpleDusk(duration);
			break;
		case "redSunset":
			this.redSunset(duration);
			break;
		case "stellarDawn":
			this.stellarDawn(duration);
			break;
		default:
		}
	}
	,onPresetChanged: function(preset) {
		this.presetChanged(preset);
	}
	,stellarDawn: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 1.25, rayleigh : 1.00, mieCoefficient : 0.00335, mieDirectionalG : 0.787, luminance : 1.0, inclination : 0.4945, azimuth : 0.2508, refractiveIndex : 1.000317, numMolecules : 2.542e25, depolarizationFactor : 0.067, rayleighZenithLength : 615, mieV : 4.012, mieZenithLength : 500, sunIntensityFactor : 1111, sunIntensityFalloffSteepness : 0.98, sunAngularDiameterDegrees : 0.00758, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 6.8e-7, y : 5.5e-7, z : 4.5e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,redSunset: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 4.7, rayleigh : 2.28, mieCoefficient : 0.005, mieDirectionalG : 0.82, luminance : 1.00, inclination : 0.4983, azimuth : 0.1979, refractiveIndex : 1.00029, numMolecules : 2.542e25, depolarizationFactor : 0.02, rayleighZenithLength : 8400, mieV : 3.936, mieZenithLength : 34000, sunIntensityFactor : 1000, sunIntensityFalloffSteepness : 1.5, sunAngularDiameterDegrees : 0.00933, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 6.8e-7, y : 5.5e-7, z : 4.5e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,alienDay: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 12.575, rayleigh : 5.75, mieCoefficient : 0.0074, mieDirectionalG : 0.468, luminance : 1.00, inclination : 0.4901, azimuth : 0.1866, refractiveIndex : 1.000128, numMolecules : 2.542e25, depolarizationFactor : 0.137, rayleighZenithLength : 3795, mieV : 4.007, mieZenithLength : 7100, sunIntensityFactor : 1024, sunIntensityFalloffSteepness : 1.4, sunAngularDiameterDegrees : 0.006, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 6.8e-7, y : 5.5e-7, z : 4.5e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,blueDusk: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 2.5, rayleigh : 2.295, mieCoefficient : 0.011475, mieDirectionalG : 0.814, luminance : 1.00, inclination : 0.4987, azimuth : 0.2268, refractiveIndex : 1.000262, numMolecules : 2.542e25, depolarizationFactor : 0.095, rayleighZenithLength : 540, mieV : 3.979, mieZenithLength : 1000, sunIntensityFactor : 1151, sunIntensityFalloffSteepness : 1.22, sunAngularDiameterDegrees : 0.00639, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 6.8e-7, y : 5.5e-7, z : 4.5e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,purpleDusk: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 3.6, rayleigh : 2.26, mieCoefficient : 0.005, mieDirectionalG : 0.822, luminance : 1.00, inclination : 0.502, azimuth : 0.2883, refractiveIndex : 1.000294, numMolecules : 2.542e25, depolarizationFactor : 0.068, rayleighZenithLength : 12045, mieV : 3.976, mieZenithLength : 34000, sunIntensityFactor : 1631, sunIntensityFalloffSteepness : 1.5, sunAngularDiameterDegrees : 0.00933, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 7.5e-7, y : 4.5e-7, z : 5.1e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,bloodSky: function(duration) {
		if(duration == null) {
			duration = 3;
		}
		var _gthis = this;
		motion_Actuate.tween(this,duration,{ turbidity : 4.75, rayleigh : 6.77, mieCoefficient : 0.0191, mieDirectionalG : 0.793, luminance : 1.1735, inclination : 0.4956, azimuth : 0.2174, refractiveIndex : 1.000633, numMolecules : 2.542e25, depolarizationFactor : 0.01, rayleighZenithLength : 1425, mieV : 4.042, mieZenithLength : 1600, sunIntensityFactor : 2069, sunIntensityFalloffSteepness : 2.26, sunAngularDiameterDegrees : 0.01487, tonemapWeighting : 9.50}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.primaries,duration,{ x : 7.929e-7, y : 3.766e-7, z : 3.172e-7}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.mieKCoefficient,duration,{ x : 0.686, y : 0.678, z : 0.666}).onUpdate(function() {
			_gthis.updateUniforms();
		});
		motion_Actuate.tween(this.cameraPos,duration,{ x : 100000, y : -40000, z : 0}).onUpdate(function() {
			_gthis.updateUniforms();
		});
	}
	,addGUIItem: function(c,parentGui) {
		var controller = c;
		var updateValues = function(t) {
			controller.updateUniforms();
		};
		parentGui.add(controller,"preset",["stellarDawn","redSunset","bloodSky","alienDay","blueDusk","purpleDusk"]).listen().onChange($bind(this,this.onPresetChanged));
		var parametersFolder = parentGui.addFolder("parameters");
		parametersFolder.add(controller,"turbidity").step(0.025).listen().onChange(updateValues);
		parametersFolder.add(controller,"rayleigh").step(0.005).listen().onChange(updateValues);
		parametersFolder.add(controller,"mieCoefficient").step(0.000025).listen().onChange(updateValues);
		parametersFolder.add(controller,"mieDirectionalG").step(0.001).listen().onChange(updateValues);
		parametersFolder.add(controller,"luminance").step(0.0005).listen().onChange(updateValues);
		parametersFolder.add(controller,"inclination").step(0.0001).listen().onChange(updateValues);
		parametersFolder.add(controller,"azimuth").step(0.0001).listen().onChange(updateValues);
		parametersFolder.add(controller,"refractiveIndex").step(0.000001).listen().onChange(updateValues);
		parametersFolder.add(controller,"numMolecules",2.542e10,2.542e26,1e10).listen().onChange(updateValues);
		parametersFolder.add(controller,"depolarizationFactor").step(0.001).listen().onChange(updateValues);
		parametersFolder.add(controller,"rayleighZenithLength").step(15.0).listen().onChange(updateValues);
		parametersFolder.add(controller,"mieV").step(0.001).listen().onChange(updateValues);
		parametersFolder.add(controller,"mieZenithLength").step(100.0).listen().onChange(updateValues);
		parametersFolder.add(controller,"sunIntensityFactor").step(1.0).listen().onChange(updateValues);
		parametersFolder.add(controller,"sunIntensityFalloffSteepness").step(0.01).listen().onChange(updateValues);
		parametersFolder.add(controller,"sunAngularDiameterDegrees").step(0.00001).listen().onChange(updateValues);
		parametersFolder.add(controller,"tonemapWeighting").step(1).listen().onChange(updateValues);
		var primariesFolder = parentGui.addFolder("primaries");
		primariesFolder.add(controller.primaries,"x",5e-12,9e-7,5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries,"y",5e-12,9e-7,5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries,"z",5e-12,9e-7,5e-13).listen().onChange(updateValues);
		var mieFolder = parentGui.addFolder("mieCoefficient");
		mieFolder.add(controller.mieKCoefficient,"x").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient,"y").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient,"z").step(0.001).listen().onChange(updateValues);
		var camFolder = parentGui.addFolder("cameraPos");
		camFolder.add(controller.cameraPos,"x").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos,"y").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos,"z").step(250).listen().onChange(updateValues);
	}
	,set_preset: function(nextPreset) {
		this.preset = nextPreset;
		this.presetChanged(nextPreset,this.presetTransitionDuration);
		return this.preset;
	}
	,__class__: shaders_SkyEffectController
	,__properties__: {set_preset:"set_preset"}
};
var util_FileReader = function() { };
util_FileReader.__name__ = true;
var $_;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
Main.DEGREES_TO_RAD = 0.01745329;
Main.GAME_VIEWPORT_WIDTH = 1200;
Main.GAME_VIEWPORT_HEIGHT = 800;
Main.REPO_URL = "https://github.com/Tw1ddle/Sky-Shader";
Main.TWITTER_URL = "https://twitter.com/Sam_Twidale";
Main.WEBSITE_URL = "https://samcodes.co.uk/";
Main.HAXE_URL = "https://haxe.org/";
Main.THREEJS_URL = "https://github.com/mrdoob/three.js/";
motion_actuators_SimpleActuator.actuators = [];
motion_actuators_SimpleActuator.actuatorsLength = 0;
motion_actuators_SimpleActuator.addedEvent = false;
motion_easing_Expo.easeIn = new motion_easing__$Expo_ExpoEaseIn();
motion_easing_Expo.easeInOut = new motion_easing__$Expo_ExpoEaseInOut();
motion_easing_Expo.easeOut = new motion_easing__$Expo_ExpoEaseOut();
motion_Actuate.defaultActuator = motion_actuators_SimpleActuator;
motion_Actuate.defaultEase = motion_easing_Expo.easeOut;
motion_Actuate.targetLibraries = new haxe_ds_ObjectMap();
shaders_SkyShader.uniforms = (function($this) {
	var $r;
	var tmp = { type : "v3", value : new THREE.Vector3()};
	var tmp1 = { type : "v3", value : new THREE.Vector3()};
	var tmp2 = { type : "v3", value : new THREE.Vector3()};
	$r = { luminance : { type : "f", value : 1.0}, turbidity : { type : "f", value : 1.0}, rayleigh : { type : "f", value : 1.0}, mieCoefficient : { type : "f", value : 1.0}, mieDirectionalG : { type : "f", value : 1.0}, sunPosition : tmp, cameraPos : tmp1, refractiveIndex : { type : "f", value : 1.0}, numMolecules : { type : "f", value : 1.0}, depolarizationFactor : { type : "f", value : 1.0}, primaries : tmp2, mieKCoefficient : { type : "v3", value : new THREE.Vector3()}, mieV : { type : "f", value : 1.0}, rayleighZenithLength : { type : "f", value : 1.0}, mieZenithLength : { type : "f", value : 1.0}, sunIntensityFactor : { type : "f", value : 1.0}, sunIntensityFalloffSteepness : { type : "f", value : 1.0}, sunAngularDiameterDegrees : { type : "f", value : 1.0}, tonemapWeighting : { type : "f", value : 9.50}};
	return $r;
}(this));
shaders_SkyShader.vertexShader = "varying vec3 vWorldPosition;\n\nvoid main()\n{\n\tvec4 worldPosition = modelMatrix * vec4(position, 1.0);\n\tvWorldPosition = worldPosition.xyz;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}";
shaders_SkyShader.fragmentShader = "// Based on \"A Practical Analytic Model for Daylight\" aka The Preetham Model, the de facto standard analytic skydome model\n// http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf\n// Original implementation by Simon Wallner: http://www.simonwallner.at/projects/atmospheric-scattering\n// Improved by Martin Upitis: http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR\n// Three.js integration by zz85: http://twitter.com/blurspline / https://github.com/zz85 / http://threejs.org/examples/webgl_shaders_sky.html\n// Additional uniforms, refactoring and integrated with editable sky example: https://twitter.com/Sam_Twidale / https://github.com/Tw1ddle/Sky-Particles-Shader\n\nvarying vec3 vWorldPosition;\n\nuniform vec3 cameraPos;\nuniform float depolarizationFactor;\nuniform float luminance;\nuniform float mieCoefficient;\nuniform float mieDirectionalG;\nuniform vec3 mieKCoefficient;\nuniform float mieV;\nuniform float mieZenithLength;\nuniform float numMolecules;\nuniform vec3 primaries;\nuniform float rayleigh;\nuniform float rayleighZenithLength;\nuniform float refractiveIndex;\nuniform float sunAngularDiameterDegrees;\nuniform float sunIntensityFactor;\nuniform float sunIntensityFalloffSteepness;\nuniform vec3 sunPosition;\nuniform float tonemapWeighting;\nuniform float turbidity;\n\nconst float PI = 3.141592653589793238462643383279502884197169;\nconst vec3 UP = vec3(0.0, 1.0, 0.0);\n\nvec3 totalRayleigh(vec3 lambda)\n{\n\treturn (8.0 * pow(PI, 3.0) * pow(pow(refractiveIndex, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * depolarizationFactor)) / (3.0 * numMolecules * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * depolarizationFactor));\n}\n\nvec3 totalMie(vec3 lambda, vec3 K, float T)\n{\n\tfloat c = 0.2 * T * 10e-18;\n\treturn 0.434 * c * PI * pow((2.0 * PI) / lambda, vec3(mieV - 2.0)) * K;\n}\n\nfloat rayleighPhase(float cosTheta)\n{\n\treturn (3.0 / (16.0 * PI)) * (1.0 + pow(cosTheta, 2.0));\n}\n\nfloat henyeyGreensteinPhase(float cosTheta, float g)\n{\n\treturn (1.0 / (4.0 * PI)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0 * g * cosTheta + pow(g, 2.0), 1.5));\n}\n\nfloat sunIntensity(float zenithAngleCos)\n{\n\tfloat cutoffAngle = PI / 1.95; // Earth shadow hack\n\treturn sunIntensityFactor * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos)) / sunIntensityFalloffSteepness)));\n}\n\n// Whitescale tonemapping calculation, see http://filmicgames.com/archives/75\n// Also see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness\nconst float A = 0.15; // Shoulder strength\nconst float B = 0.50; // Linear strength\nconst float C = 0.10; // Linear angle\nconst float D = 0.20; // Toe strength\nconst float E = 0.02; // Toe numerator\nconst float F = 0.30; // Toe denominator\nvec3 Uncharted2Tonemap(vec3 W)\n{\n\treturn ((W * (A * W + C * B) + D * E) / (W * (A * W + B) + D * F)) - E / F;\n}\n\nvoid main()\n{\n\t// Rayleigh coefficient\n\tfloat sunfade = 1.0 - clamp(1.0 - exp((sunPosition.y / 450000.0)), 0.0, 1.0);\n\tfloat rayleighCoefficient = rayleigh - (1.0 * (1.0 - sunfade));\n\tvec3 betaR = totalRayleigh(primaries) * rayleighCoefficient;\n\t\n\t// Mie coefficient\n\tvec3 betaM = totalMie(primaries, mieKCoefficient, turbidity) * mieCoefficient;\n\t\n\t// Optical length, cutoff angle at 90 to avoid singularity\n\tfloat zenithAngle = acos(max(0.0, dot(UP, normalize(vWorldPosition - cameraPos))));\n\tfloat denom = cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / PI), -1.253);\n\tfloat sR = rayleighZenithLength / denom;\n\tfloat sM = mieZenithLength / denom;\n\t\n\t// Combined extinction factor\n\tvec3 Fex = exp(-(betaR * sR + betaM * sM));\n\t\n\t// In-scattering\n\tvec3 sunDirection = normalize(sunPosition);\n\tfloat cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);\n\tvec3 betaRTheta = betaR * rayleighPhase(cosTheta * 0.5 + 0.5);\n\tvec3 betaMTheta = betaM * henyeyGreensteinPhase(cosTheta, mieDirectionalG);\n\tfloat sunE = sunIntensity(dot(sunDirection, UP));\n\tvec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex), vec3(1.5));\n\tLin *= mix(vec3(1.0), pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex, vec3(0.5)), clamp(pow(1.0 - dot(UP, sunDirection), 5.0), 0.0, 1.0));\n\t\n\t// Composition + solar disc\n\tfloat sunAngularDiameterCos = cos(sunAngularDiameterDegrees);\n\tfloat sundisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta);\n\tvec3 L0 = vec3(0.1) * Fex;\n\tL0 += sunE * 19000.0 * Fex * sundisk;\n\tvec3 texColor = Lin + L0;\n\ttexColor *= 0.04;\n\ttexColor += vec3(0.0, 0.001, 0.0025) * 0.3;\n\t\n\t// Tonemapping\n\tvec3 whiteScale = 1.0 / Uncharted2Tonemap(vec3(tonemapWeighting));\n\tvec3 curr = Uncharted2Tonemap((log2(2.0 / pow(luminance, 4.0))) * texColor);\n\tvec3 color = curr * whiteScale;\n\tvec3 retColor = pow(color, vec3(1.0 / (1.2 + (1.2 * sunfade))));\n\n\tgl_FragColor = vec4(retColor, 1.0);\n}";
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
