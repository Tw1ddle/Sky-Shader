# Sky and Particles

Building on the sky shader and particle system code used in my entry for Ludum Dare 33, [Otherworldly Stars](http://samcodes.itch.io/otherworldly-stars).

### Usage

Use the controls in the top right of the screen to modify the shader and particle system values.

### Screenshots

![Screenshot1](https://github.com/Tw1ddle/ludum-dare-33/blob/master/dev/screenshots/screenshot1.png?raw=true "Screenshot 1")

![Screenshot2](https://github.com/Tw1ddle/ludum-dare-33/blob/master/dev/screenshots/screenshot2.png?raw=true "Screenshot 2")

![Screenshot3](https://github.com/Tw1ddle/ludum-dare-33/blob/master/dev/screenshots/screenshot3.png?raw=true "Screenshot 3")

### Credits

This project is written using the [Haxe](http://haxe.org/) programming language and depends on:

* [three.js](https://github.com/mrdoob/three.js) for rendering.
* Yaroslav Sivakov's [three.js](http://lib.haxe.org/u/yar3333/) externs.
* The sky shader is a derivative of the three.js [example](http://threejs.org/examples/js/SkyShader.js).
* Luke Moody's [ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine) particle engine and editor for three.js.
* dataart's [dat.gui](https://github.com/dataarts/dat.gui) lightweight debug UI library.

### Notes
* This demo requires a recent graphics card and modern browser to run at all, and probably needs a fast computer to run at full speed. 
* At time of writing this is broken on IE due to the dat.gui debug UI library not working on IE.