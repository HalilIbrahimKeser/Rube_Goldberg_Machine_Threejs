import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

// Lager en skrue bestående av ulike deler.
// MERK! Her brukes btConvexTriangleMeshShape.
export const myConvexTriangleMeshScrew = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:0, y:20, z:-2}, color=0x00FF00, mass=120) {
		//Ammo-container:
		let compoundShape = new Ammo.btCompoundShape();
		//Three-container:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'screw';
		groupMesh.position.set(position.x, position.y, position.z);
		groupMesh.scale.set(0.1,0.1,0.1);

		this.createScrewParts(groupMesh, compoundShape);

		// Sett samme transformasjon på compoundShape som på bottomMesh:
		let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			groupMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE,
			this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
			this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
			this.myPhysicsWorld.COLLISION_GROUP_PLANE |
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
			this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
			this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
			this.myPhysicsWorld.COLLISION_GROUP_BOX |
			this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
		);
	},

	createScrewParts(groupMesh, compoundShape) {
		let geo1 = new THREE.CylinderGeometry(18, 10, 6, 32, 32, false);
		let material = new THREE.MeshLambertMaterial({ color: 0x909090, side: THREE.DoubleSide });
		let meshHead = new THREE.Mesh(geo1, material);
		meshHead.position.set(0,50,0);
		meshHead.castShadow = true;
		groupMesh.add(meshHead);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, meshHead);

		let geo2 = new THREE.CylinderGeometry(10, 10, 100, 32, 32, false);
		let screwTexture = new THREE.TextureLoader().load('../assets/images/screwThread.jpg');
		//screwTexture.wrapS = THREE.RepeatWrapping;
		screwTexture.wrapT = THREE.RepeatWrapping;
		screwTexture.repeat.set(0, 5);
		let screwMaterial = new THREE.MeshLambertMaterial({ color: 0x909090, side: THREE.DoubleSide, map: screwTexture });
		let meshMiddle = new THREE.Mesh(geo2, screwMaterial);
		meshMiddle.position.set(0,0,0);
		meshMiddle.castShadow = true;
		groupMesh.add(meshMiddle);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, meshMiddle);

		let geo3 = new THREE.CylinderGeometry(10, 0, 10, 32, 32, false);
		let tipMesh = new THREE.Mesh(geo3, material);
		tipMesh.position.set(0,-55,0);
		tipMesh.castShadow = true;
		groupMesh.add(tipMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, tipMesh);

		let geo4 = new THREE.BoxGeometry(30, 2.02, 4);
		let material2 = new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide });
		let trackMesh = new THREE.Mesh(geo4, material2);
		trackMesh.position.set(0,52,0);
		groupMesh.add(trackMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, trackMesh);
	},
}
