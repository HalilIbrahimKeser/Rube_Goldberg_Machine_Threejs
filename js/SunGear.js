import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";


export const sunGear = {
    myPhysicsWorld: undefined,
    material: undefined,
    scene: undefined,
    rotationAxis: {x:1, y:0, z:0},
    rotationAngle: Math.PI/2,
    position: undefined,

    init(myPhysicsWorld){ //Må byttes til physicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 10,
           color = 0xF5D22E,
           position = {x:-310, y:280, z:-495},
           radius= 20,
           height = 30, //height of the holed cylinder
           withGearHolder = true,
           withSpikes = true,
           withChainHolder = true,
           randomizedColor = false,
           gearHolderRotation = {x: Math.PI/2, y: 0, z: 0},
           gearRotation = {x: 0, y: 0, z: 0},
           holeRadiusPercent = 0.2,
           restitution = 0.4){
        this.position = position;
        if (randomizedColor){
            this.material = new THREE.MeshPhongMaterial({color: Math.random() * 0xffffff});
        } else {
            this.material = new THREE.MeshPhongMaterial({color: color});
        }

        //Ammo-container:
        let compoundShape = new Ammo.btCompoundShape();

        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = "rudegoldberg";
        groupMesh.userData.name = "sungear"
        groupMesh.position.set(position.x, position.y, position.z);

        this.createGearParts(groupMesh,
            compoundShape,
            radius,
            height,
            withGearHolder,
            withSpikes,
            withChainHolder,
            gearRotation,
            gearHolderRotation,
            holeRadiusPercent);

        //AMMO
        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, 0.6, position, mass);
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
    createHoledCylinderShape(radius, depth, holeRadiusPercent){
        let extrudeSettings = {
            depth : depth,
            steps : 1,
            bevelEnabled: false,
            curveSegments: 8
        };

        let arcShape = new THREE.Shape();
        arcShape.absarc(0, 0, radius, 0, Math.PI * 2, 0, false);

        let holePath = new THREE.Path();
        holePath.absarc(0, 0, radius*holeRadiusPercent, 0, Math.PI * 2, true);
        arcShape.holes.push(holePath);

        let holedCylinderGeometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
        return holedCylinderGeometry;
    },

    createSpikeMesh(shape, material) {
        let extrudeSettings = {
            depth: 1,
            bevelEnabled: false,
            bevelSegments: 1,
            steps: 1,
            bevelSize: 1,
            bevelThickness: 0.2
        };
        let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        let spikeMesh = new THREE.Mesh( geometry, material );
        //spikeMesh.translateOnAxis(new THREE.Vector3(0,147,0), 1);
        //spikeMesh.scale.set(5, 5, 50);
        return spikeMesh;
    },

    createSpikeSplineShape() {
        let spikeShape = new THREE.Shape();
        spikeShape.moveTo( -6, 0 );
        spikeShape.splineThru([
            new THREE.Vector2(-4, 0.4),
            new THREE.Vector2(-3, 1.7),
            new THREE.Vector2(-1, 9),
            new THREE.Vector2(0, 17),
            new THREE.Vector2(1, 9),
            new THREE.Vector2(3, 1.7),
            new THREE.Vector2(4, 0.4),
            new THREE.Vector2(6, 0),
        ]);
        spikeShape.lineTo(6,-1);
        spikeShape.lineTo(-6,-1);
        spikeShape.lineTo(-6,0);
        return spikeShape;
    },

    addCompoundAmmo(mesh,  groupMesh, restitution, friction, position, mass, collisionMask){
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, mesh);
        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, friction, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, groupMesh, collisionMask);
    },

    addCylinderAmmo(mesh, restitution, friction, position, mass, collisionMask){
        let cylinderShape = commons.createCylinderShape(mesh);
        let rigidBody = commons.createAmmoRigidBody(cylinderShape, mesh, restitution, friction, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, mesh, collisionMask);
    },

    addPhysicsAmmo(rigidBody, groupMesh, collisionMask){
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            collisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND,
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );
    },

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

    createGearParts(groupMesh, compoundShape, radius, height, withGearHolder, withSpikes, withChainHolder, gearRotation, gearHolderRotation, holeRadiusPercent) {
        //Holder tannhjul
        if (withGearHolder){
            let cylinderGeo = new THREE.CylinderGeometry(radius*0.1, radius*0.1, 50, 50, 1, false, 0, 6.3);
            let gearHolderMesh = new THREE.Mesh(cylinderGeo, new THREE.MeshPhongMaterial({color: 0x979A9A}));
            gearHolderMesh.rotation.x = gearHolderRotation.x;
            gearHolderMesh.rotation.y = gearHolderRotation.y;
            gearHolderMesh.rotation.z = gearHolderRotation.z;
            gearHolderMesh.castShadow = true;
            gearHolderMesh.receiveShadow = true;
            this.addCylinderAmmo(gearHolderMesh, 0.1,0.3, {x:-310, y: 280, z: -490}, 0, true);
        }

        //Sylinder med hol i midten
        let holedCylinderMesh = new THREE.Mesh(this.createHoledCylinderShape(radius, height, holeRadiusPercent), this.material);
        //holedCylinderMesh.scale.set(radius, radius, height);
        holedCylinderMesh.rotation.set(gearRotation.x, gearRotation.y, gearRotation.z);
        holedCylinderMesh.castShadow = true;
        holedCylinderMesh.receiveShadow = true;
        holedCylinderMesh.name = "holedCylinder";
        groupMesh.add(holedCylinderMesh);
        if (withGearHolder){
            commons.createTriangleShapeAddToCompound(compoundShape, holedCylinderMesh, withChainHolder);
        } else{
            commons.createConvexTriangleShapeAddToCompound(compoundShape, holedCylinderMesh, withChainHolder);
        }


        if (withSpikes){
            //Pigger rundt sylinder
            let spike = this.createSpikeSplineShape();
            let spikeMesh = this.createSpikeMesh(spike, this.material);
            spikeMesh.translateZ(28);
            spikeMesh.scale.set(1.5, 1.5, 2);
            spikeMesh.castShadow = true;
            spikeMesh.receiveShadow = true;
            let step = (2 * Math.PI) / 10;
            for (let i = 0; i < 2 * Math.PI; i += step) {
                let spikeClone = spikeMesh.clone();
                spikeClone.rotation.z = i - 1.6;
                spikeClone.position.x = 20*Math.cos(i);
                spikeClone.position.y = 20*Math.sin(i);
                holedCylinderMesh.add(spikeClone);
                commons.createConvexTriangleShapeAddToCompound(compoundShape, spikeClone);
            }
        }

        if(withChainHolder){
            //chainholder
            let chainHolderGeo = new THREE.TorusGeometry(4, 1, 16, 100, 6.3);
            let chainHolderMesh = new THREE.Mesh(chainHolderGeo, new THREE.MeshPhongMaterial({color: 0x979A9A}));
            chainHolderMesh.position.set(23, 0, 13);
            chainHolderMesh.name = "chainHolder";
            chainHolderMesh.receiveShadow = true;
            chainHolderMesh.castShadow = true;
            groupMesh.add(chainHolderMesh);
            commons.createConvexTriangleShapeAddToCompound(compoundShape, chainHolderMesh);
        }
    }
}