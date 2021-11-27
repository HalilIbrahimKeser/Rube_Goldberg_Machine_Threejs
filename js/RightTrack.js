import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const rightTrack = {
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
           colorFloor = Math.random() * 0xffffff,
           colorWall =  Math.random() * 0xffffff,
           colorSideWall = Math.random() * 0xffffff,
           slideColor = Math.random() * 0xffffff,
           position = {x:400, y:350, z:-525},
           radius= 0.2,
           length = 500,
           width = 300,
           scale = {x: 2, y: 2, z:2}){

        let glassMaterial = new THREE.MeshPhongMaterial({color: colorSideWall, side: THREE.DoubleSide, transparent: true, opacity: 0.2})

        let groupMesh = new THREE.Group();
        groupMesh.position.set(position.x, position.y, position.z);
        groupMesh.scale.set(scale.x, scale.y, scale.z);

        let backWallShape = this.createThreeShape(50, 100);
        let backWallMesh = this.createExtrudeMesh(backWallShape, 1, 2.5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color:colorWall}));
        //backWallMesh.rotation.y = -Math.PI/4;
        backWallMesh.castShadow = true;
        backWallMesh.receiveShadow = true;
        groupMesh.add(backWallMesh);

        let topFloorShape = this.createThreeShape(50, 100);
        let topFloorMesh = this.createExtrudeMesh(backWallShape, 1, 2.5, true, 1, 1, 0, 1, new THREE.MeshPhongMaterial({color:colorFloor}));
        topFloorMesh.position.set(0, 0, 0);
        topFloorMesh.rotation.x = Math.PI/2;
        topFloorMesh.castShadow = true;
        topFloorMesh.receiveShadow = true;
        groupMesh.add(topFloorMesh);

        let verticalStair1 = backWallMesh.clone();
        verticalStair1.scale.set(1, 0.35, 1);
        verticalStair1.position.set(0, -18, 48);
        groupMesh.add(verticalStair1);

        let horizontalStair1 = topFloorMesh.clone();
        horizontalStair1.scale.set(1, 0.5, 1);
        horizontalStair1.position.set(0, -15, 51);
        groupMesh.add(horizontalStair1);

        let verticalStair2 = verticalStair1.clone();
        verticalStair1.position.set(0, -33, 74);
        groupMesh.add(verticalStair2);

        let horizontalStair2 = horizontalStair1.clone();
        horizontalStair2.position.set(0, -31, 74);
        groupMesh.add(horizontalStair2);

        let verticalStair3 = verticalStair2.clone();
        verticalStair3.position.set(0, -49, 96.5);
        groupMesh.add(verticalStair3);

        let horizontalStair3 = horizontalStair2.clone();
        horizontalStair3.position.set(0, -48, 96);
        groupMesh.add(horizontalStair3);

        let verticalStair4 = verticalStair3.clone();
        verticalStair4.position.set(0, -67, 119);
        groupMesh.add(verticalStair4);

        let horizontalStair4 = horizontalStair3.clone();
        horizontalStair4.position.set(0, -65, 119);
        groupMesh.add(horizontalStair4);

        let verticalStair5 = verticalStair4.clone();
        verticalStair5.position.set(0, -84, 142);
        groupMesh.add(verticalStair5);

        let midFloor = topFloorMesh.clone();
        midFloor.scale.set(1, 1, 1);
        midFloor.position.set(0, -82, 143);
        groupMesh.add(midFloor);

        let midVertical = backWallMesh.clone();
        midVertical.scale.set(1, 0.17, 1);
        midVertical.position.set(0, -90, 191);
        groupMesh.add(midVertical);

        let lowerMidFloor = midFloor.clone();
        lowerMidFloor.scale.set(1, 2, 1);
        lowerMidFloor.position.set(-10, -87, 195);
        groupMesh.add(lowerMidFloor);

        let leftWallShape = this.createThreeShape(200, 150);
        let leftWallMesh = this.createExtrudeMesh(leftWallShape, 1, 2.5, true, 1, 1, 0, 1, glassMaterial);
        leftWallMesh.scale.set(1.3, 1, 1);
        leftWallMesh.position.set(0, -200, 195);
        leftWallMesh.rotation.y = Math.PI/2;
        groupMesh.add(leftWallMesh);

        let rightWallMesh = leftWallMesh.clone();
        rightWallMesh.scale.set(1.3, 1, 1);
        rightWallMesh.position.set(50, -170, 250);
        groupMesh.add(rightWallMesh);

        let slideFromStairs = this.createThreeShape(100, 30);
        let slideFromStairsMesh = this.createExtrudeMesh(slideFromStairs, 1, 2.5, true, 0.1, 1, 0, 1, new THREE.MeshPhongMaterial({color: slideColor}));
        slideFromStairsMesh.rotation.z = -1;
        slideFromStairsMesh.scale.set(0.1, 1, 20);
        slideFromStairsMesh.position.set(-96, -141, 200);
        groupMesh.add(slideFromStairsMesh);

        let rightWallSlideStairs = leftWallMesh.clone();
        rightWallSlideStairs.scale.set(1.3, 0.6, 1);
        rightWallSlideStairs.position.set(0, -200, 252);
        rightWallSlideStairs.rotation.set(0, 0, Math.PI/2);
        groupMesh.add(rightWallSlideStairs);

        let leftWallSlideStairs = rightWallSlideStairs.clone();
        leftWallSlideStairs.scale.set(1, 0.33, 1);
        leftWallSlideStairs.position.set(-30, -170, 195);
        groupMesh.add(leftWallSlideStairs);

        let slideFloor = topFloorMesh.clone();
        slideFloor.scale.set(0.25, 0.5, 1);
        slideFloor.position.set(-117, -142.5, 225);
        groupMesh.add(slideFloor);

        let slideCollisionWall = leftWallMesh.clone();
        slideCollisionWall.scale.set(0.6, 1, 1);
        slideCollisionWall.position.set(-119, -190, 251);
        groupMesh.add(slideCollisionWall);

        let verticalWallBelowSlide = slideCollisionWall.clone();
        verticalWallBelowSlide.scale.set(0.35, 0.2, 1);
        verticalWallBelowSlide.position.set(-98, -182, 251);
        groupMesh.add(verticalWallBelowSlide);

        let slimSlide = this.createThreeShape(100, 50);
        let slimSlideMesh = this.createExtrudeMesh(slimSlide, 1, 2.5, true, 0.1, 1, 0, 1, new THREE.MeshPhongMaterial({color: slideColor}));
        slimSlideMesh.rotation.x = 1.1;
        slimSlideMesh.scale.set(0.4, 0.7, 1);
        slimSlideMesh.position.set(-117, -175, 162);
        groupMesh.add(slimSlideMesh);



        //AMMO til alle deler
        this.addCompoundAmmo(backWallMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(topFloorMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalStair1, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(horizontalStair1, groupMesh, 0.3, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalStair2, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(horizontalStair2, groupMesh, 0.3, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalStair3, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(horizontalStair3, groupMesh, 0.3, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalStair4, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(horizontalStair4, groupMesh, 0.3, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalStair5, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(midFloor, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(lowerMidFloor, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(leftWallMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(rightWallMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(midVertical, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(slideFromStairsMesh, groupMesh, 0.1, 0, position, mass, setCollisionMask);
        this.addCompoundAmmo(rightWallSlideStairs, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(leftWallSlideStairs, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(slideFloor, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(slideCollisionWall, groupMesh, 0.7, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(verticalWallBelowSlide, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(slimSlideMesh, groupMesh, 0.1, 0, position, mass, setCollisionMask);

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