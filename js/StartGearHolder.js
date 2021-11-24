import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const startGearHolder = {
    myPhysicsWorld: undefined,
    //scene: undefined,

    init(myPhysicsWorld){ // må endres til ammophysicsworld
        //this.scene = scene;
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true, mass = 0, color = 0xF4F0EF, position = {x:-360, y:-75, z:-500}, radius= 0.2, length = 350, width = 150){
        let groupMesh = new THREE.Group();
        groupMesh.position.set(position.x, position.y, position.z);

        //this.scene.add(groupMesh);
        let startStopperShape = this.createStartStopper(length, width, 10);
        let startStopperMesh = this.createExtrudeMesh(startStopperShape, 1, 20, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide}));
        //startStopperMesh.position.set(position.x, position.y, 0);
        startStopperMesh.castShadow = true;
        startStopperMesh.receiveShadow = true;
        groupMesh.add(startStopperMesh);

        let wallShape = this.createThreeShape(length, width);
        let wallMesh = this.createExtrudeMesh(wallShape, 1, 5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color:color}));
        wallMesh.castShadow = true;
        wallMesh.receiveShadow = true;
        groupMesh.add(wallMesh);

        let frameShape = this.createLeftFrameShape(length, width, 10);
        let frameMesh = this.createExtrudeMesh(frameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        //frameMesh.position.set(position.x, position.y, 0);
        frameMesh.castShadow = true;
        frameMesh.receiveShadow = true;
        groupMesh.add(frameMesh);

        let rightFrameShape = this.createUpperRightFrameShape(length, width, 10);
        let rightFrameMesh = this.createExtrudeMesh(rightFrameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        //rightFrameMesh.position.set(position.x, position.y, 0);
        rightFrameMesh.castShadow = true;
        rightFrameMesh.receiveShadow = true;
        groupMesh.add(rightFrameMesh);

        let lowerFrameShape = this.createLowerFrameShape(length, width, 10);
        let lowerFrameMesh = this.createExtrudeMesh(lowerFrameShape, 1, 35, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: 0x007EA7, side: THREE.DoubleSide}));
        //lowerFrameMesh.position.set(position.x, position.y, 0);
        lowerFrameMesh.castShadow = true;
        lowerFrameMesh.receiveShadow = true;
        groupMesh.add(lowerFrameMesh);



        let endStopperShape = this.createEndStopper(length, width);
        let endStopperMesh = this.createExtrudeMesh(endStopperShape, 1, 20, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide}));
        //endStopperMesh.position.set(position.x, position.y, 0);
        endStopperMesh.castShadow = true;
        endStopperMesh.receiveShadow = true;
        groupMesh.add(endStopperMesh);

        let glassShape = this.createThreeShape(length, width);
        let glassMesh = this.createExtrudeMesh(glassShape, 1, 1, true, 1, 1,0, 1, new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.1}));
        glassMesh.position.set(0, 0, 35);
        groupMesh.add(glassMesh);

        let gearHolderGeo = this.createCylinderShape(2, 20);
        let gearHolderMesh = new THREE.Mesh(gearHolderGeo, new THREE.MeshPhongMaterial({color: 0x979A9A}));
        gearHolderMesh.position.set(60, 275, 13);
        gearHolderMesh.receiveShadow = true;
        gearHolderMesh.castShadow = true;
        //groupMesh.add(gearHolderMesh);

        let gearHolderStopperGeo = this.createCylinderShape(3.5, 4);
        let gearHolderStopperMesh = new THREE.Mesh(gearHolderStopperGeo, new THREE.MeshPhongMaterial({color: 0xcc0000}));
        gearHolderStopperMesh.position.set(60, 275, 31);
        gearHolderStopperMesh.receiveShadow = true;
        gearHolderStopperMesh.castShadow = true;
        //groupMesh.add(gearHolderStopperMesh);

        //AMMO til alle deler
        this.addCompoundAmmo(wallMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(frameMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(rightFrameMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(lowerFrameMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(startStopperMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(endStopperMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(glassMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        //this.addCompoundAmmo(gearHolderMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        //this.addCompoundAmmo(gearHolderStopperMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);

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
        let wallFrameShape = new THREE.Shape();
        wallFrameShape.moveTo(0, 0);
        wallFrameShape.lineTo(0, length);
        wallFrameShape.lineTo(offset+10, length-10);
        wallFrameShape.lineTo(3, length-10);
        wallFrameShape.lineTo(5, length-40);
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
        stopper.lineTo(width, length);
        stopper.lineTo(width, 191);
        stopper.lineTo(width-50, 191);
        stopper.lineTo(width-50, length-50);
        stopper.lineTo(offset+30, length-50);
        stopper.lineTo(offset+30, 0);
        stopper.lineTo(0,0);
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