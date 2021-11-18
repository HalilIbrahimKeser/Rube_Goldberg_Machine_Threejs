import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

/**
 * Shape basert på en vilkårlig THREE.Geometry.
 * Må legges inn i en compound shape for å fungere.
 *
 * MERK! Rigid body-objekter basert på btBvhTriangleMeshShape kan ikke kollidere med hverandre.
 * MERK! Skalering, fra doc:
 *   Instead of scaling the rigid body you will need to instead scale the
 *   shape used for collision detection. This is done by calling btCollisionShape::setLocalScaling().
 */
export const myArbitraryTriangleMesh = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true,
	       geometry= new THREE.BoxGeometry(1,1,1),
	       mass= 3,
	       position= new THREE.Vector3(-20, 30, -20),
	       color= 0x09Fa0F) {

		//THREE:
		let groupMesh = new THREE.Group();
		groupMesh.position.set(position.x, position.y, position.z);
		groupMesh.scale.set(1,1,1);
		groupMesh.userData.tag = 'trianglemesh';
		let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: color, wireframe: false, side: THREE.DoubleSide}));
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
