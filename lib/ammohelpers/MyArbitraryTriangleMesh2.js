import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

/**
 * Samme som MyArbitraryTriangleMesh bortsett fra at denne tar i mot et vilkårlig THREE.Mesh-objekt
 * i stedet for et THREE.Geometry-objekt.
 */
export const myArbitraryTriangleMesh2 = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true,
	       mesh= new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial()),
	       mass= 3,
	       position= new THREE.Vector3(-20, 30, -20)) {

		//THREE:
		let groupMesh = new THREE.Group();
		groupMesh.userData.tag = 'trianglemesh';
		groupMesh.position.set(position.x, position.y, position.z);
		groupMesh.scale.set(1,1,1);
		groupMesh.add(mesh);

		// AMMO: bruker btCompoundShape med btConvexTriangleShape:
		let compoundShape = new Ammo.btCompoundShape();
		commons.createConvexTriangleShapeAddToCompound(compoundShape, mesh);
		let rigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);

		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			groupMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE,
			this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
				this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_PLANE
		);
	},
}
