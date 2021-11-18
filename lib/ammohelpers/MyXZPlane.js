import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

export const myXZPlane = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, terrain_size=100, position = {x: 0, y: 0, z: 0}) {
		const mass=0;
		// THREE:
		let geometry = new THREE.PlaneGeometry( terrain_size, terrain_size, 1, 1 );
		geometry.rotateX( -Math.PI / 2 );
		let material = new THREE.MeshPhongMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
		let mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.userData.tag = 'xzplane';

		// AMMO:
		let shape = new Ammo.btBoxShape(new Ammo.btVector3(terrain_size/2, 0, terrain_size/2));
		let rigidBody = commons.createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			mesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_PLANE,
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
		);
	},
}
