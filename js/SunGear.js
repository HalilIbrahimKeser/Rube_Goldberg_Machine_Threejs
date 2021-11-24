import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";


export const sunGear = {
    myPhysicsWorld: undefined,
    material: undefined,
    scene: undefined,
    rotationAxis: {x:1, y:0, z:0},
    rotationAngle: Math.PI/2,

    init(myPhysicsWorld){ //Må byttes til physicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true, mass = 0, texture = true, color = 0xF5D22E, position = {x:-300, y:200, z:-500}, radius= 20, url = "assets/images/metalgold.jpg", height = 15){
        if (texture){ //Hvis tekstur er ønsket
            const loadManager = new THREE.LoadingManager();
            const loader = new THREE.TextureLoader(loadManager);
            this.material = new THREE.MeshPhongMaterial({map: loader.load(url)});
        } else {
            this.material = new THREE.MeshPhongMaterial({color: color});
        }

        //Ammo-container:
        let compoundShape = new Ammo.btCompoundShape();

        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = "rudegoldberg";
        groupMesh.userData.name = "sungear"
        groupMesh.position.set(position.x, position.y, position.z);

        this.createGearParts(groupMesh, compoundShape, radius, height);

        //Sylinder med hol i midten
        /*let holedCylinderMesh = new THREE.Mesh(this.createHoledCylinderShape(), this.material);
        holedCylinderMesh.scale.set(radius,radius,height);
        holedCylinderMesh.castShadow = true;
        holedCylinderMesh.receiveShadow = true;
        groupMesh.add(holedCylinderMesh);

        //Pigger rundt sylinder
        let spike = this.createSpikeSplineShape();
        let spikeMesh = this.createSpikeMesh(spike, this.material);
        spikeMesh.translateZ(1.6);
        spikeMesh.scale.set(0.08, 0.07, 1);
        spikeMesh.castShadow = true;
        spikeMesh.receiveShadow = true;
        let step = (2*Math.PI)/10;
        for(let i = 0; i < 2*Math.PI; i+=step){
            let spikeClone = spikeMesh.clone();
            spikeClone.rotation.z = i - 1.6;
            spikeClone.position.x = Math.cos(i);
            spikeClone.position.y = Math.sin(i);
            holedCylinderMesh.add(spikeClone);
            this.addCompoundAmmo(spikeClone, holedCylinderMesh, 0.1, 0.3, position, mass, setCollisionMask);
        }*/

        /*let chainHolderGeo = new THREE.TorusGeometry(4, 1, 16, 100, 6.3);
        let chainHolderMesh = new THREE.Mesh(chainHolderGeo, new THREE.MeshPhongMaterial({color: 0x979A9A}));
        chainHolderMesh.position.set(23, 0, 13);
        chainHolderMesh.receiveShadow = true;
        chainHolderMesh.castShadow = true;
        groupMesh.add(chainHolderMesh);*/

        //this.addCompoundAmmo(holedCylinderMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);

        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            setCollisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE,
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_PLANE |
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
        );

    },

    //https://stackoverflow.com/questions/11826798/how-do-i-construct-a-hollow-cylinder-in-three-js
    createHoledCylinderShape(){
        let extrudeSettings = {
            depth : 2,
            steps : 1,
            bevelEnabled: false,
            curveSegments: 8
        };

        let arcShape = new THREE.Shape();
        arcShape.absarc(0, 0, 1, 0, Math.PI * 2, 0, false);

        let holePath = new THREE.Path();
        holePath.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
        arcShape.holes.push(holePath);

        let holedCylinderGeometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
        return holedCylinderGeometry;
    },

    createSpikeMesh(shape, material) {
        let extrudeSettings = {
            depth: 0.4,
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
            new THREE.Vector2(-1, 8),
            new THREE.Vector2(0, 11),
            new THREE.Vector2(1, 8),
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
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );
    },

    createGearParts(groupMesh, compoundShape, radius, height) {
        //Sylinder med hol i midten
        let holedCylinderMesh = new THREE.Mesh(this.createHoledCylinderShape(), this.material);
        holedCylinderMesh.scale.set(radius, radius, height);
        holedCylinderMesh.castShadow = true;
        holedCylinderMesh.receiveShadow = true;
        holedCylinderMesh.name = "holedCylinder";
        groupMesh.add(holedCylinderMesh);
        commons.createConvexTriangleShapeAddToCompound(compoundShape, holedCylinderMesh);

        //Pigger rundt sylinder
        let spike = this.createSpikeSplineShape();
        let spikeMesh = this.createSpikeMesh(spike, this.material);
        spikeMesh.translateZ(1.6);
        spikeMesh.scale.set(0.08, 0.07, 1);
        spikeMesh.castShadow = true;
        spikeMesh.receiveShadow = true;
        let step = (2 * Math.PI) / 10;
        for (let i = 0; i < 2 * Math.PI; i += step) {
            let spikeClone = spikeMesh.clone();
            spikeClone.rotation.z = i - 1.6;
            spikeClone.position.x = Math.cos(i);
            spikeClone.position.y = Math.sin(i);
            holedCylinderMesh.add(spikeClone);
            commons.createConvexTriangleShapeAddToCompound(compoundShape, spikeClone);
        }

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