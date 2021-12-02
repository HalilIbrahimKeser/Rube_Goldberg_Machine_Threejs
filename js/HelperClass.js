import * as THREE from "../lib/three/build/three.module.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";

// bilde er hentet fra pngegg.com og klippet ut

export function addSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '../assets/images/pngegg_xpos.png',
        '../assets/images/pngegg_xneg.png',
        '../assets/images/pngegg_ypos.png',
        '../assets/images/pngegg_yneg.png',
        '../assets/images/pngegg_zpos.png',
        '../assets/images/pngegg_zneg.png',
    ]);
    myThreeScene.scene.background = texture;
}
