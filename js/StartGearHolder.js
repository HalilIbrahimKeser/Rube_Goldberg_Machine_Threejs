import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const startGearHolder = {
    myPhysicsWorld: undefined,
    scene: undefined,

    init(scene){ // må endres til ammophysicsworld
        this.scene = scene;
    },

    create(setCollisionMask = true, mass = 0, color = 0xF4F0EF, position = {x:-360, y:-75, z:-8}, radius= 0.2, length = 350, width = 150){
        let wallShape = this.createThreeShape(length, width);
        let wallMesh = this.createExtrudeMesh(wallShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color:color}));
        wallMesh.position.set(position.x, position.y, position.z);
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        this.scene.add(wallMesh);

        let frameShape = this.createFrameShape(length, width, 10);
        let frameMesh = this.createExtrudeMesh(frameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        frameMesh.position.set(position.x, position.y, 0);
        frameMesh.castShadow = true;
        frameMesh.receiveShadow = true;
        this.scene.add(frameMesh);
    },

    createThreeShape(length, width) {
        //let length = this.TERRAIN_SIZE * 2;
        //let width = this.TERRAIN_SIZE * 3;
        let shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( 0, length );
        shape.lineTo( width, length );
        shape.lineTo( width, 0 );

        shape.lineTo( 0, 0 );
        return shape;
    },

    createExtrudeMesh(shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, material){
        let extrudeSettings = {
            steps: steps,
            depth: depth,
            bevelEnabled: bevelEnabled,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: bevelOffset,
            bevelSegments: bevelSegments};
        let shapeGeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        let extrudeMesh = new THREE.Mesh(shapeGeometry, material);
        return extrudeMesh;
    },

    createFrameShape(length, width, offset){
        let wallShapeBase = this.createThreeShape(length, width);
        let hole = new THREE.Shape();
        hole.moveTo(offset,offset);
        hole.lineTo(offset, length-offset);
        hole.lineTo(width-offset, length-offset);
        hole.lineTo(width-offset, offset);
        hole.lineTo(offset, offset);
        wallShapeBase.holes.push(hole);
        return wallShapeBase;
    }
}