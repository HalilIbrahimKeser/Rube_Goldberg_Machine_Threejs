import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

/**
 * MERK: Her brukes BoxGeometry, altså et volum, som plan.
 */
export const myTiltableXZPlane = {
	myPhysicsWorld: undefined,
	terrainRigidBody: undefined,
	TERRAIN_SIZE: 100,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true,position={x: 0, y: 0, z: 0}, color= 0x0EFE1d) {
		const size = {width: this.TERRAIN_SIZE, height: 2, depth: this.TERRAIN_SIZE};
		const mass = 0;

		// THREE:
		let terrainGeometry = new THREE.BoxGeometry( size.width, size.height, size.depth );
		let groundMaterial = new THREE.MeshPhongMaterial( { color: 0xF70997, side: THREE.DoubleSide } );
		let mesh = new THREE.Mesh(terrainGeometry, groundMaterial);
		mesh.userData.tag = 'terrain';
		mesh.receiveShadow = true;

		// AMMO:
		let terrainShape = new Ammo.btBoxShape(new Ammo.btVector3(size.width/2, size.height/2, size.depth/2));
		this.terrainRigidBody = commons.createAmmoRigidBody(terrainShape, mesh, 0.8, 0.8, position, mass);
		// BODYFLAG_KINEMATIC_OBJECT = 2 betyr kinematic object, masse=0 men kan flyttes!!
		this.terrainRigidBody.setCollisionFlags(this.terrainRigidBody.getCollisionFlags() | 2);
		// Never sleep, BODYSTATE_DISABLE_DEACTIVATION = 4
		this.terrainRigidBody.setActivationState(4);

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(
			this.terrainRigidBody,
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

	// axisNo: 1=x, 2=y, 3=z
	tilt(axisNo, angle) {
		let axis;
		switch (axisNo) {
			case 1:
				axis = new THREE.Vector3( 1, 0, 0 );
				break;
			case 2:
				axis = new THREE.Vector3( 0,1, 0);
				break;
			case 3:
				axis = new THREE.Vector3( 0,0, 1);
				break;
			default:
				axis = new THREE.Vector3( 1, 0, 0 );
		}

		// Henter gjeldende transformasjon:
		let terrainTransform = new Ammo.btTransform();
		let terrainMotionState = this.terrainRigidBody.getMotionState();
		terrainMotionState.getWorldTransform( terrainTransform );
		let ammoRotation = terrainTransform.getRotation();

		// Roter gameBoardRigidBody om en av aksene (bruker Three.Quaternion til dette):
		let threeCurrentQuat = new THREE.Quaternion(ammoRotation.x(), ammoRotation.y(), ammoRotation.z(), ammoRotation.w());
		let threeNewQuat = new THREE.Quaternion();
		threeNewQuat.setFromAxisAngle(axis, this.toRadians(angle));
		// Slår sammen eksisterende rotasjon med ny/tillegg.
		let resultQuaternion = threeCurrentQuat.multiply(threeNewQuat);
		// Setter ny rotasjon på ammo-objektet:
		terrainTransform.setRotation( new Ammo.btQuaternion( resultQuaternion.x, resultQuaternion.y, resultQuaternion.z, resultQuaternion.w ) );
		terrainMotionState.setWorldTransform(terrainTransform);
	},

	toRadians(angle) {
		return angle/(2*Math.PI);
	}
}
