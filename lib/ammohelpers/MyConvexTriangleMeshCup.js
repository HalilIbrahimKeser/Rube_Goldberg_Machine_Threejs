import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

// Lager en kaffekopp bestående av ulike deler:
// MERK! Her brukes btConvexTriangleMeshShape.
export const myConvexTriangleMeshCup = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x:0, y:20, z:-2}, color=0x00FF00, mass=20) {
		//Ammo-container:
		let compoundShape = new Ammo.btCompoundShape();
		//Three-container:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'cup';
		groupMesh.position.x = 10
		groupMesh.position.y = 25;
		groupMesh.position.z = -15;
		groupMesh.scale.set(0.5,0.5,0.5);
		this.createCupParts(groupMesh, compoundShape);
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

	createCupParts(groupMesh, compoundShape) {
		// Teksturer:
		let cupTexture = new THREE.TextureLoader().load('../assets/images/metal_tread_plate1.jpg');
		let cupMaterial = new THREE.MeshPhongMaterial({map : cupTexture, side: THREE.DoubleSide});	//NB! MeshPhongMaterial

		// Bunnen/sylinder:
		let bottomGeometry = new THREE.CylinderGeometry( 8, 8, 1, 32 );
		let bottomMesh = new THREE.Mesh( bottomGeometry, cupMaterial );
		bottomMesh.rotation.z = 0;
		bottomMesh.position.x = 0;
		bottomMesh.position.y = 0;
		groupMesh.add( bottomMesh );
		commons.createConvexTriangleShapeAddToCompound(compoundShape, bottomMesh);

		// Hanken/Torus:
		let torusGeometry = new THREE.TorusGeometry( 9.2, 2, 16, 100, Math.PI );
		let torusMesh = new THREE.Mesh( torusGeometry, cupMaterial );
		torusMesh.rotation.z = -Math.PI/2 - Math.PI/14;
		torusMesh.position.x = 15.8;
		torusMesh.position.y = 15;
		torusMesh.scale.set(1,1, 1);
		groupMesh.add( torusMesh );
		commons.createConvexTriangleShapeAddToCompound(compoundShape, torusMesh);

		//Koppen/Lathe:
		let points = [];
		for (let x = 0; x < 1; x=x+0.1) {
			let y = Math.pow(x,5)*2;
			points.push(new THREE.Vector2(x*20,y*13));
		}
		let latheGeometry = new THREE.LatheGeometry(points, 128, 0, 2 * Math.PI);
		let latheMesh = new THREE.Mesh(latheGeometry, cupMaterial);
		latheMesh.updateMatrix();
		latheMesh.updateMatrixWorld(true);
		latheMesh.scale.set(1,1, 1);
		groupMesh.add( latheMesh );
		commons.createConvexTriangleShapeAddToCompound(compoundShape, latheMesh);

		// Kaffen, sylinder:
		let coffeeTexture = new THREE.TextureLoader().load('../assets/images/tile2.png');
		let coffeeGeometry = new THREE.CylinderGeometry( 18, 18, 0.2, 32 );
		let coffeeMaterial = new THREE.MeshPhongMaterial({color:0x7F4600, map : coffeeTexture});
		let coffeeMesh = new THREE.Mesh( coffeeGeometry, coffeeMaterial );
		coffeeMesh.position.x = 0;
		coffeeMesh.position.y = 24;
		coffeeMesh.position.z = 0;
		groupMesh.add( coffeeMesh );
		commons.createConvexTriangleShapeAddToCompound(compoundShape, coffeeMesh);
	},
}
