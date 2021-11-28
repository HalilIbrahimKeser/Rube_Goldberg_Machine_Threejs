import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const flatTableTop = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) { // må endres til ammophysicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 10,
           restitution = 0.1,
           friction = 0.3,
           color = Math.random() * 0xffffff,
           position = {x: 40, y: 0, z: -500},
           radius = 0.2,
           length = 150,
           width = 50) {

        let groupMesh = new THREE.Group();
        groupMesh.position.set(position.x, position.y, position.z);
        groupMesh.name = "Flat Table Top"

        // ROCKER TABLE
        let rockerTableShape = this.createThreeShape(50, 80);
        let rockerTableMesh = this.createExtrudeMesh(rockerTableShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        //rockerTableMesh.position.set(35, 17, 0);
        rockerTableMesh.rotateX(-Math.PI/2);
        //rockerTableMesh.rotateX(1.90);
        rockerTableMesh.castShadow = true;
        rockerTableMesh.receiveShadow = true;
        groupMesh.add(rockerTableMesh);

        // AMMO
        this.addCompoundAmmo(rockerTableMesh, groupMesh, restitution, 0.3, position, mass, setCollisionMask);
    },

    //https://stackoverflow.com/questions/11826798/how-do-i-construct-a-hollow-cylinder-in-three-js
    createCylinderShape(radius, depth){
        let extrudeSettings = {
            depth : depth,
            steps : 1,
            bevelEnabled: false,
            curveSegments: 8
        };

        let arcShape = new THREE.Shape();
        arcShape.absarc(0, 0, radius, 0, Math.PI * 2, 0, false);

        let cylinderGeometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
        return cylinderGeometry;
    },

    createThreeShape(length, width) {
        //let length = this.TERRAIN_SIZE * 2;
        //let width = this.TERRAIN_SIZE * 3;
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, length);
        shape.lineTo(width, length);
        shape.lineTo(width, 0);
        shape.lineTo(0, 0);

        return shape;
    },

    createExtrudeMesh(shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, material) {
        let extrudeSettings = {
            steps: steps,
            depth: depth,
            bevelEnabled: bevelEnabled,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: bevelOffset,
            bevelSegments: bevelSegments
        };
        let shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let extrudeMesh = new THREE.Mesh(shapeGeometry, material);
        return extrudeMesh;
    },

    addCompoundAmmo(mesh,  groupMesh, restitution, friction, position, mass, collisionMask) {
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, mesh);
        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, friction, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, groupMesh, collisionMask);
    },

    addPhysicsAmmo(rigidBody, groupMesh, collisionMask) {
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            collisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_PLANE,
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE

        );
    },
}