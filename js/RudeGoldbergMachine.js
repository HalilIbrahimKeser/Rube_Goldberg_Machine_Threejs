/**
 * Bruker et eksempel fra faglærer Werner som startpunkt skybox2.js
 *
 *
 *
 *
 */
import * as THREE from "../lib/three/build/three.module.js";
import { addCoordSystem} from "../lib/wfa-coord.js";
import {OrbitControls} from '../lib/three/examples/jsm/controls/OrbitControls.js';
import { loadTerrain } from "../lib/wfa-utils.js";
import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "./SunGear.js";

//Globale varianbler:
let renderer;
let scene;
let camera;
let SIZE = 2000;

//rotasjoner
let angle = 0.0;
let lastTime = 0.0;

//Roter & zoom:
let controls; //rotere, zoone hele scenen.

//Tar vare på tastetrykk:
let currentlyPressedKeys = {};
let clock = new THREE.Clock();

//Figurer som helikoptret kan kræsje i:
let collidableMeshList = [];

//Terreng:
let meshTerrain;

// Holder på alle lastede teksturer:
let loadedTextures = {};

export function main() {
	//Henter referanse til canvaset:
	/*let mycanvas = document.getElementById('webgl');

	//Lager en scene:
	scene = new THREE.Scene();

	//Lager et rendererobjekt (og setter st�rrelse):
	renderer = new THREE.WebGLRenderer({canvas:mycanvas, antialias:true});
	renderer.autoClearColor = false;
	renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true; //NB!
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

    //Kamera:
	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight;  // the canvas default
	const near = 0.1;
	const far = 2000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.x = 10;
	camera.position.y = 100;
	camera.position.z = 200;
	let target = new THREE.Vector3(0.0, 0.0, 0.0);
	camera.lookAt(target);

	//Retningsorientert lys:
	let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	directionalLight1.position.set(2, 1, 4);
	scene.add(directionalLight1);

	let directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	directionalLight2.position.set(-2, 1, -4);
	scene.add(directionalLight2);

	//Roter/zoom hele scenen:
	controls = new OrbitControls(camera, mycanvas);
	addControls();*/

	// three:
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(0, 300, 200);


    //Skybox:
	addSkybox();

	//Koordinatsystem:
	addCoordSystem(myThreeScene.scene);

	//Legg modeller til scenen:
	// addModels();

	//Koordinatsystem:
	let axes = new THREE.AxesHelper(500);
	myThreeScene.scene.add(axes);

	//SUNGEAR
	sunGear.init(myThreeScene.scene);
	sunGear.create();

    //Håndterer endring av vindusstørrelse:
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('keydown', handleKeyDown, false);

	// animate();

	loadTextures();
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
		{name: 'bird1', url: '../assets/images/bird1.png'},
		{name: 'metal1', url: '../assets/images/metal1.jpg'},
		{name: 'chocchip', url: '../assets/images/chocchip.png'},
	];
	const loader = new THREE.TextureLoader();
	for ( let image of texturesToLoad ) {
		// Laster bilde for bilde vha. TextureLoader:
		loader.load(
			image.url,
			(texture) => {
				// Legger lastet tekstur i loadedTexures:
				loadedTextures[image.name] = texture;
				// Fjerner et og et element fra texturesToLoad:
				texturesToLoad.splice(texturesToLoad.indexOf(image), 1);
				// Når texturesToLoad er tomt er vi ferdig med lasting av teksturer:
				if (!texturesToLoad.length) {
					//Alle teksturer er nå lastet... FORTSETTER:
					// Høydeverdiene ligger i en .bin fil (200x200 = 40000 verdier).
					loadTerrain("../assets/jotunheimen.bin", terrainLoaded); 	// lib/wfa-utils.js
				}
			},
			undefined,
			function (err) {
				console.error('Feil ved lasting av teksturfiler...');
			});
	}
}
//Denne kjøres når høydedata er ferdiga lastet og generert.
//heightData = et array bestående av 16 bits heltall.
function terrainLoaded(heightData) {
	// Legger til et terreng-mesh:
	addTerrain();

	// Setter z-posisjonen til terrengmeshets vertekser i henhold til verdiene i heightData.
	const vertexPositions = meshTerrain.geometry.attributes.position.array;    //NB! MERK .array
	let index = 0;
	// Gjennomløper alle vertekser (hver verteks består av tre verdier; x,y,z)
	// til meshet, endrer z-verdien:
	for (let i = 0; i < meshTerrain.geometry.attributes.position.count; i++)
	{
		index++;    // øker med 1 for å "gå forbi" x.
		index++;    // øker med 1 for å "gå forbi" y.
		//Endrer z-verdien, øker index med for å gå til neste verteks sin x.
		vertexPositions[ index++] = heightData[i] / 30000 * 70;
	}
	meshTerrain.geometry.computeVertexNormals();      // NB! Viktig for korrekt belysning.

	// Alt på plass - fortsetter!
	addModels();
	animate();
}
function addTerrain() {
	//Gir 199 x 199 ruter (hver bestående av to trekanter). Texturen er 200x200 piksler.
	let gPlane = new THREE.PlaneGeometry(SIZE * 2, SIZE * 2, 199, 199);
	let mPlane = new THREE.MeshPhongMaterial({
		//color: 0x91aff11,
		map: loadedTextures['jotunheimen-texture']
	});
	// Bruker IKKE tiling her, teksturen dekker hele planet.
	meshTerrain = new THREE.Mesh( gPlane, mPlane);
	meshTerrain.rotation.x = -Math.PI / 2;
	meshTerrain.receiveShadow = true;	//NB!
	meshTerrain.position.y = -150
	myThreeScene.scene.add(meshTerrain);
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function addModels() {
    // //Plan:
    // let textureMap = new THREE.TextureLoader().load('../assets/images/chocchip.png');
    // textureMap.wrapS = THREE.RepeatWrapping;
    // textureMap.wrapT = THREE.RepeatWrapping;
    // textureMap.repeat.x = 10;
    // textureMap.repeat.y = 10;
	//
    // let mPlane = new THREE.MeshLambertMaterial(
	// {
	//     color: 0xFFAC5, // 0x912ff11,
	//     side: THREE.DoubleSide,
	//     map: textureMap,
	//     flatShading: false,
	//     wireframe: false,
	// });
    // let gPlane = new THREE.PlaneGeometry(SIZE, SIZE);
	// let meshPlane = new THREE.Mesh( gPlane, mPlane);
	// meshPlane.rotation.x = Math.PI / 2;
	// scene.add(meshPlane);

	//Kube:
	//Definerer geometri og materiale (her kun farge) for en kube:
	let gCube = new THREE.BoxGeometry(40, 40, 40);
	let mCube = new THREE.MeshPhongMaterial({map : loadedTextures['bird1']});
	let cube = new THREE.Mesh(gCube, mCube);
	//Legger kuben til scenen:
	cube.position.x = -70;
	cube.position.y = 120;
	cube.position.z = -100;
	cube.castShadow = true;
	cube.receiveShadow = true;	//NB!
	cube.geometry.computeBoundingSphere();
	myThreeScene.scene.add(cube);

	collidableMeshList.push(cube);

}

function addControls() {

	controls.target.set(0, 0, 0);
	controls.minDistance = 10;
	controls.maxDistance = 500;
	controls.maxPolarAngle = degreesToRadians(89); //zoom går ikke under planet

	// controls.addEventListener( 'change', render);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 10;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

}

function animate(currentTime) {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();

	collisionTest();
	myThreeScene.updateGraphics(delta);
	//controls.update();
	//render(delta);
}

function render(delta)
{
    renderer.render(scene, camera);
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
