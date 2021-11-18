import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

export const mySphere = {
	myPhysicsWorld: undefined,
	mesh: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:0, y:50, z:0}, color=0x00FF00, mass=10) {
		let radius = 0.2*mass;

		//THREE
		this.mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshPhongMaterial({color: color}));
		this.mesh.userData.tag = 'sphere';
		this.mesh.position.set(position.x, position.y, position.z);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		// Implementer denne ved behov. Kalles fra MyPhysicsWorld ved kollisjon.
		this.mesh.collisionResponse = (mesh1) => {
			mesh1.material.color.setHex(Math.random() * 0xffffff);
		};

		//AMMO
		let shape = new Ammo.btSphereShape(radius);
		let rigidBody = commons.createAmmoRigidBody(shape, this.mesh, 0.7, 0.8, position, mass);

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			this.mesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE,
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_PLANE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
				this.myPhysicsWorld.COLLISION_GROUP_BOX |
				this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
		);
	},

	createRandom(setCollisionMask=true, xzrange=200, height=50) {
		let xPos = -(xzrange/2) + Math.random() * xzrange;
		let zPos = -(xzrange/2) + Math.random() * xzrange;
		let pos = {x: xPos, y: height, z: zPos};
		let mass = 2 + Math.random() * 20;
		this.create(setCollisionMask, pos, 0xff0505, mass);
	},
}
