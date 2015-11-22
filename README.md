# Sky and Particle Shader Editor

Configurable sky and particle editor. Run it in the browser [here](http://samcodes.itch.io/sky-shader-editor). The WebGL shader is based on the [Preetham Model](http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf) and this [three.js](http://threejs.org/examples/js/SkyShader.js) example.

This also builds on the sky shader and particle system code used in my entry for Ludum Dare 33, [Otherworldly Stars](http://samcodes.itch.io/otherworldly-stars).

## Usage ##

Use the controls in the top right of the [browser demo](http://samcodes.itch.io/sky-shader-editor) to modify the shader and particle system values.

## Screenshots ##

![Screenshot3](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_3.png?raw=true "Screenshot 3")

![Screenshot2](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_2.png?raw=true "Screenshot 2")

![Screenshot1](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_1.png?raw=true "Screenshot 1")

## Credits ##

This project is written using the [Haxe](http://haxe.org/) programming language and relies on:

* [three.js](https://github.com/mrdoob/three.js) for rendering.
* Yaroslav Sivakov's [three.js](http://lib.haxe.org/u/yar3333/) externs.
* The sky shader is a derivative of this three.js [example](http://threejs.org/examples/js/SkyShader.js).
* Luke Moody's [ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine) particle engine and editor for three.js.
* dataart's [dat.gui](https://github.com/dataarts/dat.gui) lightweight debug UI library.

## Notes ##
* This requires a recent graphics card and modern browser with WebGL support to run. 
* At time of writing this is broken on IE due to the dat.gui UI library used not working properly with IE.
