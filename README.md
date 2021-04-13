[![Project logo](https://github.com/Tw1ddle/Sky-Shader/blob/master/screenshots/logo.png?raw=true "Sky Shader")](https://tw1ddle.github.io/Sky-Shader/)

[![Build Status](https://img.shields.io/travis/Tw1ddle/Sky-Shader.svg?style=flat-square)](https://travis-ci.org/Tw1ddle/Sky-Shader)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/Tw1ddle/Sky-Shader/blob/master/LICENSE)

Interactive procedurally generated sun and skies. Run it [in your browser](https://tw1ddle.github.io/Sky-Shader/).

This extends code from my Ludum Dare 33 entry, [Otherworldly Stars](https://github.com/Tw1ddle/Ludum-Dare-33).

## Usage

Use the controls in the top right of the demo page to modify the shader variables and create your own skies.

## Screenshots

![Sky Shader Animation](https://github.com/Tw1ddle/Sky-Shader/blob/master/screenshots/sky_shader_animation.gif "Sky Shader Animation")

![Sky Shader Screenshot 1](https://github.com/Tw1ddle/Sky-Shader/blob/master/screenshots/screenshot_1.png?raw=true "Sky Shader Screenshot 1")

![Sky Shader Screenshot 2](https://github.com/Tw1ddle/Sky-Shader/blob/master/screenshots/screenshot_2.png?raw=true "Sky Shader Screenshot 2")

![Sky Shader Screenshot 3](https://github.com/Tw1ddle/Sky-Shader/blob/master/screenshots/screenshot_3.png?raw=true "Sky Shader Screenshot 3")

## Credits

The project is written in [Haxe](http://haxe.org/) and uses:

* [three.js](https://github.com/mrdoob/three.js) for rendering.
* Yaroslav Sivakov's [three.js](http://lib.haxe.org/u/yar3333/) externs.
* dataart's [dat.gui](https://github.com/dataarts/dat.gui) debug UI library.
* The sky shader is based on a three.js [example](https://threejs.org/examples/).

## Notes
 * If you have any questions or suggestions then [get in touch](https://twitter.com/Sam_Twidale) or open an issue.
 * At time of writing this is broken on IE due to the dat.gui library not working on IE.