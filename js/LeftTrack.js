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
           length = 20,
           width = 20,
           scale = {x: 2, y: 2, z:2}){

        let groupMesh = new THREE.Group();
        groupMesh.name = "Left track"
        groupMesh.position.set(position.x, position.y, position.z);
        groupMesh.scale.set(scale.x, scale.y, scale.z);

        let topGroundShape = this.createThreeShape(length, width);
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
        //groupMesh.add(tubeMesh);

        // Øverst topp
        let cylinderShape = this.createCylinderShape(1, 100);

        let cylinderMesh = new THREE.Mesh(cylinderShape, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;
        cylinderMesh.position.z = -94;
        cylinderMesh.position.x = 5;
        cylinderMesh.position.y = -34;
        cylinderMesh.rotation.x = this.degreesToRadians(-20);
        groupMesh.add(cylinderMesh);

        let cylinderMesh1 = new THREE.Mesh(cylinderShape, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh1.castShadow = true;
        cylinderMesh1.receiveShadow = true;
        cylinderMesh1.position.z = -94;
        cylinderMesh1.position.x = 10;
        cylinderMesh1.position.y = -34;
        cylinderMesh1.rotation.x = this.degreesToRadians(-20);
        groupMesh.add(cylinderMesh1);

        // Mellom
        let cylinderShape2 = this.createCylinderShape(1, 100);
        let cylinderMesh2 = new THREE.Mesh(cylinderShape2, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh2.castShadow = true;
        cylinderMesh2.receiveShadow = true;
        cylinderMesh2.position.z = -100;
        cylinderMesh2.position.x = 0;
        cylinderMesh2.position.y = -40;
        cylinderMesh2.rotation.x = this.degreesToRadians(10);
        cylinderMesh2.rotation.y = this.degreesToRadians(80);
        groupMesh.add(cylinderMesh2);

        let cylinderMesh3 = new THREE.Mesh(cylinderShape2, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh3.castShadow = true;
        cylinderMesh3.receiveShadow = true;
        cylinderMesh3.position.z = -106;
        cylinderMesh3.position.x = 0;
        cylinderMesh3.position.y = -40;
        cylinderMesh3.rotation.x = this.degreesToRadians(10);
        cylinderMesh3.rotation.y = this.degreesToRadians(80);
        groupMesh.add(cylinderMesh3);

        let glassMaterial = new THREE.MeshPhongMaterial({color: colorSideWall, side: THREE.DoubleSide, transparent: true, opacity: 0.2});

        // top glass wall 1
        let topWallGlassShape = this.createThreeShape(200, 150);
        let topWallGlassMesh = this.createExtrudeMesh(topWallGlassShape, 1, 2.5, true, 1, 1, 0, 1, glassMaterial);
        topWallGlassMesh.scale.set(0.2, 0.1, 0.1);
        topWallGlassMesh.position.set(-5, 0, 20);
        groupMesh.add(topWallGlassMesh);
        // top glass wall 2
        let topWallGlassMesh1 = this.createExtrudeMesh(topWallGlassShape, 1, 2.5, true, 1, 1, 0, 1, glassMaterial);
        topWallGlassMesh1.scale.set(0.2, 0.1, 0.1);
        topWallGlassMesh1.position.set(0, 0, 20); ///
        topWallGlassMesh1.rotation.y = this.degreesToRadians(90);
        groupMesh.add(topWallGlassMesh1);

        // middle glass wall 1
        let middleGlassWallShape1 = this.createThreeShape(150, 50);
        let middleGlassWallMesh1 = this.createExtrudeMesh(middleGlassWallShape1, 1, 2.5, true, 1, 1, 0, 1, glassMaterial);
        middleGlassWallMesh1.scale.set(0.2, 0.1, 0.1);
        middleGlassWallMesh1.position.set(0, -40, -100);
        middleGlassWallMesh1.rotation.y = this.degreesToRadians(90);
        groupMesh.add(middleGlassWallMesh1);

        // ball stopp glass in middle part
        let middleGlassWallShape2 = this.createThreeShape(200, 150);
        let middleGlassWallMesh2 = this.createExtrudeMesh(middleGlassWallShape2, 1, 2.5, true, 1, 1, 0, 1, glassMaterial);
        middleGlassWallMesh2.scale.set(0.2, 0.1, 0.1);
        middleGlassWallMesh2.position.set(0, -40, -110);//
        middleGlassWallMesh2.rotation.z = this.degreesToRadians(-5);
        middleGlassWallMesh2.rotation.y = this.degreesToRadians(-10);
        groupMesh.add(middleGlassWallMesh2);

        let material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
        let latteMesh = this.createLatteMesh(10, 10, 2, material )
        latteMesh.position.x = 105;
        latteMesh.position.z = -85;
        latteMesh.position.y = -50;
        groupMesh.add(latteMesh);

        // Latte From last trampoline
        let latteTrampolineMesh = this.createLatteMesh(10, 20, 10, glassMaterial)
        latteTrampolineMesh.position.x = 240;
        latteTrampolineMesh.position.z = -140;
        latteTrampolineMesh.position.y = 40;
        latteTrampolineMesh.rotateX(-1);
        latteTrampolineMesh.rotateY(0);
        latteTrampolineMesh.rotateZ(-Math.PI/3.8);
        latteTrampolineMesh.mate
        groupMesh.add(latteTrampolineMesh);

        let cylinderShape3 = this.createCylinderShape(1, 250);

        let cylinderMesh5 = new THREE.Mesh(cylinderShape3, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh5.castShadow = true;
        cylinderMesh5.receiveShadow = true;
        cylinderMesh5.position.x = 220;
        cylinderMesh5.position.z = -120;
        cylinderMesh5.position.y = 18;
        cylinderMesh5.rotation.x = this.degreesToRadians(6);
        cylinderMesh5.rotation.y = this.degreesToRadians(-56);
        groupMesh.add(cylinderMesh5);

        let cylinderMesh6 = new THREE.Mesh(cylinderShape3, new THREE.MeshPhongMaterial({color: color}));
        cylinderMesh6.castShadow = true;
        cylinderMesh6.receiveShadow = true;
        cylinderMesh6.position.x = 215;
        cylinderMesh6.position.z = -125;
        cylinderMesh6.position.y = 18;
        cylinderMesh6.rotation.x = this.degreesToRadians(6);
        cylinderMesh6.rotation.y = this.degreesToRadians(-56);
        groupMesh.add(cylinderMesh6);

        // Under the bricks
        let brickButtonGroundShape = this.createThreeShape(1700, 200);
        let brickButtonGroundMesh = this.createExtrudeMesh(brickButtonGroundShape, 2, 50, true,
            1, 1, 0, 1, glassMaterial);
        brickButtonGroundMesh.scale.set(0.2, 0.1, 0.1);
        brickButtonGroundMesh.position.set(250, -150, -80);//
        brickButtonGroundMesh.rotation.z = this.degreesToRadians(100);
        brickButtonGroundMesh.rotation.x = this.degreesToRadians(90);
        brickButtonGroundMesh.rotation.y = this.degreesToRadians(-1);
        let compoundShape = new Ammo.btCompoundShape();
        commons.createConvexTriangleShapeAddToCompound(compoundShape, brickButtonGroundMesh);
        groupMesh.add(brickButtonGroundMesh);

        //AMMO til alle deler
        this.addCompoundAmmo(topGroundMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(tubeMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh1, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh2, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh3, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh5, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(cylinderMesh6, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(topWallGlassMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(topWallGlassMesh1, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(middleGlassWallMesh2, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(middleGlassWallMesh1, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(latteMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(brickButtonGroundMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        this.addCompoundAmmo(latteTrampolineMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
    },

    degreesToRadians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
    },

    addCompoundAmmo(mesh,  groupMesh, restitution, friction, position, mass, collisionMask){
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, mesh);

        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.1, 0.3, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, groupMesh, collisionMask);
    },

    addPhysicsAmmo(rigidBody, groupMesh, collisionMask){
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            collisionMask,
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

    createTubeMesh(path, tubularSegments, radius, radialSegments, closed){
        let geometry = new THREE.TubeGeometry( path, tubularSegments, radius, radialSegments, closed );
        let material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xeeffff } );
        let mesh = new THREE.Mesh( geometry, material );
        return mesh
    },

    createLatteMesh(segments, phiStart, phiLength, material ){
        const points1 = [];
        for ( let i = 0; i < segments; i ++ ) {
            points1.push( new THREE.Vector2( Math.sin( i * 0.2 ) * phiStart + 5, ( i - 5 ) * phiLength ) );
        }
        const geometry = new THREE.LatheGeometry( points1 );
        const lathe = new THREE.Mesh( geometry, material );
        lathe.castShadow = true;
        lathe.receiveShadow = true;
        return lathe
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