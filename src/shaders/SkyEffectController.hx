package shaders;

import external.dat.GUI;
import js.three.Vector3;
import util.FileReader;

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
	
	public function new() {		
		setInitialValues();
		updateUniforms();
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
	
	#if debug
	public function addGUIItem(c:SkyEffectController, gui:GUI):Void {		
		var controller:SkyEffectController = cast c;
		
		var updateValues = function(t:Dynamic) {
			controller.updateUniforms();
		};
		
		gui.add(controller, "turbidity").step(0.025).listen().onChange(updateValues);
		gui.add(controller, "rayleigh").step(0.005).listen().onChange(updateValues);
		gui.add(controller, "mieCoefficient").step(0.000025).listen().onChange(updateValues);
		gui.add(controller, "mieDirectionalG").step(0.001).listen().onChange(updateValues);
		gui.add(controller, "luminance").step(0.0005).listen().onChange(updateValues);
		gui.add(controller, "inclination").step(0.0001).listen().onChange(updateValues);
		gui.add(controller, "azimuth").step(0.0001).listen().onChange(updateValues);
		
		gui.add(controller, "refractiveIndex").step(0.000001).listen().onChange(updateValues);
		gui.add(controller, "numMolecules", 2.542e10, 2.542e26, 1e10).listen().onChange(updateValues);
		gui.add(controller, "depolarizationFactor").step(0.001).listen().onChange(updateValues);
		
		gui.add(controller, "rayleighZenithLength").step(15.0).listen().onChange(updateValues);
		gui.add(controller, "mieV").step(0.001).listen().onChange(updateValues);
		gui.add(controller, "mieZenithLength").step(100.0).listen().onChange(updateValues);
		gui.add(controller, "sunIntensityFactor").step(1.0).listen().onChange(updateValues);
		gui.add(controller, "sunIntensityFalloffSteepness").step(0.01).listen().onChange(updateValues);
		gui.add(controller, "sunAngularDiameterDegrees").step(0.00001).listen().onChange(updateValues);
		
		var tonemapFolder = gui.addFolder("tonemap");
		tonemapFolder.add(controller, "tonemapWeighting").step(1).listen().onChange(updateValues);
		
		var primariesFolder = gui.addFolder("primaries");
		primariesFolder.add(controller.primaries, "x", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries, "y", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		primariesFolder.add(controller.primaries, "z", 5e-12, 9e-7, 5e-13).listen().onChange(updateValues);
		
		var mieFolder = gui.addFolder("mieCoefficient");
		mieFolder.add(controller.mieKCoefficient, "x").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient, "y").step(0.001).listen().onChange(updateValues);
		mieFolder.add(controller.mieKCoefficient, "z").step(0.001).listen().onChange(updateValues);
		
		var camFolder = gui.addFolder("cameraPos");
		camFolder.add(controller.cameraPos, "x").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos, "y").step(250).listen().onChange(updateValues);
		camFolder.add(controller.cameraPos, "z").step(250).listen().onChange(updateValues);
	}
	#end
}