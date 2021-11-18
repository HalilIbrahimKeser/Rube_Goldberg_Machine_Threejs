import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

export const myCompoundTV = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:0, y:10, z:-6}, color=0x00FF00, mass=20) {
		let scaleScreen = {x: 16, y: 8, z: 1};
		let scaleFoot = {x: 8, y: 1, z: 4};
		let scaleCyl = {x: 2, y: 1.5, z: 2};

		let originScreen = {x: 0, y: 6.5, z: 0};
		let originCylinder = {x: 0, y: 2, z: 0};
		let originFoot = {x: 0, y: 1, z: 0};

		// THREE:
		let compoundMesh = new THREE.Group();
		compoundMesh.userData.tag = 'tv';
		// Skjerm/ramme:
		let geometryScreen = new THREE.BoxGeometry(scaleScreen.x, scaleScreen.y, scaleScreen.z);
		let meshScreen = new THREE.Mesh(geometryScreen, new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		meshScreen.position.set(originScreen.x, originScreen.y, originScreen.z);
		meshScreen.castShadow = true;
		compoundMesh.add(meshScreen);
		// Skjermglass:
		let texture = new THREE.TextureLoader().load("../assets/images/bird1.png");
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(3, 2);
		let geometryGlass = new THREE.BoxGeometry(scaleScreen.x - 0.3, scaleScreen.y - 0.3, scaleScreen.z + 0.1);
		let meshGlass = new THREE.Mesh(geometryGlass, new THREE.MeshPhongMaterial({color: 0xFFFFFF, map: texture}));
		meshGlass.position.set(originScreen.x, originScreen.y, originScreen.z);
		compoundMesh.add(meshGlass);
		// Skjermfotsylinder::
		let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(scaleCyl.x, scaleCyl.x, scaleCyl.y, 32), new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		cylinderMesh.position.set(originCylinder.x, originCylinder.y, originCylinder.z);
		cylinderMesh.castShadow = true;
		compoundMesh.add(cylinderMesh);
		// Skjermfot:
		let footGeometry = new THREE.BoxGeometry(scaleFoot.x, scaleFoot.y, scaleFoot.z);
		let footMesh = new THREE.Mesh(footGeometry, new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		footMesh.position.set(originFoot.x, originFoot.y, originFoot.z);
		footMesh.castShadow = true;
		compoundMesh.add(footMesh);

		// AMMO:
		let compoundShape = new Ammo.btCompoundShape();
		let screenShape = new Ammo.btBoxShape(new Ammo.btVector3(scaleScreen.x * 0.5, scaleScreen.y * 0.5, scaleScreen.z * 0.5));
		let cylShape = new Ammo.btCylinderShape(new Ammo.btVector3(scaleCyl.x * 0.5, scaleCyl.y * 0.5, scaleCyl.z * 0.5));
		let footShape = new Ammo.btBoxShape(new Ammo.btVector3(scaleFoot.x * 0.5, scaleFoot.y * 0.5, scaleFoot.z * 0.5));

		let trans1 = new Ammo.btTransform();
		trans1.setIdentity();
		trans1.setOrigin(new Ammo.btVector3(originScreen.x, originScreen.y, originScreen.z));
		compoundShape.addChildShape(trans1, screenShape);

		let trans2 = new Ammo.btTransform();
		trans2.setIdentity();
		trans2.setOrigin(new Ammo.btVector3(originCylinder.x, originCylinder.y, originCylinder.z));
		compoundShape.addChildShape(trans2, cylShape);

		let trans3 = new Ammo.btTransform();
		trans3.setIdentity();
		trans3.setOrigin(new Ammo.btVector3(footShape.x, footShape.y, footShape.z));
		compoundShape.addChildShape(trans3, footShape);

		let rigidBody = commons.createAmmoRigidBody(compoundShape, compoundMesh, 0.2, 0.9, position, mass);

		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			compoundMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_COMPOUND,
			this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_PLANE |
				this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
				this.myPhysicsWorld.COLLISION_GROUP_BOX |
				this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
		);
	},
}
