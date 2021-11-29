import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const flatTableTop = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) { // må endres til ammophysicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 1,
           color = Math.random() * 0xffffff,
           position = {x: -120, y: -5, z: -230},
           radius = 0.2,
           length = 150,
           width = 50) {

        let groupMesh = new THREE.Group();
        groupMesh.position.set(position.x, position.y, position.z);
        groupMesh.name = "Flat Table Top"

        let compoundShape = new Ammo.btCompoundShape();

        // ROCKER TABLE
        let rockerTableShape = this.createThreeShape(45, 300);
        let rockerTableMesh = this.createExtrudeMesh(rockerTableShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        rockerTableMesh.position.set(0, 20, 0);
        rockerTableMesh.rotateX(-Math.PI/2);
        //rockerTableMesh.rotateX(1.90);
        rockerTableMesh.castShadow = true;
        rockerTableMesh.receiveShadow = true;
        groupMesh.add(rockerTableMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, rockerTableMesh);

        let boarderShape = this.createThreeShape(10, 5);
        let boarderMesh = this.createExtrudeMesh(boarderShape, 1, 46, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        boarderMesh.position.set(0, 20, -45);
        //boarderMesh.rotateX(-Math.PI/2);
        //boarderMesh.rotateX(1.90);
        boarderMesh.castShadow = true;
        boarderMesh.receiveShadow = true;
        groupMesh.add(boarderMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, boarderMesh);

        let boarderMesh2 = this.createExtrudeMesh(boarderShape, 1, 46, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        boarderMesh2.position.set(30, 20, -45);
        //boarderMesh.rotateX(-Math.PI/2);
        //boarderMesh.rotateX(1.90);
        boarderMesh2.castShadow = true;
        boarderMesh2.receiveShadow = true;
        groupMesh.add(boarderMesh2);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, boarderMesh2);


        let rockerCylinder = this.createCylinderShape(25, 40);
        let rockerCylinderMesh = new THREE.Mesh(rockerCylinder, new THREE.MeshPhongMaterial({color: 0x979A9A}));
        rockerCylinderMesh.position.set(150, 0, -47);
        rockerCylinderMesh.receiveShadow = true;
        rockerCylinderMesh.castShadow = true;
        groupMesh.add(rockerCylinderMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, rockerCylinderMesh);



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
    },


}