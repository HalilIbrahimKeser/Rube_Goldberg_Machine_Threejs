import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

// Lager en helikopter bestående av ulike deler:
// MERK! Her brukes btConvexTriangleMeshShape.
export const myConvexTriangleMeshHelicopter = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:0, y:20, z:-2}, color=0x00FF00, mass=20000) {

		//Ammo-container:
		let compoundShape = new Ammo.btCompoundShape();
		//Three-container:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'helicopter';
		groupMesh.position.x = -15
		groupMesh.position.y = 70;
		groupMesh.position.z = 20;
		groupMesh.scale.set(1,1, 1);

		this.createHeliParts(groupMesh, compoundShape);

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

	createHeliParts(groupMesh, compoundShape) {
		//Cockpit: three.js :
		let cockpitTexture = new THREE.TextureLoader().load('../assets/images/metal1.jpg');
		let cockpitGeometry = new THREE.SphereGeometry(5, 32, 32);
		let cockpitMaterial = new THREE.MeshPhongMaterial({ map: cockpitTexture });
		let cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
		cockpitMesh.castShadow = true;
		cockpitMesh.name = "cockpit";
		cockpitMesh.position.x = 0;
		cockpitMesh.position.y = 0;
		cockpitMesh.position.z = 0;
		groupMesh.add(cockpitMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, cockpitMesh);

		//Body:
		let bodyTexture = new THREE.TextureLoader().load('../assets/images/metal1.jpg');
		let bodyGeometry = new THREE.CylinderGeometry(1.0, 4, 12, 8, 4, false);
		let bodyMaterial = new THREE.MeshPhongMaterial({ map: bodyTexture });
		let bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
		bodyMesh.castShadow = true;
		bodyMesh.name = "body";
		bodyMesh.rotation.z = Math.PI / 2;
		bodyMesh.position.x = -7;
		bodyMesh.position.y = 0;
		bodyMesh.position.z = 0;
		groupMesh.add(bodyMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, bodyMesh);

		//Rotor:
		let rotorGeometry = new THREE.BoxGeometry(0.2, 20, 1);
		let rotorMaterial = new THREE.MeshBasicMaterial({ color:0x00de88});
		let rotorMesh = new THREE.Mesh(rotorGeometry, rotorMaterial);
		rotorMesh.name = "rotor";
		rotorMesh.rotation.z = Math.PI / 2;
		rotorMesh.rotation.y = Math.PI / 5;
		rotorMesh.position.x = 0;
		rotorMesh.position.y = 5;
		rotorMesh.position.z = 0;
		rotorMesh.castShadow = true;
		groupMesh.add(rotorMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, rotorMesh);

		//Bakrotor:
		let backrotorGeometry = new THREE.BoxGeometry(5, 1, 0.2);
		let backrotorMaterial = new THREE.MeshBasicMaterial({ color:0x00de88});
		let backrotorMesh = new THREE.Mesh(backrotorGeometry, backrotorMaterial);
		backrotorMesh.name = "bakrotor";
		backrotorMesh.position.x = -13.0;
		backrotorMesh.position.y = 1;
		backrotorMesh.position.z = 0;
		groupMesh.add(backrotorMesh);
		commons.createConvexTriangleShapeAddToCompound(compoundShape, backrotorMesh);
	},
}
