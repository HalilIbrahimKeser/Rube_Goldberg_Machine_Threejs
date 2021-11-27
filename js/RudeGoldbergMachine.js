/**
 * Bruker et eksempel fra faglærer Werner som startpunkt skybox2.js
 *
 * For terrreng har vi hentet inn kode fra terreng2.js, deler av det er så flyttet til egen js fil.
 * Senere har vi heller tatt i bruk terraing.js fra helpers
 *
 * MyThreeScene kommer fra lib mappen. Den er gjort noen få endringer på.
 * Tween er implementert i TweenElevator.js, kode hentet fra Tween1.js
 *
 *
 */
/**
 * TODO list
 *
 *
 * Endret til deltatime til currenTime. Nå fungerer siden mye raskere :) tips fra Jørgen. HIK 25.11.21
 */

import * as THREE from "../lib/three/build/three.module.js";
import {addSkybox} from "../js/HelperClass.js";

// import {addTerrain} from "./Terrain.js";
import {myTerrain} from "../lib/ammohelpers/MyTerrain.js";

import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "../js/SunGear.js";
import {verticalChain} from "../js/VerticalChain.js";
import {startGearHolder} from "../js/StartGearHolder.js";
import {tweenElevator} from "../js/TweenElevator.js";
import {flatTable} from "../js/FlatTable.js";
import {TWEEN} from "../lib/three/examples/jsm/libs/tween.module.min.js";
import {mySphere} from "../lib/ammohelpers/MySphere.js";
import {bricks} from "../js/Bricks.js";
import {trampoline} from "./Trampoline.js";
import {flapDoor} from "../js/FlapDoor.js";
import {tube} from "./Tube.js";
import {rightTrack} from "./RightTrack.js";


let renderer;
let scene;
let camera;
let currentlyPressedKeys = {};
let clock = new THREE.Clock();

let isTerrainHeightLoaded = false;


export function main() {
	// SCENE
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(-500, 500, 200);

	//AMMO
	ammoPhysicsWorld.init(myThreeScene.scene);

	// // Camera
	//camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 5000);

	// TERRAIN
	//addTerrain();
	myTerrain.init(ammoPhysicsWorld);
	myTerrain.create();

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
	/*verticalChain.init(ammoPhysicsWorld);
	verticalChain.create();*/

	//startwall
	startGearHolder.init(ammoPhysicsWorld);
	startGearHolder.create();

	//ballhelper
	mySphere.init(ammoPhysicsWorld);
	mySphere.create();
	mySphere.create(true,
		{x:420, y:530, z:-440},
		Math.random() * 0xffffff,
		30,
		3,
		0.3);

	// Flat table
	flatTable.init(ammoPhysicsWorld);
	flatTable.create();

	// Elevator
	/*tweenElevator.init(ammoPhysicsWorld);
	tweenElevator.create();*/

	// FlappDoor
	flapDoor.init(ammoPhysicsWorld);
	//Drawbridge type on start
	flapDoor.create(true,
		{x:-111, y:90, z:-477,},
		{x: 1, y:0, z: 0},
		Math.PI/2,
		{x: 70, y: 27, z: 2},
		0.5,
		0,
		5, -1.68, Math.PI/6);

	//Door by the end of tunnel
	flapDoor.create(true,
		{x:370, y:400, z:-400,},
		{x: 0, y:1, z: 0},
		Math.PI/2,
		{x: 120, y: 80, z: 2},
		0.5,
		0,
		5,
		-2,
		Math.PI/2-0.05);

	//Door by the stairs
	flapDoor.create(true,
		{x:400, y:280, z:-130,},
		{x: 0, y:1, z: 0},
		Math.PI/2,
		{x: 90, y: 205, z: 2},
		0.5,
		0,
		5,
		4,
		-4);

	//Trampoline
	trampoline.init(ammoPhysicsWorld);
	trampoline.create(); //First
	trampoline.create(true,
		{x:350, y:230, z:-490},
		Math.random() * 0xffffff,
		0, 50, 30,
		Math.PI/2, 1.25, 0, 3);
	trampoline.create(true,
		{x:-95, y:475, z:-490},
		Math.random() * 0xffffff,
		0, 60, 30,
		Math.PI/2, 1.4, 0, 3);

	//Tube
	tube.init(ammoPhysicsWorld);
	tube.create();

	//Bane
	rightTrack.init(ammoPhysicsWorld);
	rightTrack.create();

	// Bricks
	bricks.init(ammoPhysicsWorld);
	bricks.create();
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

	//TWEEN.update(currentTime);

	//collisionTest();
	myThreeScene.updateGraphics(currentTime);

	render();
}

function render(delta)
{
    //renderer.render(scene, camera);
}

function onWindowResize() {
	/** myThreeScene.camera eller camera ? */
	myThreeScene.camera.aspect = window.innerWidth / window.innerHeight;
	myThreeScene.camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);
    //render();
}

export function animateOnMain() {
	animate();
}