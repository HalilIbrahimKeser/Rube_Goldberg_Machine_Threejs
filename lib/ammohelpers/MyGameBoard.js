import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

/**
 * MERK1: Her brukes BoxGeometry, altså et volum, som plan.
 * MERK2: Bruker btBvhTriangleMeshShape (og ikke btBvhConvexTriangleMeshShape) til planet.
 */
export const myGameBoard = {
	myPhysicsWorld: undefined,
	gameBoardRigidBody: undefined,
	TERRAIN_SIZE: 100,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true) {
		const position = {x:0, y:0, z:0};
		const mass = 0;

		//THREE, bruker Shape og ExtrudeGeometry:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'gameboard';
		groupMesh.userData.name = 'terrain';
		groupMesh.position.set(position.x, position.y, position.z);
		let threeShape = this.createThreeShape();
		let extrudeSettings = {steps: 1,depth: 1,bevelEnabled: true,bevelThickness: 1,bevelSize: 1,bevelOffset: 0,bevelSegments: 1};
		let gameBoardGeometry = new THREE.ExtrudeGeometry( threeShape, extrudeSettings );
		let gameBoardMaterial = new THREE.MeshPhongMaterial( { color: 0xC709C7, side: THREE.DoubleSide } );
		let gameBoardMesh = new THREE.Mesh( gameBoardGeometry, gameBoardMaterial );
		gameBoardMesh.rotation.x = -Math.PI / 2;
		gameBoardMesh.position.x = -this.TERRAIN_SIZE;
		gameBoardMesh.position.z = this.TERRAIN_SIZE;
		gameBoardMesh.receiveShadow = true;
		groupMesh.add( gameBoardMesh );

		//AMMO:
		let compoundShape = new Ammo.btCompoundShape();
		commons.createTriangleShapeAddToCompound(compoundShape, gameBoardMesh);
		this.gameBoardRigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.05, 0.3, position, mass);
		// BODYFLAG_KINEMATIC_OBJECT = 2 betyr kinematic object, masse=0 men kan flyttes!!
		this.gameBoardRigidBody.setCollisionFlags(this.gameBoardRigidBody.getCollisionFlags() | 2);
		// Never sleep, BODYSTATE_DISABLE_DEACTIVATION = 4
		this.gameBoardRigidBody.setActivationState(4);

		this.myPhysicsWorld.addPhysicsObject(
			this.gameBoardRigidBody,
			groupMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_PLANE,
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
		);
	},

	createThreeShape() {
		let length = this.TERRAIN_SIZE * 2;
		let width = this.TERRAIN_SIZE * 2;
		let shape = new THREE.Shape();
		shape.moveTo( 0,0 );
		shape.lineTo( 0, width );
		shape.lineTo( length, width );
		shape.lineTo( length, 0 );
		shape.lineTo( 0, 0 );
		let hole1 = new THREE.Path();
		hole1.absarc(40, 36, 8, 0, 2*Math.PI, true);
		shape.holes.push(hole1);

		return shape;
	},

	// axisNo: 1=x, 2=y, 3=z
	tilt(axisNo, angle) {
		//this.terrainRigidBody.activate(true);
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
		let terrainMotionState = this.gameBoardRigidBody.getMotionState();
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
