# Skies and Particles

Interactive procedural skies and particle systems. Run it in the browser [here](http://samcodes.itch.io/sky-shader-editor).

This extends the code used in my Ludum Dare 33 entry, [Otherworldly Stars](http://samcodes.itch.io/otherworldly-stars).

### Usage

Use the controls in the top right of the screen to modify the shader and particle system and create your own skies.

### Screenshots

![Screenshot1](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_1.png?raw=true "Screenshot 1")

![Screenshot2](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_2.png?raw=true "Screenshot 2")

![Screenshot3](https://github.com/Tw1ddle/Sky-Particles-Shader/blob/master/dev/screenshots/screenshot_3.png?raw=true "Screenshot 3")

### Credits

This project is written in [Haxe](http://haxe.org/) and uses:

* [three.js](https://github.com/mrdoob/three.js) for rendering.
* Yaroslav Sivakov's [three.js](http://lib.haxe.org/u/yar3333/) externs.
* The sky shader is based on this three.js [demo](http://threejs.org/examples/js/SkyShader.js).
* Luke Moody's [ShaderParticleEngine](https://github.com/squarefeet/ShaderParticleEngine) particle engine and editor for three.js.
* dataart's [dat.gui](https://github.com/dataarts/dat.gui) debug UI library.

### Notes
* At time of writing this is broken on IE due to the dat.gui debug UI library not working on IE.