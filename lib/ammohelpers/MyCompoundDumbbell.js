import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

export const myCompoundDumbbell = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:-10, y:20, z:-10}, color=0x00FF00, mass=100) {
		// THREE:
		// 1.Rod:
		let compoundMesh = new THREE.Group();
		compoundMesh.userData.tag = 'dumbbel';
		let geometryRod = new THREE.BoxGeometry(30, 2, 2);
		let meshRod = new THREE.Mesh(geometryRod, new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		meshRod.position.set(0, 0, 0);
		meshRod.castShadow = true;
		compoundMesh.add(meshRod);
		// 2.Left bell:
		let leftBellMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshPhongMaterial({color: 0x09F099}));
		leftBellMesh.position.set(-17.5, 0, 0);
		leftBellMesh.castShadow = true;
		compoundMesh.add(leftBellMesh);
		// 3.Right bell:
		let rightBellMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshPhongMaterial({color: 0x09F099}));
		rightBellMesh.position.set(17.5, 0, 0);
		rightBellMesh.castShadow = true;
		compoundMesh.add(rightBellMesh);

		// AMMO:
		let compoundShape = new Ammo.btCompoundShape();
		let rodShape = new Ammo.btBoxShape(new Ammo.btVector3(30 / 2, 2 / 2, 2 / 2));
		let loadLeftShape = new Ammo.btSphereShape(2.5);
		let loadRightShape = new Ammo.btSphereShape(2.5);

		// 1.Rod
		let transform1 = new Ammo.btTransform();
		transform1.setIdentity();
		transform1.setOrigin(new Ammo.btVector3(meshRod.position.x, meshRod.position.y, meshRod.position.z));
		compoundShape.addChildShape(transform1, rodShape);
		// 2.leftBell
		let transform2 = new Ammo.btTransform();
		transform2.setIdentity();
		transform2.setOrigin(new Ammo.btVector3(leftBellMesh.position.x, leftBellMesh.position.y, leftBellMesh.position.z));
		compoundShape.addChildShape(transform2, loadLeftShape);
		// 3.rightBell
		let transform3 = new Ammo.btTransform();
		transform3.setIdentity();
		transform3.setOrigin(new Ammo.btVector3(rightBellMesh.position.x, rightBellMesh.position.y, rightBellMesh.position.z));
		compoundShape.addChildShape(transform3, loadRightShape);

		let rigidBody = commons.createAmmoRigidBody(compoundShape, compoundMesh, 0.2, 0.3, position, mass);

		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			compoundMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_COMPOUND,
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
					this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
					this.myPhysicsWorld.COLLISION_GROUP_PLANE |
					this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
					this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
					this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
					this.myPhysicsWorld.COLLISION_GROUP_BOX |
					this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
		);
	},
}
