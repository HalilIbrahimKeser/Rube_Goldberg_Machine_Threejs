import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const flatTableUnder = {
    myPhysicsWorld: undefined,
    //scene: undefined,

    init(myPhysicsWorld) { // må endres til ammophysicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 0,
           color = Math.random() * 0xffffff,
           position = {x: -180, y: -50, z: -230},
           //position = {x: -200, y: -60, z: -224}, //Alternativ seasaw
           radius = 0.2,
           length = 300,
           width = 50) {

        let groupMesh = new THREE.Group();
        groupMesh.position.set(position.x, position.y, position.z);
        //this.myPhysicsWorld.add(groupMesh);

        let compoundShape = new Ammo.btCompoundShape();

        // FLAT TABLE
        let tableShape = this.createThreeShape(length, width);
        let tableMesh = this.createExtrudeMesh(tableShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        //tableMesh.position.set(position.x, position.y, position.z);
        tableMesh.rotateY(1.57);
        tableMesh.rotateX(1.57);
        tableMesh.castShadow = true;
        tableMesh.receiveShadow = true;
        groupMesh.add(tableMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, tableMesh);

        // ROCKER CYLINDER
        /*let rockerCylinder = this.createCylinderShape(8, 50);
        let rockerCylinderMesh = new THREE.Mesh(rockerCylinder, new THREE.MeshPhongMaterial({color: 0x979A9A}));
        rockerCylinderMesh.position.set(70, 10, -50);
        rockerCylinderMesh.receiveShadow = true;
        rockerCylinderMesh.castShadow = true;
        groupMesh.add(rockerCylinderMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, rockerCylinderMesh);*/

        let boundaryBack = this.createThreeShape(100, 300);
        let boundaryBackMesh = this.createExtrudeMesh(boundaryBack, 1, 1, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.2}));
        boundaryBackMesh.position.set(0, 0, -50);
        boundaryBackMesh.castShadow = true;
        boundaryBackMesh.receiveShadow = true;
        groupMesh.add(boundaryBackMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, boundaryBackMesh);

        let boundaryFrontMesh = boundaryBackMesh.clone();
        boundaryFrontMesh.position.set(0, 0, 0);
        groupMesh.add(boundaryFrontMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, boundaryFrontMesh);

        let boundaryLeftMesh = boundaryFrontMesh.clone();
        boundaryLeftMesh.scale.set(0.17, 1, 1);
        boundaryLeftMesh.rotateY(Math.PI/2);
        boundaryLeftMesh.position.set(0, 0, 0);
        groupMesh.add(boundaryLeftMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, boundaryLeftMesh);

        //AMMO
        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.1, 0.3, position, mass);
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            setCollisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE,
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_PLANE |
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );
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
    }

}