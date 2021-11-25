import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const flatTable = {
    myPhysicsWorld: undefined,
    //scene: undefined,

    init(myPhysicsWorld) { // må endres til ammophysicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 0,
           color = 0xF4F0EF,
           position = {x: -50, y: 10, z: -170},
           radius = 0.2,
           length = 150,
           width = 50) {

        let groupMesh = new THREE.Group();
        //this.myPhysicsWorld.add(groupMesh);

        // FLAT TABLE
        let tableShape = this.createThreeShape(length, width);
        let tableMesh = this.createExtrudeMesh(tableShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        tableMesh.position.set(position.x, position.y, position.z);
        tableMesh.rotateY(1.57);
        tableMesh.rotateX(1.57);
        tableMesh.castShadow = true;
        tableMesh.receiveShadow = true;
        groupMesh.add(tableMesh);

        // ROCKER CYLINDER
        let rockerCylinder = this.createCylinderShape(8, 40);
        let rockerCylinderMesh = new THREE.Mesh(rockerCylinder, new THREE.MeshPhongMaterial({color: 0x979A9A}));
        rockerCylinderMesh.position.set(20, 20, -210);
        rockerCylinderMesh.receiveShadow = true;
        rockerCylinderMesh.castShadow = true;
        groupMesh.add(rockerCylinderMesh);

        // ROCKER TABLE
        let rockerTableShape = this.createThreeShape(80, 50);
        let rockerTableMesh = this.createExtrudeMesh(rockerTableShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        rockerTableMesh.position.set(-15, 50, -170);
        rockerTableMesh.rotateY(1.57);
        rockerTableMesh.rotateX(1.90);
        rockerTableMesh.castShadow = true;
        rockerTableMesh.receiveShadow = true;
        groupMesh.add(rockerTableMesh);

        // BOX
        let boxShape = this.createThreeShape(20, 20);
        let boxMesh = this.createExtrudeMesh(boxShape, 1, 20, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        boxMesh.position.set(12, 65, -180);
        boxMesh.rotateY(1.57);
        boxMesh.rotateX(1.90);
        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        groupMesh.add(boxMesh);

        // AMMO
        this.addCompoundAmmo(tableMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(rockerCylinderMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(rockerTableMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(boxMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
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
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );
    },
}