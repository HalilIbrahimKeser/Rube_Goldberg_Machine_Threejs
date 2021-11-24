/**
 * Bruker et eksempel fra faglærer Werner som startpunkt skybox2.js
 * For terrreng har vi hentet inn kode fra terreng2.js, deler av det er så flyttet til egen js fil.
 * MyThreeScene kommer fra lib mappen. Den er gjort noen få endringer på.
 * Tween er implementert i TweenElevator.js, kode hentet fra Tween1.js
 *
 *
 */
/**
 * TODO list
 * animate() burde kjøre etter at terreng er lagt inn.
 *
 *
 */

import * as THREE from "../lib/three/build/three.module.js";
import {addCoordSystem} from "../lib/wfa-coord.js";
import {addSkybox} from "./TerrainAndSkybox.js";
import {addTerrainFromOtherClass} from "./TerrainAndSkybox.js";
import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "./SunGear.js";
import {verticalChain} from "./VerticalChain.js";
import {startGearHolder} from "./StartGearHolder.js";
import {tweenElevator} from "./TweenElevator.js";
import {flatTable} from "./FlatTable.js";
import {TWEEN} from "../lib/three/examples/jsm/libs/tween.module.min.js";
import {mySphere} from "../lib/ammohelpers/MySphere.js";


let renderer;
let scene;
let camera;
let currentlyPressedKeys = {};
let clock = new THREE.Clock();


export function main() {
	// SCENE
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(-500, 500, 200);

	//AMMO
	ammoPhysicsWorld.init(myThreeScene.scene);

	// TERRAIN
	addTerrainFromOtherClass();

	// SKYBOX
	addSkybox();

	addModels();

    // RESIZE
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('keydown', handleKeyDown, false);

	animate();
}


function addModels() {
	// SUNGEAR
	sunGear.init(ammoPhysicsWorld);
	sunGear.create();

	//Chains
	verticalChain.init(myThreeScene.scene);
	verticalChain.create();

	//startwall
	startGearHolder.init(ammoPhysicsWorld);
	startGearHolder.create();

	//ballhelper
	mySphere.init(ammoPhysicsWorld);
	mySphere.create();

	// Flat table
	flatTable.init(myThreeScene.scene);
	flatTable.create();

	//elevator
	// tweenElevator.init(myThreeScene.scene);
	// tweenElevator.create();
}


function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

export function animate(currentTime) {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();

    ammoPhysicsWorld.updatePhysics(delta);
	TWEEN.update(currentTime);

	//collisionTest();
	myThreeScene.updateGraphics(delta);
}

function render(delta)
{
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function degreesToRadians(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}
