import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";
import {CustomSinCurve} from "./CustomCurve.js";

export const leftTrack = {
    myPhysicsWorld: undefined,
    colorWall: undefined,
    colorFloor: undefined,
    //scene: undefined,

    init(myPhysicsWorld){ // må endres til ammophysicsworld
        //this.scene = scene;
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 0,
           color = Math.random() * 0xffffff,
           colorWall =  Math.random() * 0xffffff,
           colorSideWall = Math.random() * 0xffffff,
           slideColor = Math.random() * 0xffffff,
           position = {x:-400, y:350, z:200},
           radius= 0.2,
           length = 100,
           width = 200,
           scale = {x: 2, y: 2, z:2}){

        let glassMaterial = new THREE.MeshPhongMaterial({color: colorSideWall, side: THREE.DoubleSide, transparent: true, opacity: 0.2})

        let groupMesh = new THREE.Group();
        groupMesh.name = "Left track"
        groupMesh.position.set(position.x, position.y, position.z);
        groupMesh.scale.set(scale.x, scale.y, scale.z);

        let topGroundShape = this.createThreeShape(50, 100);
        let topGroundMesh = this.createExtrudeMesh(topGroundShape, 1, 0.1, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color:colorWall}));
        topGroundMesh.rotation.x = this.degreesToRadians(90);
        topGroundMesh.castShadow = true;
        topGroundMesh.receiveShadow = true;
        topGroundMesh.castShadow = true;
        topGroundMesh.receiveShadow = true;
        groupMesh.add(topGroundMesh);

        let path = new CustomSinCurve( 20 );
        let tubeMesh = this.createTubeMesh(path, 50, 5, 20, false);
        tubeMesh.position.y = -10;
        tubeMesh.rotation.y = this.degreesToRadians(45);
        // tubeMesh.rotation.z = this.degreesToRadians(-180);
        // tubeMesh.rotation.x = this.degreesToRadians(45);
        //tubeMesh.position.set(position.x, position.y, position.z)
        tubeMesh.castShadow = true;
        tubeMesh.receiveShadow = true;
        groupMesh.add(tubeMesh);

        let compoundShape = new Ammo.btCompoundShape();
        let cylinderShape = this.createCylinderShape(1, 100);
        let cylinderMesh = new THREE.Mesh(cylinderShape, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;
        groupMesh.add(cylinderMesh);

        //AMMO til alle deler
        this.addCompoundAmmo(topGroundMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(tubeMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);


    },

    degreesToRadians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
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

    createTubeMesh(path, tubularSegments, radius, radialSegments, closed){
        let geometry = new THREE.TubeGeometry( path, tubularSegments, radius, radialSegments, closed );
        let material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xeeffff } );
        let mesh = new THREE.Mesh( geometry, material );
        return mesh
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
        wallFrameShape.lineTo((width/2)-13, length-20);
        wallFrameShape.lineTo(offset, length-90);
        //wallFrameShape.lineTo(offset, length-40);
        //wallFrameShape.lineTo(offset+15, length-50);
        wallFrameShape.lineTo(offset, length-50);
        wallFrameShape.lineTo(offset, length/2+80);

        wallFrameShape.lineTo(width, length/2-70);
        wallFrameShape.lineTo(width, length/2-80);
        wallFrameShape.lineTo(offset, length/2+10);

        wallFrameShape.lineTo(offset, 0);
        wallFrameShape.lineTo(0,0);
        return wallFrameShape;
    },

    createUpperMiddleShape(length, width){
        let shape = new THREE.Shape();
        shape.moveTo(width/2, length -30);
        shape.lineTo(30, length-100);
        shape.lineTo(30, length-150);
        shape.lineTo(60, length-150);
        shape.lineTo(60, length-100);
        shape.lineTo(width/2, length-60);
        shape.lineTo(width/2, length-80);
        shape.lineTo(width-50, length -200);
        shape.lineTo(width-30, length-200);
        shape.lineTo(width-30, length-180);
        shape.lineTo(width-50, length-180);
        shape.lineTo(width-50, length-160);
        shape.lineTo(width-70, length-160);
        shape.lineTo(width-70, length-140);
        shape.lineTo(width-80, length-140);
        shape.lineTo(width-80, length-120);
        shape.lineTo(width-100, length-120);
        shape.lineTo(width-100, length-100);
        shape.lineTo(width-120, length-100);
        shape.lineTo(width-120, length-70);
        return shape;
    },



    createUpperRightFrameShape(length, width, offset){
        let wallFrameShape = new THREE.Shape();
        wallFrameShape.moveTo(width/2+13, length-20);
        wallFrameShape.lineTo(width, length);
        wallFrameShape.lineTo(width, length/2-20);
        wallFrameShape.lineTo(width-50, length/2-20);
        wallFrameShape.lineTo(width-50, length/2-20);
        wallFrameShape.lineTo(width-offset, length/2);
        wallFrameShape.lineTo(width-offset, length-20);
        wallFrameShape.lineTo(width/2+20, length-20);


        return wallFrameShape;
    },

    createLowerFrameShape(length, width, offset){
        let lowerShape = new THREE.Shape();
        lowerShape.moveTo(width, 0);
        lowerShape.lineTo(width, 130);
        lowerShape.lineTo(width-120, 170);
        lowerShape.lineTo(width-120, 0);
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
    },

    createAroundTheSun(length, width){
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, length);
        shape.lineTo(width,length);
        shape.lineTo(width, 0);
        shape.lineTo(width-120, 0);
        shape.lineTo(width-120, 150);
        shape.lineTo(width/2+10, length/2-60);
        shape.lineTo(width/2+10, length-100);
        shape.lineTo(60, length-100);
        shape.lineTo(60, 0);
        shape.lineTo(0, 0);
        return shape;
    }




}