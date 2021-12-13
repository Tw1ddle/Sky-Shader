package;

import external.dat.GUI;
import external.webgl.Detector;
import js.Browser;
import js.three.Color;
import js.three.Mesh;
import js.three.Object3D;
import js.three.PerspectiveCamera;
import js.three.Scene;
import js.three.ShaderMaterial;
import js.three.SphereGeometry;
import js.three.WebGLRenderer;
import motion.easing.*;
import shaders.SkyEffectController;

class Main {
	public static inline var DEGREES_TO_RAD:Float = 0.01745329;
	public static inline var GAME_VIEWPORT_WIDTH:Float = 800;
	public static inline var GAME_VIEWPORT_HEIGHT:Float = 500;
	private static inline var REPO_URL:String = "https://github.com/Tw1ddle/Sky-Shader";
	private static inline var TWITTER_URL:String = "https://twitter.com/Sam_Twidale";
	private static inline var WEBSITE_URL:String = "https://samcodes.co.uk/";
	private static inline var HAXE_URL:String = "https://haxe.org/";
	private static inline var THREEJS_URL:String = "https://github.com/mrdoob/three.js/";
	
	private var guiItemCount:Int = 0;
	public var shaderGUI(default, null):GUI = new GUI( { autoPlace:true } );
	public var sceneGUI(default, null):GUI = new GUI( { autoPlace:true } );
	
	public var worldScene(default, null):Scene = new Scene();
	public var worldCamera(default, null):PerspectiveCamera;

	private var gameAttachPoint:Dynamic;
	private var renderer:WebGLRenderer;
	public var skyEffectController(default, null):SkyEffectController;
	
	private var lastAnimationTime:Float = 0.0; // Last time from requestAnimationFrame
	private var dt:Float = 0.0; // Frame delta time
	
	private static function main():Void {
		var main = new Main();
	}
	
	private inline function new() {
		Browser.window.onload = onWindowLoaded;
	}
	
	private inline function onWindowLoaded():Void {
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
		credits.innerHTML = 'Created for Ludum Dare 33 using <a href=' + HAXE_URL + ' target="_blank">Haxe</a> and <a href=' + THREEJS_URL + ' target="_blank">three.js</a>. Get the code <a href=' + REPO_URL + ' target="_blank">here</a>.';
		gameDiv.appendChild(credits);
		
		// Setup WebGL renderer
		renderer = new WebGLRenderer({ antialias: false });
		renderer.sortObjects = false;
		renderer.autoClear = false;
		renderer.setSize(GAME_VIEWPORT_WIDTH, GAME_VIEWPORT_HEIGHT);
		renderer.setClearColor(new Color(0x222222));
		
		// Setup cameras
		worldCamera = new PerspectiveCamera(30, GAME_VIEWPORT_WIDTH / GAME_VIEWPORT_HEIGHT, 0.5, 2000000);
		// Setup world entities
		skyEffectController = new SkyEffectController(this);
		
		var skyMaterial = new ShaderMaterial( {
			fragmentShader: SkyShader.fragmentShader,
			vertexShader: SkyShader.vertexShader,
			uniforms: SkyShader.uniforms,
			side: cast(1)
		});
		var skyMesh = new Mesh(new SphereGeometry(450000, 32, 15), skyMaterial); // Note 450000 sky radius is used for calculating the sun fade factor in the sky shader
		
		#if debug
		skyMesh.name = "Sky Mesh";
		#end
		
		worldScene.add(skyMesh);

		// Event setup
		// Window resize event
		Browser.document.addEventListener('resize', function(event) {
			
		}, false);
		
		// Disable context menu opening
		Browser.document.addEventListener('contextmenu', function(event) {
			event.preventDefault();
		}, true);
		
		setupGUI();
		
		// Present game and start animation loop
		gameDiv.appendChild(renderer.domElement);
		Browser.window.requestAnimationFrame(animate);
	}
	
	private function animate(time:Float):Void {
		dt = (time - lastAnimationTime) * 0.001; // Seconds
		lastAnimationTime = time;
		
		// Clear the screen
		renderer.clear();
		renderer.render(worldScene, worldCamera);
		
		Browser.window.requestAnimationFrame(animate);
	}
	
	private inline function setupGUI():Void {
		addGUIItem(shaderGUI, skyEffectController, "Sky Shader");
		addGUIItem(sceneGUI, worldCamera, "World Camera");
	}
	
	private function addGUIItem(gui:GUI, object:Dynamic, ?tag:String):GUI {
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
		}
		
		if (Std.is(object, SkyEffectController)) {
			var controller:SkyEffectController = cast object;
			controller.addGUIItem(controller, gui);
		}
		
		return folder;
	}
}