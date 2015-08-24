package;

import external.dat.GUI;
import external.particle.Emitter;
import external.particle.Group;
import external.webgl.Detector;
import js.Browser;
import js.three.Color;
import js.three.ImageUtils;
import js.three.Mesh;
import js.three.Object3D;
import js.three.PerspectiveCamera;
import js.three.Scene;
import js.three.ShaderMaterial;
import js.three.SphereGeometry;
import js.three.utils.Stats;
import js.three.Vector3;
import js.three.WebGLRenderer;
import motion.Actuate;
import motion.easing.*;
import shaders.SkyEffectController;

class Main {
	public static inline var DEGREES_TO_RAD:Float = 0.01745329;
	public static inline var GAME_VIEWPORT_WIDTH:Float = 800;
	public static inline var GAME_VIEWPORT_HEIGHT:Float = 500;
	private static inline var REPO_URL:String = "https://github.com/Tw1ddle/Ludum-Dare-33";
	private static inline var TWITTER_URL:String = "https://twitter.com/Sam_Twidale";
	private static inline var LUDUM_DARE_URL:String = "http://ludumdare.com/";
	private static inline var WEBSITE_URL:String = "http://samcodes.co.uk/";
	
	#if debug
	private var guiItemCount:Int = 0;
	public var particleGUI(default, null):GUI = new GUI( { autoPlace:true } );
	public var shaderGUI(default, null):GUI = new GUI( { autoPlace:true } );
	public var sceneGUI(default, null):GUI = new GUI( { autoPlace:true } );
	public var stats(default, null):Stats = new Stats();
	#end
	
	public var worldScene(default, null):Scene = new Scene();
	public var worldCamera(default, null):PerspectiveCamera;

	private var gameAttachPoint:Dynamic;
	private var renderer:WebGLRenderer;
	public var skyEffectController(default, null):SkyEffectController = new SkyEffectController();
	
	private var starGroup:Group;
	public var starEmitter(default, null):Emitter;
	private var windGroup:Group;
	public var windEmitter(default, null):Emitter;
	
	private var lastAnimationTime:Float = 0.0; // Last time from requestAnimationFrame
	private var dt:Float = 0.0; // Frame delta time
	
    public static function main():Void {
		var main = new Main();
	}
	
	public inline function new() {
		Browser.window.onload = onWindowLoaded;
	}
	
	public inline function onWindowLoaded():Void {
		// Attach game div
		gameAttachPoint = Browser.document.getElementById("game");		
		var gameDiv = Browser.document.createElement("attach");
		gameAttachPoint.appendChild(gameDiv);
		
		// WebGL support check
		var glSupported:WebGLSupport = Detector.detect();
		if (glSupported != SUPPORTED_AND_ENABLED) {
			var unsupportedInfo = Browser.document.createElement('div');
			unsupportedInfo.style.position = 'absolute';
			unsupportedInfo.style.top = '10px';
			unsupportedInfo.style.width = '100%';
			unsupportedInfo.style.textAlign = 'center';
			unsupportedInfo.style.color = '#ffffff';
			
			switch(glSupported) {
				case WebGLSupport.NOT_SUPPORTED:
					unsupportedInfo.innerHTML = 'Your browser does not support WebGL. Click <a href="' + REPO_URL + '" target="_blank">here for screenshots</a> instead.';
				case WebGLSupport.SUPPORTED_BUT_DISABLED:
					unsupportedInfo.innerHTML = 'Your browser supports WebGL, but the feature appears to be disabled. Click <a href="' + REPO_URL + '" target="_blank">here for screenshots</a> instead.';
				default:
					unsupportedInfo.innerHTML = 'Could not detect WebGL support. Click <a href="' + REPO_URL + '" target="_blank">here for screenshots</a> instead.';
			}
			
			gameDiv.appendChild(unsupportedInfo);
			return;
		}
		
		// Credits and video link
		var credits = Browser.document.createElement('div');
		credits.style.position = 'absolute';
		credits.style.bottom = '-70px';
		credits.style.width = '100%';
		credits.style.textAlign = 'center';
		credits.style.color = '#333333';
		credits.innerHTML = 'Created by <a href=' + TWITTER_URL + ' target="_blank">Sam Twidale</a> for <a href=' + LUDUM_DARE_URL + ' target="_blank">Ludum Dare 33</a>. Get the code <a href=' + REPO_URL + ' target="_blank">here</a>.';
		gameDiv.appendChild(credits);
		
		// Setup WebGL renderer
        renderer = new WebGLRenderer({ antialias: false });
        renderer.sortObjects = false;
		renderer.autoClear = false;
        renderer.setSize(GAME_VIEWPORT_WIDTH, GAME_VIEWPORT_HEIGHT);
		renderer.setClearColor(new Color(0x222222));
		
		// Setup cameras
        worldCamera = new PerspectiveCamera(90, GAME_VIEWPORT_WIDTH / GAME_VIEWPORT_HEIGHT, 0.5, 2000000);
		
		// Setup world entities
		var skyMaterial = new ShaderMaterial( {
			fragmentShader: SkyShader.fragmentShader,
			vertexShader: SkyShader.vertexShader,
			uniforms: SkyShader.uniforms,
			side: BackSide
		});
		var skyMesh = new Mesh(new SphereGeometry(450000, 32, 15), skyMaterial);
		
		#if debug
		skyMesh.name = "Sky Mesh";
		#end
		
		worldScene.add(skyMesh);
		
		// Stars
		starGroup = new Group( { texture: ImageUtils.loadTexture('assets/images/icefly.png'), maxAge: 3 } );
		starEmitter = new Emitter({
			type: 'cube',
			position: new Vector3(0, 0, -14170), // worldCamera position * 10
			positionSpread: new Vector3(Main.GAME_VIEWPORT_WIDTH * 12, Main.GAME_VIEWPORT_HEIGHT * 10, 0), // Extra space on x axis so new stars appear before player sees them
			acceleration: new Vector3(0, 0, 0),
			accelerationSpread: new Vector3(0, 0, 0),
			velocity: new Vector3(0, 0, 0),
			velocitySpread: new Vector3(0, 0, 0),
			particleCount: 2000,
			opacityStart: 0.0,
			opacityMiddle: 0.6,
			opacityMiddleSpread: 0.4,
			opacityEnd: 0.0,
			sizeStart: 220,
		});
		
		#if debug
		starGroup.mesh.name = "Star Particle Group";
		#end
		
		starGroup.addEmitter(starEmitter);
		starGroup.mesh.frustumCulled = false;
		worldScene.add(starGroup.mesh);
		
		// Wind
		windGroup = new Group( { texture: ImageUtils.loadTexture('assets/images/firefly.png'), maxAge: 5 });
		windEmitter = new Emitter({
			type: 'cube',
			position: new Vector3(Main.GAME_VIEWPORT_WIDTH, 0, -1417),
			positionSpread: new Vector3(100, Main.GAME_VIEWPORT_HEIGHT, 0),
			acceleration: new Vector3(1, 0, 0),
			accelerationSpread: new Vector3(17, 47, -127),
			velocity: new Vector3(-576, 0, 0),
			velocitySpread: new Vector3(0, 0, 0),
			sizeStart: 10,
			sizeEnd: 10,
			opacityStart: 0,
			opacityMiddle: 1,
			opacityEnd: 0,
			particleCount: 5000,
			alive: 0
		});
		
		#if debug
		windGroup.mesh.name = "Wind Particle Group";
		#end
		
		windGroup.addEmitter(windEmitter);
		windGroup.mesh.frustumCulled = false;
		worldScene.add(windGroup.mesh);

		// Event setup
		// Window resize event
		Browser.document.addEventListener('resize', function(event) {
			
		}, false);
		
		// Disable context menu opening
		Browser.document.addEventListener('contextmenu', function(event) {
			event.preventDefault();
		}, true);
		
		// Debug setup
		#if debug
		setupStats();
		setupGUI();
		#end
		
		// Present game and start animation loop
		gameDiv.appendChild(renderer.domElement);
		Browser.window.requestAnimationFrame(animate);
	}
	
	public function restoreSkyToDefaults(duration:Float = 3, inclination:Float = 0.4983, azimuth:Float = 0.1979):Void {		
		Actuate.tween(skyEffectController, duration, {
			turbidity: 4.7,
			rayleigh: 2.28,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.82,
			luminance: 1.00,
			inclination: inclination,
			azimuth: azimuth,
			refractiveIndex: 1.00029,
			numMolecules: 2.542e25,
			depolarizationFactor: 0.02,
			rayleighZenithLength: 8400,
			mieV: 3.936,
			mieZenithLength: 34000,
			sunIntensityFactor: 1000,
			sunIntensityFalloffSteepness: 1.5,
			sunAngularDiameterDegrees: 0.00933
		}).onUpdate(function() {
			skyEffectController.updateUniforms();
		});
		
		Actuate.tween(skyEffectController.primaries, duration, {
			x: 6.8e-7,
			y: 5.5e-7,
			z: 4.5e-7
		}).onUpdate(function() {
			skyEffectController.updateUniforms();
		});
		
		Actuate.tween(skyEffectController.cameraPos, duration, {
			x: 100000,
			y: -40000,
			z: 0
		}).onUpdate(function() {
			skyEffectController.updateUniforms();
		});
		
		Actuate.tween(skyEffectController.mieKCoefficient, duration, {
			x: 0.686,
			y: 0.678,
			z: 0.666
		}).onUpdate(function() {
			skyEffectController.updateUniforms();
		});
	}
	
	public function restoreStarsToDefaults():Void {
		starEmitter.position.set(0, 0, -14170);
		starEmitter.positionSpread.set(Main.GAME_VIEWPORT_WIDTH * 12, Main.GAME_VIEWPORT_HEIGHT * 10, 0);
		starEmitter.acceleration.set(0, 0, 0);
		starEmitter.accelerationSpread.set(0, 0, 0);
		starEmitter.velocity.set(0, 0, 0);
		starEmitter.velocitySpread.set(0, 0, 0);
		starEmitter.particleCount = 2000;
		starEmitter.opacityStart = 0.0;
		starEmitter.opacityMiddle = 0.3;
		starEmitter.opacityEnd = 0.0;
		starEmitter.sizeStart = 220;
		starEmitter.sizeMiddle = 220;
		starEmitter.sizeEnd = 220;
		starEmitter.alive = 0.5;
		// NOTE this doesn't reset everything, there are more props...
	}
	
	private function animate(time:Float):Void {
		dt = (time - lastAnimationTime) * 0.001; // Seconds
		lastAnimationTime = time;
		
		// Update entities
		starGroup.tick(dt);
		windGroup.tick(dt);
		
		// Clear the screen
		renderer.clear();
		renderer.render(worldScene, worldCamera);
		
		#if debug
		stats.update();
		#end
		
		Browser.window.requestAnimationFrame(animate);
	}
	
	#if debug
	private inline function setupStats():Void {
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		Browser.window.document.body.appendChild(stats.domElement);
	}
	
	private inline function setupGUI():Void {
		addGUIItem(sceneGUI, worldCamera, "World Camera");
		addGUIItem(particleGUI.addFolder("Star Emitter"), starEmitter, "Star Emitter");
		addGUIItem(particleGUI.addFolder("Wind Emitter"), windEmitter, "Wind Emitter");		
		addGUIItem(shaderGUI, skyEffectController, "Sky Shader");
	}
	
	public function addGUIItem(gui:GUI, object:Dynamic, ?tag:String):GUI {
		if (gui == null || object == null) {
			return null;
		}
		
		var folder:GUI = null;
		
		if (tag != null) {
			folder = gui.addFolder(tag + " (" + guiItemCount++ + ")");
		} else {
			var name:String = Std.string(Reflect.field(object, "name"));
			
			if (name == null || name.length == 0) {
				folder = gui.addFolder("Item (" + guiItemCount++ + ")");
			} else {
				folder = gui.addFolder(Reflect.getProperty(object, "name") + " (" + guiItemCount++ + ")");
			}
		}
		
		if (Std.is(object, Object3D)) {
			var object3d:Object3D = cast object;
			
			folder.add(object3d.position, 'x', -5000.0, 5000.0, 2).listen();
			folder.add(object3d.position, 'y', -5000.0, 5000.0, 2).listen();
			folder.add(object3d.position, 'z', -20000.0, 20000.0, 2).listen();

			folder.add(object3d.rotation, 'x', 0.0, Math.PI * 2, 0.1).listen();
			folder.add(object3d.rotation, 'y', 0.0, Math.PI * 2, 0.1).listen();
			folder.add(object3d.rotation, 'z', 0.0, Math.PI * 2, 0.1).listen();

			folder.add(object3d.scale, 'x', 0.0, 10.0, 0.1).listen();
			folder.add(object3d.scale, 'y', 0.0, 10.0, 0.1).listen();
			folder.add(object3d.scale, 'z', 0.0, 10.0, 0.1).listen();
			
			folder.add(object3d, 'visible');
		}
		
		if (Std.is(object, Mesh)) {
			var mesh:Mesh = cast object;
			var materialFolder = folder.addFolder("material (" + guiItemCount + ")");
			materialFolder.add(mesh.material, "opacity", 0, 1, 0.01).listen();
		}
		
		if (Std.is(object, PerspectiveCamera)) {
			var camera:PerspectiveCamera = cast object;
		}
		
		if (Std.is(object, Emitter)) {
			var emitter:Emitter = cast object;
			
			gui.add(emitter, 'type', ['cube', 'sphere', 'disk']);
			
			var fields = Reflect.fields(emitter);
			
			for (field in fields) {
				var prop = Reflect.getProperty(emitter, field);
				
				if (Std.is(prop, Color)) {
					var folder = gui.addFolder(field);
					folder.add(prop, 'r', 0, 1, 0.01).listen();
					folder.add(prop, 'g', 0, 1, 0.01).listen();
					folder.add(prop, 'b', 0, 1, 0.01).listen();
				}
				else if (Std.is(prop, Vector3)) {
					var folder = gui.addFolder(field);
					folder.add(prop, 'x', -2000, 2000, 0.1).listen();
					folder.add(prop, 'y', -2000, 2000, 0.1).listen();
					folder.add(prop, 'z', -4000, 4000, 0.1).listen();
				}
				else {
					if(Std.is(prop, Float)) {
						gui.add(emitter, field, 0.04).listen();
					}
				}
			}
		}
		
		if (Std.is(object, SkyEffectController)) {
			var controller:SkyEffectController = cast object;
			controller.addGUIItem(controller, gui);
		}
		
		return folder;
	}
	#end
}