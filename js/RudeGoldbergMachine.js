/**
 * Demonstrerer skybox vha. CubeTextureLoader
 *
 * SE: https://threejsfundamentals.org/threejs/lessons/threejs-backgrounds.html
 *
 * FLERE SKYBOXBILDER: https://opengameart.org/content/skiingpenguins-skybox-pack
 */
import * as THREE from "../lib/three/build/three.module.js";
import { addCoordSystem} from "../lib/wfa-coord.js";
import {OrbitControls} from '../lib/three/examples/jsm/controls/OrbitControls.js';
import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {sunGear} from "./SunGear.js";

//Globale varianbler:
let renderer;
let scene;
let camera;
let SIZE = 2000;

//Tar vare p? tastetrykk:
let currentlyPressedKeys = {};
let clock = new THREE.Clock();

export function main() {
	//Henter referanse til canvaset:
	//let mycanvas = document.getElementById('webgl');

	//Lager en scene:
	myThreeScene.setupGraphics();
	myThreeScene.camera.position.set(0, 300, 200);



    //Skybox:
	addSkybox();

	//Koordinatsystem:
	addCoordSystem(myThreeScene.scene);

	//Legg modeller til scenen:
	addModels();

	//Koordinatsystem:
	let axes = new THREE.AxesHelper(500);
	myThreeScene.scene.add(axes);

	//ammoPhysicsWorld.init(scene);
	sunGear.init(myThreeScene.scene);
	sunGear.create();


    //Håndterer endring av vindusstørrelse:
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keyup', handleKeyUp, false);
    document.addEventListener('keydown', handleKeyDown, false);

	animate();
}

function addSkybox() {
	const loader = new THREE.CubeTextureLoader();
	const texture = loader.load([
		'../assets/images/dawnmountain-xpos.png',
		'../assets/images/dawnmountain-xneg.png',
		'../assets/images/dawnmountain-ypos.png',
		'../assets/images/dawnmountain-yneg.png',
		'../assets/images/dawnmountain-zpos.png',
		'../assets/images/dawnmountain-zneg.png',
	]);
	myThreeScene.scene.background = texture;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function addModels() {
    //Plan:
    //let textureMap = new THREE.TextureLoader().load('../assets/images/chocchip.png');
    //textureMap.wrapS = THREE.RepeatWrapping;
    //textureMap.wrapT = THREE.RepeatWrapping;
    //textureMap.repeat.x = 10;
    //textureMap.repeat.y = 10;

    let mPlane = new THREE.MeshLambertMaterial(
	{
	    color: 0x444444, // 0x912ff11,
	    side: THREE.DoubleSide,
	    wireframe: false,
	});

    let gPlane = new THREE.PlaneGeometry(SIZE, SIZE);

	let meshPlane = new THREE.Mesh( gPlane, mPlane);
	meshPlane.rotation.x = Math.PI / 2;
	myThreeScene.scene.add(meshPlane);

	//Kube:
	let gCube = new THREE.BoxGeometry(40, 40, 40);
	//let tCube =  new THREE.TextureLoader().load("../assets/images/bird1.png");
	let mCube = new THREE.MeshPhongMaterial({color: 0xFFAC5});
	let cube = new THREE.Mesh(gCube, mCube);
	cube.name = "cube";
	cube.position.x = -70;
	cube.position.y = 0;
	cube.position.z = -100;
	cube.castShadow = true;
	myThreeScene.scene.add(cube);
}

function animate(currentTime) {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
	myThreeScene.updateGraphics(delta);
	//render(delta);
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
