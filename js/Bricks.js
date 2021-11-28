import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";

export const bricks = {
    myPhysicsWorld: undefined,
    //scene: undefined,

    init(myPhysicsWorld) { // må endres til ammophysicsworld
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask = true,
           mass = 10,
           color = Math.random() * 0xffffff,
           position = {x: 60, y: -18, z: 50},
           radius = 0.2,
           length = 50,
           width = 20,
           degrees1 = 20,
           degrees2 = 2,
           degrees3 = -60) {

        let groupMesh = new THREE.Group();

        let x_dif_beetween_bricks = 11;
        let y_dif_beetween_bricks = -0.2;
        let z_dif_beetween_bricks = 30;

        let temp_x_pos = position.x + x_dif_beetween_bricks;
        let temp_y_pos = position.y + y_dif_beetween_bricks;
        let temp_z_pos = position.z + z_dif_beetween_bricks;

        // BRICKS
        for (let i = 1; i < 10; i++) {
            let nameShape = "brickShape" + i;
            let nameMesh = "brickMesh" + i;

            nameShape = this.createThreeShape(length, width);
            nameMesh = this.createExtrudeMesh(nameShape, 1, 5, true, 2, 2, 0, 1, new THREE.MeshPhongMaterial({color: color}));
            nameMesh.position.set(temp_x_pos, temp_y_pos, temp_z_pos);
            nameMesh.rotateY(this.degreesToRadians(degrees1));
            //nameMesh.rotateX(this.degreesToRadians(degrees2));
            nameMesh.castShadow = true;
            nameMesh.receiveShadow = true;
            nameMesh.name = "brickMesh" + i;

            temp_x_pos += x_dif_beetween_bricks + (i * degrees2);
            temp_y_pos += y_dif_beetween_bricks
            temp_z_pos += z_dif_beetween_bricks;

            groupMesh.add(nameMesh);
            groupMesh.rotation.y = this.degreesToRadians(degrees3);
            // AMMO
            this.addCompoundAmmo(nameMesh, groupMesh, 0.1, 0.3, position, mass, setCollisionMask);
        }

    },

    createExtrudeMesh(shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, material) {
        let extrudeSettings = {
            steps: steps,
            depth: depth,
            bevelEnabled: bevelEnabled,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: bevelOffset,
            bevelSegments: bevelSegments
        };
        let shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        let extrudeMesh = new THREE.Mesh(shapeGeometry, material);
        return extrudeMesh;
    },

    createThreeShape(length, width) {
        //let length = this.TERRAIN_SIZE * 2;
        //let width = this.TERRAIN_SIZE * 3;
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, length);
        shape.lineTo(width, length);
        shape.lineTo(width, 0);
        shape.lineTo(0, 0);

        return shape;
    },

    addCompoundAmmo(mesh,  groupMesh, restitution, friction, position, mass, collisionMask) {
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


    degreesToRadians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}

}