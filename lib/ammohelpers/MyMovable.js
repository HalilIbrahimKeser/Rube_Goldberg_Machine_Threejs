import * as THREE from "../three/build/three.module.js";
import {ConvexGeometry} from '../three/examples/jsm/geometries/ConvexGeometry.js';
import {commons} from "./lib/Common.js";

export const myMovable = {
	myPhysicsWorld: undefined,
	convexRigidBody: undefined,
	yPos: undefined,

	init(myPhysicsWorld, yPos=0) {
		this.myPhysicsWorld = myPhysicsWorld;
		this.yPos = yPos;
	},

	create(setCollisionMask=true, geometryType=1, position = {x: 10, y: 0 + this.yPos, z: 10}, mass=0, size=5) {
		// Genererer vertekser for en eller annen standardgeometri:
		let vertices = this.generateConvexGeometryByGiven(geometryType,size);

		// THREE:
		let geometry = new ConvexGeometry(vertices);
		let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x070aFd}));
		mesh.userData.tag = 'movalbe';
		mesh.scale.set(1,1,1);
		//Justerer høyden i forhold til størrelse og skalering:
		position.y = position.y + mesh.scale.y*size/2;
		mesh.position.set(position.x, position.y, position.z);
		mesh.castShadow = true;
		// Implementer denne ved behov. Kalles fra MyPhysicsWorld ved kollisjon.
		mesh.collisionResponse = (mesh1) => {
			mesh1.material.color.setHex(Math.random() * 0xffffff);
		}

		// AMMO:
		let shape = new Ammo.btConvexHullShape();
		for (let i = 0; i < vertices.length; i++) {
			shape.addPoint(new Ammo.btVector3(vertices[i].x, vertices[i].y, vertices[i].z))
		}

		this.convexRigidBody = commons.createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
		// NB! Følgende er avgjørende for å kunne flytte på objektet:
		// 2 = BODYFLAG_KINEMATIC_OBJECT: Betyr kinematic object, masse=0 men kan flyttes!
		this.convexRigidBody.setCollisionFlags(this.convexRigidBody.getCollisionFlags() | 2);
		// 4 = BODYSTATE_DISABLE_DEACTIVATION, dvs. "Never sleep".
		this.convexRigidBody.setActivationState(4);

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(
			this.convexRigidBody,
			mesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE,
				this.myPhysicsWorld.COLLISION_GROUP_PLANE |
				this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
				this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_BOX
		);
	},

	/**
	* Returnerer en ConvexGeometry basert på vertekser til en annen gitt geometri.
	* @param type  0=Dodeco..., 1=Sylinder, 2=Kule, 3=Box osv.
	* @returns {ConvexGeometry}
	*/
	generateConvexGeometryByGiven(geometryType, size=1) {
		let vertices = [];
		let positions;
		switch (geometryType) {
			case 0: //Dodeca..
				positions = new THREE.DodecahedronGeometry(size).attributes.position;
				break;
			case 1: //Sylinder
				positions = new THREE.CylinderGeometry(size, size, size, 8, 1, false).attributes.position;
				break;
			case 2: //Kule
				positions = new THREE.SphereGeometry(size).attributes.position;
				break;
			case 3: //Box
				positions = new THREE.BoxGeometry(size, size, size).attributes.position;
				break;
			default:
				positions = new THREE.BoxGeometry(size, size, size).attributes.position;
		}

		for (let vertexIndex = 0; vertexIndex < positions.count; vertexIndex++) {
			let position = new THREE.Vector3();
			position.fromBufferAttribute(positions, vertexIndex);
			vertices.push(position);
		}
		return vertices;
	},

	// For at en rigid-body (RB) skal være flyttbar følgende settes:
	//   this.convexRigidBody.setCollisionFlags(this.convexRigidBody.getCollisionFlags() | 2);
	//     BODYFLAG_KINEMATIC_OBJECT = 2 betyr kinematic object, masse=0 men kan flyttes!!
	//   this.convexRigidBody.setActivationState(4); // Slipper å aktivere ...
	move(direction) {
		let transform1 = new Ammo.btTransform();
		let ms1 = this.convexRigidBody.getMotionState();
		ms1.getWorldTransform(transform1);
		let curPosition1 = transform1.getOrigin();
		transform1.setOrigin(new Ammo.btVector3(curPosition1.x() + direction.x, curPosition1.y() + direction.y, curPosition1.z() + direction.z));
		ms1.setWorldTransform(transform1);
	},
}
