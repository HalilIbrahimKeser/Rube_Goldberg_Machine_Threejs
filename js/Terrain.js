import * as THREE from "../lib/three/build/three.module.js";
import { addTerrainFromTerrainClass } from "./RudeGoldbergMachine.js";
import {loadTerrain} from "../lib/wfa-utils";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene";

//ALLE TERRAIN FUNKSJONER FLYTTES HIT

//Terreng:
let meshTerrain;

// Holder på alle lastede teksturer:
let loadedTextures = {};

export function addTerrain() {
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


export function terrainLoaded(heightData) {


}

export function addTerrainFromTerrainClass(meshTerrain) {
    scene.add(meshTerrain);
}

