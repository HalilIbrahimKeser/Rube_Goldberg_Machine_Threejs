import * as THREE from "../lib/three/build/three.module.js";
// import { addTerrainFromTerrainClass } from "./RudeGoldbergMachine.js";
import {loadTerrain} from "../lib/wfa-utils.js";
// import {animate} from "./RudeGoldbergMachine.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";


let meshTerrain;
let loadedTextures = {};
let SIZE = 1000;

export function addSkybox() {
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

export function addTerrainFromOtherClass() {
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

export function terrainLoaded(heightData) {
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


// function collisionTest() {
//     // //Sjekker de ulike helikopterdelene mot collidableMeshList dvs. kubene:
//     // let cockpit = helicopter.getObjectByName("cockpit", true);
//     // cockpit.updateMatrixWorld();
//     // collisionTestMesh(cockpit);
//     // let body = helicopter.getObjectByName("body", true);
//     // body.updateMatrixWorld();
//     // collisionTestMesh(body);
//     // let rotor = helicopter.getObjectByName("rotor", true);
//     // rotor.updateMatrixWorld();
//     // collisionTestMesh(rotor);
// }
//
// function collisionTestMesh(_mesh) {
//     // //Gjør først grovsjekk vha. boundingsphere:
//     // if (coarseCollisionTest(_mesh, collidableMeshList)) {		//Se wfa-collision.js
//     // 	//Dersom overlapp mellom sfærene gjøres en finere sjekk vha. Raycast
//     // 	if (fineCollisionTest(_mesh, collidableMeshList)) {  	//Se wfa-collision.js
//     // 		heliSpeed = 0;
//     // 		positionVector = new THREE.Vector3(-3,0,-1);
//     // 	}
//     // }
// }
