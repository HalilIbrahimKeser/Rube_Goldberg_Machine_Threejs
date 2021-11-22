import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const flatTable = {
    myPhysicsWorld: undefined,
    scene: undefined,

    init(scene) { // må endres til ammophysicsworld
        this.scene = scene;
    },

    create(setCollisionMask = true,
           mass = 0,
           color = 0xF4F0EF,
           position = {x: -210, y: 20, z: -460},
           radius = 0.2,
           length = 350,
           width = 50) {

        let groupMesh = new THREE.Group();
        //groupMesh.position.y = 50;
        this.scene.add(groupMesh);

        let wallShape = this.createThreeShape(length, width);
        let wallMesh = this.createExtrudeMesh(wallShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color: color}));
        wallMesh.position.set(position.x, position.y, position.z);
        wallMesh.rotateY(190);
        wallMesh.rotateX(190);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        groupMesh.add(wallMesh);
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