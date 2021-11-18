import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

// Lager en bygning bestående av ulike deler.
// MERK! Her brukes btTriangleMeshShape, via commons.createTriangleShapeAddToCompound(...)
// siden dette er et statisk/ikke-bevelig objekt.
export const myTriangleMeshBuilding = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, mesh, position={x:40, y:0, z:40}, color=0x00FF00) {
		const mass=0;
		//Ammo-container:
		let compoundShape = new Ammo.btCompoundShape();
		//Three-container:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'building';
		groupMesh.position.set(position.x, position.y, position.z);
		groupMesh.scale.set(1,1,1);

		this.createBuildingParts(groupMesh, compoundShape);

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

	createBuildingParts(groupMesh, compoundShape) {
		let material1 = new THREE.MeshLambertMaterial({ color: 0xF09090, side: THREE.DoubleSide });
		let material2 = new THREE.MeshLambertMaterial({ color: 0x9090A0, side: THREE.DoubleSide });

		let sizeBase={width:10, height: 15, depth: 10 }
		let sizeRoof={topRadius:0, bottomRadius: 9, height: 8 }

		let geo1 = new THREE.BoxGeometry(sizeBase.width, sizeBase.height, sizeBase.depth);
		let geo2 = new THREE.CylinderGeometry(sizeRoof.topRadius, sizeRoof.bottomRadius, sizeRoof.height, 32, 32, false);

		let meshBase = new THREE.Mesh(geo1, material1);
		meshBase.position.set(0,sizeBase.height/2,0);
		meshBase.castShadow = true;
		groupMesh.add(meshBase);
		commons.createTriangleShapeAddToCompound(compoundShape, meshBase);

		let meshRoof = new THREE.Mesh(geo2, material2);
		meshRoof.position.set(0, sizeRoof.height/2 + sizeBase.height,0);
		meshRoof.castShadow = true;
		groupMesh.add(meshRoof);
		commons.createTriangleShapeAddToCompound(compoundShape, meshRoof);
	},
}
