import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

//https://stackoverflow.com/questions/11826798/how-do-i-construct-a-hollow-cylinder-in-three-js

export const trampoline = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true,
           position={x:-5, y:20, z:-490},
           color=Math.random() * 0xffffff,
           mass=0,
           radius= 40,
           depth = 50,
           tiltX = Math.PI/2,
           tiltY = -0.3,
           tiltZ = 0,
           restitution = 4) {

        let groupMesh = new THREE.Group();
        groupMesh.position.set = (position.x, position.y, position.z);
        groupMesh.rotation.x = tiltX;
        groupMesh.rotation.y = tiltY;
        groupMesh.rotation.z = tiltZ;

        let compoundShape = new Ammo.btCompoundShape();
        let trampolineGeo = this.createCylinderShape(radius, depth);
        let trampolineMesh = new THREE.Mesh(trampolineGeo, new THREE.MeshPhongMaterial({color: color}));

        trampolineMesh.castShadow = true;
        trampolineMesh.receiveShadow = true;
        groupMesh.add(trampolineMesh);
        // Implementer denne ved behov. Kalles fra MyPhysicsWorld ved kollisjon.
        trampolineMesh.collisionResponse = (mesh1) => {
            mesh1.material.color.setHex(Math.random() * 0xffffff);
        }

        // AMMO:
        commons.createConvexTriangleShapeAddToCompound(compoundShape, trampolineMesh);

        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, 0.6, position, mass);
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            trampolineMesh,
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
}