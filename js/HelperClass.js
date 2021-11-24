import * as THREE from "../lib/three/build/three.module.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";


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
