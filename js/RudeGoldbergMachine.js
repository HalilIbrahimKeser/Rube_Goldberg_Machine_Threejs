/**
 * Bruker et eksempel fra faglærer Werner som startpunkt skybox2.js
 * Terreng har vi tatt i bruk terraing.js fra helpers
 * MyThreeScene kommer fra lib mappen. Den er gjort noen få endringer på.
 * Tween er implementert i TweenElevator.js, kode hentet fra Tween1.js
 * Slutt animasjon er laget med partikler fra particles1.js
 *
 * Laget av Nancy A. Lacsamana, Asbjørn Bjørge og Halil I. Keser
 */

import * as THREE from "../lib/three/build/three.module.js";
import {addSkybox} from "./HelperClass.js";
import {myTerrain} from "../lib/ammohelpers/MyTerrain.js";
import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "./SunGear.js";
import {startGearHolder} from "./StartGearHolder.js";
import {flatTableUnder} from "./FlatTableUnder.js";
import {mySphere} from "../lib/ammohelpers/MySphere.js";
import {trampoline} from "./Trampoline.js";
import {flapDoor} from "./FlapDoor.js";
import {tube} from "./Tube.js";
import {rightTrack} from "./RightTrack.js";
import {flatTableTop} from "./FlatTableTop.js";
import {leftTrack} from "./LeftTrack.js";
import {domino} from "./Domino.js";
import {verticalChain} from "./VerticalChain.js";

let currentlyPressedKeys = {};
let clock = new THREE.Clock();
let timer = 0;

let finnished = false;
let points;
let particlesAdded = false;



export function main() {
	// SCENE
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(-500, 500, 200);

	//AMMO
	ammoPhysicsWorld.init(myThreeScene.scene);

	// TERRAIN
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
	sunGear.create(true,
		110,
		Math.random() * 0xffffff,
		{x:132, y:150, z:-250},
		15,
		15,
		false,
		false,
		false,
		true,
		{x: 0, y: 0, z: 0},
		{x: Math.PI/2, y: 0, z: 0},
		0.2,
		0.1);

	//startwall
	startGearHolder.init(ammoPhysicsWorld);
	startGearHolder.create();

	//Balls
	mySphere.init(ammoPhysicsWorld);
	//Ball on start
	mySphere.create(true,
		{x:-270, y:410, z:-475},
		Math.random() * 0xffffff,
		30,
		0.7,
		0.2);
	//First ball on right track
	mySphere.create(true,
		{x:420, y:530, z:-440},
		Math.random() * 0xffffff,
		30,
		3,
		0.3);
	//Ball on slide, big one
	mySphere.create(true,
		{x:390, y:220, z:-85},
		Math.random() * 0xffffff,
		30,
		1,
		1);
	//Ball after the large ball
	/*mySphere.create(true,
		{x:130, y:150, z:-250},
		Math.random() * 0xffffff,
		30,
		1,
		0.3);*/

	//Ball on table
	mySphere.create(true,
		{x:-160, y:40, z:-250},
		Math.random() * 0xffffff,
		1,
		1.5,
		10);

	//Ball on top of the Left track
	mySphere.create(true,
		{x:-400, y:360, z:200},
		Math.random() * 0xffffff,
		20,
		0.5,
		0.5);

	// FlappDoor
	flapDoor.init(ammoPhysicsWorld);
	//Drawbridge type on start
	flapDoor.create(true,
		{x:-109, y:90, z:-477,},
		{x: 1, y:0, z: 0},
		Math.PI/2,
		{x: 70, y: 27, z: 2},
		0.5,
		0,
		5, -1.8, Math.PI/6,0);

	//Door by the end of tunnel
	flapDoor.create(true,
		{x:370, y:400, z:-400,},
		{x: 0, y:1, z: 0},
		Math.PI/2,
		{x: 120, y: 80, z: 2},
		20,
		0,
		5,
		-2,
		Math.PI/2-0.05,0);

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
		-4,
		0.1);

	//Door by the end of slide
	flapDoor.create(true,
		{x:130, y:120, z:-140,},
		{x: 0, y:1, z: 0},
		Math.PI/2,
		{x: 130, y: 60, z: 2},
		50,
		0,
		5,
		-Math.PI/2,
		Math.PI/2,
		0.1);

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
		Math.PI/2, 1.4, 0, 5.2);

	//Lower Trampoline towards left track
	trampoline.create(true,
		{x:-70, y:60, z:-250},
		Math.random() * 0xffffff,
		0, 50, 20,
		Math.PI/2, 0.3, 0, 2.1);
	//Middle Trampoline towards Left track
	trampoline.create(true,
		{x:-220, y:280, z:-250},
		Math.random() * 0xffffff,
		0, 60, 20,
		-1.2, Math.PI/3, 0, 5);

	//Upper trampoline towards left track
	trampoline.create(true,
		{x:200, y:450, z:-180},
		Math.random() * 0xffffff,
		0, 50, 20,
		0.1, -Math.PI/2.9, 0, 0.5);


	//Tube
	tube.init(ammoPhysicsWorld);
	tube.create();
	tube.create(true,
		{x:200, y:20, z:-485},
		Math.random() * 0xffffff,
		0,
		90,
		0.7,
		160,
		0,0,0,
		0.2);

	// //Høyre bane
	rightTrack.init(ammoPhysicsWorld);
	rightTrack.create();

	// Flat table
	flatTableUnder.init(ammoPhysicsWorld);
	flatTableUnder.create();

	flatTableTop.init(ammoPhysicsWorld);
	flatTableTop.create();

	// Bricks
	domino.init(ammoPhysicsWorld);
	setLeftDominoes();

	leftTrack.init(ammoPhysicsWorld);
	leftTrack.create();

	// Elevator
	// NB NB! Kommentert ut, gjør at siden blir veldig forsinket. Sendt mail til Werner, ikke hørt noe enda.

	// tweenElevator.init(ammoPhysicsWorld);
	// tweenElevator.create();
}

function addParticles() {
	createParticles2();
}

//Lage partikler vha. PointsMaterial
function createParticles2() {
	let material = new THREE.PointsMaterial({
		size: 5,
		vertexColors : true,
		color : Math.random() * 0xff500
	});

	// Liste med vertekser:
	let range = 2000;
	let vertices = [];
	let colors = [];
	for (let i = 0; i < 15000; i++) {
		const x = THREE.MathUtils.randFloatSpread( range );
		const y = THREE.MathUtils.randFloatSpread( range );
		const z = THREE.MathUtils.randFloatSpread( range );
		vertices.push( x, y, z );
		let color = new THREE.Color(Math.random() * 0x00ffff);
		colors.push(color.r, color.g, color.b);
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( vertices, 3 ) );
	points = new THREE.Points(geometry, material);
	myThreeScene.scene.add(points);
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

export function animate(currentTime) {
	requestAnimationFrame(animate);

	let delta = clock.getDelta() * 1;

	ammoPhysicsWorld.updatePhysics(delta);

	myThreeScene.updateGraphics(delta);

	//TWEEN.update(currentTime);

	timer = currentTime;
	if(timer > 130000) {
		finnished = true;
	}
	if (finnished) {
		document.getElementById('audio').play();
		if (!particlesAdded) {
			addParticles();
		}
		particlesAdded = true;
		let x = points.position.x;
		let y = points.position.y
		let z = points.position.z;
		points.position.y = y + 4;
	}
	render();
}

function onWindowResize() {
	/** myThreeScene.camera eller camera ? */
	myThreeScene.camera.aspect = window.innerWidth / window.innerHeight;
	myThreeScene.camera.updateProjectionMatrix();
}

export function animateOnMain(time) {
	animate();
}

function setLeftDominoes(){
	//domino.create();

	domino.create(true,
		{x:-140, y:45, z:40},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});

	domino.create(true,
		{x:-100, y:45, z:47},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});

	domino.create(true,
		{x:-60, y:45, z:54},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});

	domino.create(true,
		{x:-20, y:45, z:61},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});

	domino.create(true,
		{x:20, y:45, z:68},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});

	domino.create(true,
		{x:60, y:45, z:75},
		Math.random() * 0xffffff,
		1,
		{x:2.5, y:8, z:8},
		{x:0, y:1.4, z:0});
}
