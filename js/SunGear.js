import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js"


export const sunGear = {
    myPhysicsWorld: undefined,
    material: undefined,
    scene: undefined,

    init(scene){
        this.scene = scene;
    },

    create(setCollisionMask = true, mass = 0, texture = false, color = 0xF5D22E, position = {x:0, y:0, z:0}, radius= 20, url = "assets/images/metalgold.jpg", height = 1){
        if (texture){ //Hvis tekstur er ønsket
            const loadManager = new THREE.LoadingManager();
            const loader = new THREE.TextureLoader(loadManager);
            this.material = new THREE.MeshPhongMaterial({map: loader.load(url)});
        } else {
            this.material = new THREE.MeshPhongMaterial({color: color});
        }

        let cylinderGeo = new THREE.CylinderGeometry(radius, radius,height, 50, 1,false,0,6.3);
        let cylinderMesh = new THREE.Mesh(cylinderGeo, this.material);
        cylinderMesh.userData.tag = "cylinderGear";
        cylinderMesh.position.set(position.x, position.y, position.z);
        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;
        this.scene.add(cylinderMesh);




    }
}