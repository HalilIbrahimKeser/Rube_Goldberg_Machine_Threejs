import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

//Basert på mycompoundtv.js

export const domino = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true,
           position={x:-180, y:45, z:33},
           color=Math.random() * 0xffffff,
           mass=10,
           scale={x:2.5, y:8, z:9},
           rotation={x:0, y:1.4, z:0}) {

        let scaleScreen = {x: 16, y: 8, z: 1};
        let originScreen = {x: 0, y: 6.5, z: 0};


        // THREE:
        let compoundMesh = new THREE.Group();
        compoundMesh.scale.set(scale.x, scale.y, scale.z);
        compoundMesh.rotation.set(rotation.x, rotation.y, rotation.z);
        compoundMesh.userData.tag = 'tv';
        // Skjerm/ramme:
        let geometryScreen = new THREE.BoxGeometry(scaleScreen.x, scaleScreen.y, scaleScreen.z);
        let meshScreen = new THREE.Mesh(geometryScreen, new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff}));
        meshScreen.position.set(originScreen.x, originScreen.y, originScreen.z);
        meshScreen.castShadow = true;
        meshScreen.receiveShadow = true;
        compoundMesh.add(meshScreen);

        // AMMO:
        let compoundShape = new Ammo.btCompoundShape();
        let screenShape = new Ammo.btBoxShape(new Ammo.btVector3(scaleScreen.x * 0.5, scaleScreen.y * 0.5, scaleScreen.z * 0.5));

        let trans1 = new Ammo.btTransform();
        trans1.setIdentity();
        trans1.setOrigin(new Ammo.btVector3(originScreen.x, originScreen.y, originScreen.z));
        compoundShape.addChildShape(trans1, screenShape);

        let rigidBody = commons.createAmmoRigidBody(compoundShape, compoundMesh, 0.2, 0.9, position, mass);

        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            compoundMesh,
            setCollisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND,
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_PLANE |
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
        );
    },

}
