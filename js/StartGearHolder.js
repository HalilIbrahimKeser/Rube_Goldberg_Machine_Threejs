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

        let frameShape = this.createLeftFrameShape(length, width, 10);
        let frameMesh = this.createExtrudeMesh(frameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        frameMesh.position.set(position.x, position.y, 0);
        frameMesh.castShadow = true;
        frameMesh.receiveShadow = true;
        this.scene.add(frameMesh);

        let rightFrameShape = this.createUpperRightFrameShape(length, width, 10);
        let rightFrameMesh = this.createExtrudeMesh(rightFrameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        rightFrameMesh.position.set(position.x, position.y, 0);
        rightFrameMesh.castShadow = true;
        rightFrameMesh.receiveShadow = true;
        this.scene.add(rightFrameMesh);

        let lowerFrameShape = this.createLowerFrameShape(length, width, 10);
        let lowerFrameMesh = this.createExtrudeMesh(lowerFrameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        lowerFrameMesh.position.set(position.x, position.y, 0);
        lowerFrameMesh.castShadow = true;
        lowerFrameMesh.receiveShadow = true;
        this.scene.add(lowerFrameMesh);

        let startStopperShape = this.createStartStopper(length, width, 10);
        let startStopperMesh = this.createExtrudeMesh(startStopperShape, 1, 20, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide}));
        startStopperMesh.position.set(position.x, position.y, 0);
        startStopperMesh.castShadow = true;
        startStopperMesh.receiveShadow = true;
        this.scene.add(startStopperMesh);

        let endStopperShape = this.createEndStopper(length, width);
        let endStopperMesh = this.createExtrudeMesh(endStopperShape, 1, 20, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide}));
        endStopperMesh.position.set(position.x, position.y, 0);
        endStopperMesh.castShadow = true;
        endStopperMesh.receiveShadow = true;
        this.scene.add(endStopperMesh);

        let glassShape = this.createThreeShape(length, width);
        let glassMesh = this.createExtrudeMesh(glassShape, 1, 1, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.1}));
        glassMesh.position.set(position.x, position.y, 30);
        this.scene.add(glassMesh);

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

    createLeftFrameShape(length, width, offset){
        /*let wallShapeBase = this.createThreeShape(length, width);
        let hole = new THREE.Shape();
        hole.moveTo(offset,offset);
        hole.lineTo(offset, length-40);
        hole.lineTo(offset+15, length-50);
        hole.lineTo(0, length - 20);
        hole.lineTo(0, length);

        hole.lineTo(offset, length-offset);
        hole.lineTo(width-offset, length-offset);
        hole.lineTo(width-offset, offset);
        hole.lineTo(offset, offset);
        wallShapeBase.holes.push(hole);*/
        let wallFrameShape = new THREE.Shape();
        wallFrameShape.moveTo(0, 0);
        wallFrameShape.lineTo(0, length);
        wallFrameShape.lineTo(offset+10, length-10);
        wallFrameShape.lineTo(3, length-10);
        wallFrameShape.lineTo(5, length-40);
        //wallFrameShape.lineTo(offset, length-42);
        wallFrameShape.lineTo(offset+15, length-50);
        wallFrameShape.lineTo(offset, length-50);
        wallFrameShape.lineTo(offset, 0);
        wallFrameShape.lineTo(0,0);



        return wallFrameShape;
    },

    createUpperRightFrameShape(length, width, offset){
        let wallFrameShape = new THREE.Shape();
        wallFrameShape.moveTo(offset+10, length-30);
        wallFrameShape.lineTo(offset+40, length);
        wallFrameShape.lineTo(width, length);
        wallFrameShape.lineTo(width, 170);
        wallFrameShape.lineTo(width-50, 190);
        wallFrameShape.lineTo(width-50, 190);
        wallFrameShape.lineTo(width-offset, 190);
        wallFrameShape.lineTo(width-offset, length-offset);
        wallFrameShape.lineTo(offset+40, length-offset);
        //wallFrameShape.lineTo(offset+30, length-20);
        return wallFrameShape;
    },

    createLowerFrameShape(length, width, offset){
        let lowerShape = new THREE.Shape();
        lowerShape.moveTo(width, 0);
        lowerShape.lineTo(width, 130);
        lowerShape.lineTo(width-30, 150);
        lowerShape.lineTo(width-30, 0);
        lowerShape.lineTo(width, 0);
        return lowerShape;
    },

    createStartStopper(length, width, offset){
        let stopper = new THREE.Shape();
        stopper.moveTo(0, length);
        stopper.lineTo(offset+40, length);
        stopper.lineTo(offset+15, length-50);
        stopper.lineTo(0, length-50);
        stopper.lineTo(0, length);
        return stopper;
    },

    createEndStopper(length, width){
        let stopper = new THREE.Shape();
        stopper.moveTo(width, 170);
        stopper.lineTo(width-30, 180);
        stopper.lineTo(width-30, 150);
        stopper.lineTo(width, 130);
        stopper.lineTo(width, 170);
        return stopper;
    }




}