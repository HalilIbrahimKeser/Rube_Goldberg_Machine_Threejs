/**
 * Bruker et eksempel fra faglærer Werner som startpunkt skybox2.js
 *
 *
 *
 *
 */
import * as THREE from "../lib/three/build/three.module.js";
import { addCoordSystem} from "../lib/wfa-coord.js";
import { loadTerrain } from "../lib/wfa-utils.js";
import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "./SunGear.js";
import {verticalChain} from "./VerticalChain.js";
import {startGearHolder} from "./StartGearHolder.js";
// import {addTerrain} from "./Terrain.js";

let renderer;
let scene;
let camera;
let SIZE = 1000;

let currentlyPressedKeys = {};
let clock = new THREE.Clock();

//Terreng:
let meshTerrain;

// Holder på alle lastede teksturer:
let loadedTextures = {};

export function main() {

	// SCENE
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(0, 300, 200);

    // SKYBOX
	addSkybox();

	// COORD
	addCoordSystem(myThreeScene.scene);
	let axes = new THREE.AxesHelper(500);
	myThreeScene.scene.add(axes);

	// SUNGEAR
	sunGear.init(myThreeScene.scene);
	sunGear.create();

	//Chains
	verticalChain.init(myThreeScene.scene);
	verticalChain.create();

	//startwall
	startGearHolder.init(myThreeScene.scene);
	startGearHolder.create();


    // RESIZE
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('keydown', handleKeyDown, false);

	loadTextures();

	animate();
}

function addSkybox() {
	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'../assets/images/pngegg_xpos.png',
		'../assets/images/pngegg_xneg.png',
		'../assets/images/pngegg_ypos.png',
		'../assets/images/pngegg_yneg.png',
		'../assets/images/pngegg_zpos.png',
		'../assets/images/pngegg_zneg.png',

		// '../assets/images/grass_xpos.jpg',
		// '../assets/images/grass_xneg.jpg',
		// '../assets/images/grass_ypos.jpg',
		// '../assets/images/grass_yneg.jpg',
		// '../assets/images/grass_zpos.jpg',
		// '../assets/images/grass_zneg.jpg',
	]);
	myThreeScene.scene.background = texture;
}

function loadTextures() {
	let texturesToLoad = [
		{name: 'jotunheimen-texture', url: '../assets/images/jotunheimen-texture.png'},
	];
	const loader = new THREE.TextureLoader();
	loader.load( '../assets/images/jotunheimen-texture.png', (texture) => {
		loadedTextures['jotunheimen-texture'] = texture;
		texturesToLoad.splice(texturesToLoad.indexOf(0), 1);
			loadTerrain("../assets/jotunheimen.bin", terrainLoaded);
			},
			undefined,
			function (err) {
				console.error('Feil ved lasting av teksturfiler...');
			});
}

function terrainLoaded(heightData) {
	addTerrain();

	const vertexPositions = meshTerrain.geometry.attributes.position.array;
	let index = 0;

	for (let i = 0; i < meshTerrain.geometry.attributes.position.count; i++)
	{
		index++;    // øker med 1 for å "gå forbi" x.
		index++;    // øker med 1 for å "gå forbi" y.
		vertexPositions[ index++] = heightData[i] / 30000 * 70;
	}
	meshTerrain.geometry.computeVertexNormals();

}
function addTerrain() {
	let gPlane = new THREE.PlaneGeometry(SIZE * 2, SIZE * 2, 199, 199);
	let mPlane = new THREE.MeshPhongMaterial({
		map: loadedTextures['jotunheimen-texture']
	});
	meshTerrain = new THREE.Mesh( gPlane, mPlane);
	meshTerrain.rotation.x = -Math.PI / 2;
	meshTerrain.receiveShadow = true;	//NB!
	meshTerrain.position.y = -150
	myThreeScene.scene.add(meshTerrain);
}
function collisionTest() {
	// //Sjekker de ulike helikopterdelene mot collidableMeshList dvs. kubene:
	// let cockpit = helicopter.getObjectByName("cockpit", true);
	// cockpit.updateMatrixWorld();
	// collisionTestMesh(cockpit);
	// let body = helicopter.getObjectByName("body", true);
	// body.updateMatrixWorld();
	// collisionTestMesh(body);
	// let rotor = helicopter.getObjectByName("rotor", true);
	// rotor.updateMatrixWorld();
	// collisionTestMesh(rotor);
}

function collisionTestMesh(_mesh) {
	// //Gjør først grovsjekk vha. boundingsphere:
	// if (coarseCollisionTest(_mesh, collidableMeshList)) {		//Se wfa-collision.js
	// 	//Dersom overlapp mellom sfærene gjøres en finere sjekk vha. Raycast
	// 	if (fineCollisionTest(_mesh, collidableMeshList)) {  	//Se wfa-collision.js
	// 		heliSpeed = 0;
	// 		positionVector = new THREE.Vector3(-3,0,-1);
	// 	}
	// }
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function animate(currentTime) {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();

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
