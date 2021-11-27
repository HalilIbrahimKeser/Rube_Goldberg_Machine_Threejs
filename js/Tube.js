import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const tube = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true,
           position={x:200, y:419, z:-490},
           color=Math.random() * 0xffffff,
           mass= 0,
           radius= 70,
           depth = 150,
           tiltX = 0,
           tiltY = Math.PI/2,
           tiltZ = 0,
           restitution = 4) {

        let groupMesh = new THREE.Group();
        groupMesh.position.set = (position.x, position.y, position.z);
        groupMesh.rotation.x = tiltX;
        groupMesh.rotation.y = tiltY;
        groupMesh.rotation.z = tiltZ;

        let compoundShape = new Ammo.btCompoundShape();
        let tubeGeo = this.createHoledCylinderShape(radius, depth);
        let tubeMesh = new THREE.Mesh(tubeGeo, new THREE.MeshPhongMaterial({color: color}));

        tubeMesh.castShadow = true;
        tubeMesh.receiveShadow = true;
        groupMesh.add(tubeMesh);
        // Implementer denne ved behov. Kalles fra MyPhysicsWorld ved kollisjon.
        tubeMesh.collisionResponse = (mesh1) => {
            mesh1.material.color.setHex(Math.random() * 0xffffff);
        }

        // AMMO:
        commons.createTriangleShapeAddToCompound(compoundShape, tubeMesh);



        let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, 0.6, position, mass);
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            tubeMesh,
            setCollisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND,
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE|
            this.myPhysicsWorld.COLLISION_GROUP_PLANE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );






    },

    //https://stackoverflow.com/questions/11826798/how-do-i-construct-a-hollow-cylinder-in-three-js
    createHoledCylinderShape(radius, depth){
        let extrudeSettings = {
            depth : depth,
            steps : 1,
            bevelEnabled: false,
            curveSegments: 8
        };

        let arcShape = new THREE.Shape();
        arcShape.absarc(0, 0, radius, 0, Math.PI * 2, 0, false);

        let holePath = new THREE.Path();
        holePath.absarc(0, 0, radius*0.5, 0, Math.PI * 2, true);
        arcShape.holes.push(holePath);

        let holedCylinderGeometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
        return holedCylinderGeometry;
    },
}