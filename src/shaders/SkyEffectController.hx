package shaders;

import external.dat.GUI;
import js.three.Vector3;
import util.FileReader;
import motion.*;

class SkyShader {	
	public static var uniforms = {
		luminance: { type: "f", value:1.0 },
		turbidity: { type: "f", value:1.0 },
		rayleigh: { type: "f", value:1.0 },
		mieCoefficient: { type: "f", value:1.0 },
		mieDirectionalG: { type: "f", value:1.0 },
		sunPosition: { type: "v3", value: new Vector3() },
		cameraPos: { type: "v3", value: new Vector3() },
		refractiveIndex: { type: "f", value:1.0 },
		numMolecules: { type: "f", value:1.0 },
		depolarizationFactor: { type: "f", value:1.0 },
		primaries: { type: "v3", value: new Vector3() },
		mieKCoefficient: { type: "v3", value: new Vector3() },
		mieV: { type: "f", value:1.0 },
		rayleighZenithLength: { type: "f", value:1.0 },
		mieZenithLength: { type: "f", value:1.0 },
		sunIntensityFactor: { type: "f", value:1.0 },
		sunIntensityFalloffSteepness: { type: "f", value:1.0 },
		sunAngularDiameterDegrees: { type: "f", value:1.0 },
		tonemapWeighting: { type: "f", value:1000.0 }
	};
	
	public static var vertexShader = FileReader.readFile("shaders/glsl/sky.vertex");
	public static var fragmentShader = FileReader.readFile("shaders/glsl/sky.fragment");
}

class SkyEffectController {
	private var main:Main;
	
	public var sunPosition:Vector3 = new Vector3();
	public var cameraPos:Vector3 = new Vector3();
	public var turbidity:Float;
	public var rayleigh:Float;
	public var mieCoefficient:Float;
	public var mieDirectionalG:Float;
	public var luminance:Float;
	public var inclination:Float;
	public var azimuth:Float;
	public var refractiveIndex:Float;
	public var numMolecules:Float;
	public var depolarizationFactor:Float;
	public var primaries:Vector3 = new Vector3();
	public var mieKCoefficient:Vector3 = new Vector3();
	public var rayleighZenithLength:Float;
	public var mieV:Float;
	public var mieZenithLength:Float;
	public var sunIntensityFactor:Float;
	public var sunIntensityFalloffSteepness:Float;
	public var sunAngularDiameterDegrees:Float;
	public var tonemapWeighting:Float;
	
	public var preset(default, set):String;
	public var presetTransitionDuration:Float;
	
	public function new(main:Main) {
		this.main = main;
		
		setInitialValues();
		updateUniforms();
		
		presetTransitionDuration = 5.0;
		preset = "stellarDawn";
	}
	
	private inline function setInitialValues():Void {
		sunPosition.set(0, -700000, 0);
		cameraPos.set(100000.0, -40000.0, 0.0);
		turbidity = 2.0;
		rayleigh = 1.0;
		mieCoefficient = 0.005;
		mieDirectionalG = 0.8;
		luminance = 1.0;
		inclination = 0.49;
		azimuth = 0.25;

		// Refractive index of air
		refractiveIndex = 1.0003;
		
		// Number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)
		numMolecules = 2.542e25;
		
		// Depolarization factor for air wavelength of primaries
		depolarizationFactor = 0.035;
		primaries.set(6.8e-7, 5.5e-7, 4.5e-7);
		
		// Mie, K coefficient for the primaries
		mieKCoefficient.set(0.686, 0.678, 0.666);
		mieV = 4.0;
		
		// Optical length at zenith for molecules
		rayleighZenithLength = 8.4e3;
		mieZenithLength = 1.25e3;
		
		// Sun intensity factors
		sunIntensityFactor = 1000.0;
		sunIntensityFalloffSteepness = 1.5;
		
		// Visual size of sun
		sunAngularDiameterDegrees = 0.0093333;
		
		// W factor in tonemap calculation
		tonemapWeighting = 1000.0;
	}
	
	// The reason I'm not using getters/setters is because it makes using dat.gui more annoying e.g. most fields being called "value" because of the way the uniforms are stored
	public function updateUniforms():Void {
		SkyShader.uniforms.cameraPos.value = cameraPos;
		SkyShader.uniforms.turbidity.value = turbidity;
		SkyShader.uniforms.rayleigh.value = rayleigh;
		SkyShader.uniforms.mieCoefficient.value = mieCoefficient;
		SkyShader.uniforms.mieDirectionalG.value = mieDirectionalG;
		SkyShader.uniforms.luminance.value = luminance;
		
		var theta = Math.PI * (inclination - 0.5);
		var phi = 2 * Math.PI * (azimuth - 0.5);
		
		var distance = 400000;
		sunPosition.x = distance * Math.cos(phi);
		sunPosition.y = distance * Math.sin(phi) * Math.sin(theta);
		sunPosition.z = distance * Math.sin(phi) * Math.cos(theta);
		
		SkyShader.uniforms.sunPosition.value.copy(sunPosition);
		
		SkyShader.uniforms.refractiveIndex.value = refractiveIndex;
		SkyShader.uniforms.numMolecules.value = numMolecules;
		SkyShader.uniforms.depolarizationFactor.value = depolarizationFactor;
		SkyShader.uniforms.rayleighZenithLength.value = rayleighZenithLength;
		SkyShader.uniforms.primaries.value.copy(primaries);
		SkyShader.uniforms.mieKCoefficient.value.copy(mieKCoefficient);
		SkyShader.uniforms.mieV.value = mieV;
		SkyShader.uniforms.mieZenithLength.value = mieZenithLength;
		SkyShader.uniforms.sunIntensityFactor.value = sunIntensityFactor;
		SkyShader.uniforms.sunIntensityFalloffSteepness.value = sunIntensityFalloffSteepness;
		SkyShader.uniforms.sunAngularDiameterDegrees.value = sunAngularDiameterDegrees;
		SkyShader.uniforms.tonemapWeighting.value = tonemapWeighting;
		
		#if debug
		// Trace primaries since dat.gui doesn't display the numbers right
		// trace(primaries);
		#end
	}
	
	public function presetChanged(preset:String, duration:Float = 3):Void {
		switch(preset) {
			case "stellarDawn":
				stellarDawn(duration);
			case "redSunset":
				redSunset(duration);
			case "alienDay":
				alienDay(duration);
			case "blueDusk":
				blueDusk(duration);
			case "bloodSky":
				bloodSky(duration);
			case "purpleDusk":
				purpleDusk(duration);
			default:
				trace("Got bad preset, doing nothing...");
		}
	}
	
	public function onPresetChanged(preset:String):Void {
		presetChanged(preset);
	}
	
	// Presets
	public function stellarDawn(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 1.25,
			rayleigh: 1.00,
			mieCoefficient: 0.00335,
			mieDirectionalG: 0.787,
			luminance: 1.0,
			inclination: 0.4945,
			azimuth: 0.2508,
			refractiveIndex: 1.000317,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.067,
			rayleighZenithLength: 615,
			mieV: 4.012,
			mieZenithLength: 500,
			sunIntensityFactor: 1111,
			sunIntensityFalloffSteepness: 0.98,
			sunAngularDiameterDegrees: 0.00758,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 6.8e-7,
			y: 5.5e-7,
			z: 4.5e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.alive = 1.0;
		main.windEmitter.alive = 0.0;
		
		main.starEmitter.acceleration.set(0, 9.2, 74);
		main.starEmitter.accelerationSpread.set(6, 5.1, 25);
		main.starEmitter.velocity.set(0, -12, 0);
		main.starEmitter.velocitySpread.set(27, 0, 0);
	}
	
	public function redSunset(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 4.7,
			rayleigh: 2.28,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.82,
			luminance: 1.00,
			inclination: 0.4983,
			azimuth: 0.1979,
			refractiveIndex: 1.00029,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.02,
			rayleighZenithLength: 8400,
			mieV: 3.936,
			mieZenithLength: 34000,
			sunIntensityFactor: 1000,
			sunIntensityFalloffSteepness: 1.5,
			sunAngularDiameterDegrees: 0.00933,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 6.8e-7,
			y: 5.5e-7,
			z: 4.5e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.acceleration.set(0, 0, 0);
		main.starEmitter.accelerationSpread.set(0, 0, 0);
		main.starEmitter.velocity.set(0, 0, 0);
		main.starEmitter.velocitySpread.set(0, 0, 0);
		
		main.starEmitter.alive = 0.2;
		main.windEmitter.alive = 0.0;
	}
	
	public function alienDay(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 12.575,
			rayleigh: 5.75,
			mieCoefficient: 0.0074,
			mieDirectionalG: 0.468,
			luminance: 1.00,
			inclination: 0.4901,
			azimuth: 0.1866,
			refractiveIndex: 1.000128,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.137,
			rayleighZenithLength: 3795,
			mieV: 4.007,
			mieZenithLength: 7100,
			sunIntensityFactor: 1024,
			sunIntensityFalloffSteepness: 1.4,
			sunAngularDiameterDegrees: 0.006,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 6.8e-7,
			y: 5.5e-7,
			z: 4.5e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.acceleration.set(-19, 3, 0);
		main.starEmitter.accelerationSpread.set(5.2, 8, 16);
		main.starEmitter.velocity.set(0, 0, 0);
		main.starEmitter.velocitySpread.set(69, 0, 0);
		
		main.starEmitter.alive = 1.0;
		main.windEmitter.alive = 0.0;
	}
	
	public function blueDusk(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 2.5,
			rayleigh: 2.295,
			mieCoefficient: 0.011475,
			mieDirectionalG: 0.814,
			luminance: 1.00,
			inclination: 0.4987,
			azimuth: 0.2268,
			refractiveIndex: 1.000262,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.095,
			rayleighZenithLength: 540,
			mieV: 3.979,
			mieZenithLength: 1000,
			sunIntensityFactor: 1151,
			sunIntensityFalloffSteepness: 1.22,
			sunAngularDiameterDegrees: 0.00639,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 6.8e-7,
			y: 5.5e-7,
			z: 4.5e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.acceleration.set(-19, 3, 0);
		main.starEmitter.accelerationSpread.set(5.2, 8, 16);
		main.starEmitter.velocity.set(0, 0, 0);
		main.starEmitter.velocitySpread.set(69, 0, 0);
		
		main.starEmitter.alive = 0.5;
		main.windEmitter.alive = 1.0;
	}
	
	public function purpleDusk(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 3.6,
			rayleigh: 2.26,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.822,
			luminance: 1.00,
			inclination: 0.502,
			azimuth: 0.2883,
			refractiveIndex: 1.000294,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.068,
			rayleighZenithLength: 12045,
			mieV: 3.976,
			mieZenithLength: 34000,
			sunIntensityFactor: 1631,
			sunIntensityFalloffSteepness: 1.5,
			sunAngularDiameterDegrees: 0.00933,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 7.5e-7,
			y: 4.5e-7,
			z: 5.1e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.acceleration.set(-19, 3, 0);
		main.starEmitter.accelerationSpread.set(5.2, 8, 16);
		main.starEmitter.velocity.set(0, 0, 0);
		main.starEmitter.velocitySpread.set(69, 0, 0);
		
		main.starEmitter.alive = 1.0;
		main.windEmitter.alive = 0.0;
	}
	
	public function bloodSky(duration:Float = 3):Void {
		Actuate.tween(this, duration, {
			turbidity: 4.75,
			rayleigh: 6.77,
			mieCoefficient: 0.0191,
			mieDirectionalG: 0.793,
			luminance: 1.1735,
			inclination: 0.4956,
			azimuth: 0.2174,
			refractiveIndex: 1.000633,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.01,
			rayleighZenithLength: 1425,
			mieV: 4.042,
			mieZenithLength: 1600,
			sunIntensityFactor: 2069,
			sunIntensityFalloffSteepness: 2.26,
			sunAngularDiameterDegrees: 0.01487,
			tonemapWeighting: 1000
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.primaries, duration, {
			x: 7.929e-7,
			y: 3.766e-7,
			z: 3.172e-7
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		Actuate.tween(this.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			this.updateUniforms();
		});
		
		main.starEmitter.acceleration.set(-19, 3, 0);
		main.starEmitter.accelerationSpread.set(5.2, 8, 16);
		main.starEmitter.velocity.set(0, 0, 0);
		main.starEmitter.velocitySpread.set(69, 0, 0);
		
		main.starEmitter.alive = 0.1;
		main.windEmitter.alive = 0.2;
	}
	
	public function addGUIItem(c:SkyEffectController, parentGui:GUI):Void {		
		var controller:SkyEffectController = cast c;
		
		var updateValues = function(t:Dynamic) {
			controller.updateUniforms();
		};
		
		parentGui.add(controller, "preset", ["stellarDawn", "redSunset", "bloodSky", "alienDay", "blueDusk", "purpleDusk"]).listen().onChange(onPresetChanged);
		
		var parametersFolder = parentGui.addFolder("parameters");
		
		parametersFolder.add(controller, "turbidity").step(0.025).listen().onChange(updateValues);
		parametersFolder.add(controller, "rayleigh").step(0.005).listen().onChange(updateValues);
		parametersFolder.add(controller, "mieCoefficient").step(0.000025).listen().onChange(updateValues);
		parametersFolder.add(controller, "mieDirectionalG").step(0.001).listen().onChange(updateValues);
		parametersFolder.add(controller, "luminance").step(0.0005).listen().onChange(updateValues);
		parametersFolder.add(controller, "inclination").step(0.0001).listen().onChange(updateValues);
		parametersFolder.add(controller, "azimuth").step(0.0001).listen().onChange(updateValues);
		
		parametersFolder.add(controller, "refractiveIndex").step(0.000001).listen().onChange(updateValues);
		parametersFolder.add(controller, "numMolecules", 2.542e10, 2.542e26, 1e10).listen().onChange(updateValues);
		parametersFolder.add(controller, "depolarizationFactor").step(0.001).listen().onChange(updateValues);
		
		parametersFolder.add(controller, "rayleighZenithLength").step(15.0).listen().onChange(updateValues);
		parametersFolder.add(controller, "mieV").step(0.001).listen().onChange(updateValues);
		parametersFolder.add(controller, "mieZenithLength").step(100.0).listen().onChange(updateValues);
		parametersFolder.add(controller, "sunIntensityFactor").step(1.0).listen().onChange(updateValues);
		parametersFolder.add(controller, "sunIntensityFalloffSteepness").step(0.01).listen().onChange(updateValues);
		parametersFolder.add(controller, "sunAngularDiameterDegrees").step(0.00001).listen().onChange(updateValues);
		parametersFolder.add(controller, "tonemapWeighting").step(1).listen().onChange(updateValues);
		
		var primariesFolder = parentGui.addFolder("primaries");
		primariesFolder.add(controller.primaries, "x", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries, "y", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries, "z", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		
		var mieFolder = parentGui.addFolder("mieCoefficient");
		mieFolder.add(controller.mieKCoefficient, "x").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient, "y").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient, "z").step(0.001).listen().onChange(updateValues);
		
		var camFolder = parentGui.addFolder("cameraPos");
		camFolder.add(controller.cameraPos, "x").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos, "y").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos, "z").step(250).listen().onChange(updateValues);
	}
	
	private function set_preset(nextPreset:String):String {
		this.preset = nextPreset;
		presetChanged(nextPreset, presetTransitionDuration);
		return preset;
	}
}