import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";


export const verticalChain = {
    myPhysicsWorld: undefined,
    scene: undefined,
    position: undefined,

    init(myPhysicsWorld){
        this.myPhysicsWorld = myPhysicsWorld;
        //this.scene = scene;
    },

    create(setCollisionMask = true, mass = 1, color = 0x979A9A, position = {x:-280, y:250, z:10}, radius= 2.8, tube = 0.8, chainNr= 24){
        this.position = {x: 0, y:0, z: -495};
        let chainGroup = new THREE.Group();
        chainGroup.position.z = this.position.z;
        chainGroup.position.y = this.position.y;
        chainGroup.position.x = this.position.x;
        //this.scene.add(chainGroup);

        let chainFrontGeo = new THREE.TorusGeometry(radius, tube, 16, 100, 6.3);
        let chainFrontMesh = new THREE.Mesh(chainFrontGeo, new THREE.MeshPhongMaterial({color: color}));
        chainFrontMesh.position.set(position.x, position.y -8, position.z);
        chainFrontMesh.scale.set(1, 2, 1);
        chainFrontMesh.receiveShadow = true;
        chainFrontMesh.castShadow = true;
        chainGroup.add(chainFrontMesh);
        this.addCompoundAmmo(chainFrontMesh, chainGroup, 0.1, 0.3, this.position, mass, setCollisionMask);

        let chainSideMesh = chainFrontMesh.clone();
        chainSideMesh.rotation.y = Math.PI/2;
        chainSideMesh.position.y = position.y;
        chainGroup.add(chainSideMesh);
        this.addCompoundAmmo(chainSideMesh, chainGroup, 0.1, 0.3, this.position, mass, setCollisionMask);

        for (let i = 2, j = 3; i < chainNr, j <chainNr+1; i+=2, j+=2){
            let chainSideClone = chainSideMesh.clone();
            chainSideClone.position.y = chainSideMesh.position.y - (i*8);
            let chainFrontClone = chainFrontMesh.clone();
            chainFrontClone.position.y = chainFrontMesh.position.y - (i*8) ;
            chainGroup.add(chainFrontClone);
            chainGroup.add(chainSideClone);
            this.addCompoundAmmo(chainFrontClone, chainGroup, 0.1, 0.3, this.position, mass, setCollisionMask);
            this.addCompoundAmmo(chainSideClone, chainGroup, 0.1, 0.3, this.position, mass, setCollisionMask);
        }
    },

    addCompoundAmmo(mesh,  groupMesh, restitution, friction, position, mass, collisionMask){
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, mesh);
        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, friction, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, groupMesh, collisionMask);
    },

    addPhysicsAmmo(rigidBody, groupMesh, collisionMask){
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            collisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE,
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE|
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE

        );
    },


}


