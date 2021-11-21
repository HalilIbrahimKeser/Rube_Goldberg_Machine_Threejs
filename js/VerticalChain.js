import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";


export const verticalChain = {
    myPhysicsWorld: undefined,
    scene: undefined,

    init(scene){
        this.scene = scene;
    },

    create(setCollisionMask = true, mass = 2, color = 0x979A9A, position = {x:-278, y:195, z:12}, radius= 2.8, tube = 0.8, chainNr= 24){
        let chainGroup = new THREE.Group();
        this.scene.add(chainGroup);

        let chainFrontGeo = new THREE.TorusGeometry(radius, tube, 16, 100, 6.3);
        let chainFrontMesh = new THREE.Mesh(chainFrontGeo, new THREE.MeshPhongMaterial({color: color}));
        chainFrontMesh.position.set(position.x, position.y -8, position.z);
        chainFrontMesh.scale.set(1, 2, 1);
        chainFrontMesh.receiveShadow = true;
        chainFrontMesh.castShadow = true;
        chainGroup.add(chainFrontMesh);

        let chainSideMesh = chainFrontMesh.clone();
        chainSideMesh.rotation.y = Math.PI/2;
        chainSideMesh.position.y = position.y;
        chainGroup.add(chainSideMesh);

        for (let i = 2, j = 3; i < chainNr, j <chainNr+1; i+=2, j+=2){
            let chainSideClone = chainSideMesh.clone();
            chainSideClone.position.y = chainSideMesh.position.y - (i*8);
            let chainFrontClone = chainFrontMesh.clone();
            chainFrontClone.position.y = chainFrontMesh.position.y - (i*8) ;
            chainGroup.add(chainFrontClone);
            chainGroup.add(chainSideClone);

        }
    }
}


