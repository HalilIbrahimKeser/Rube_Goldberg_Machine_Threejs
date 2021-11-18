import * as THREE from "../../three/build/three.module.js";

export const commons = {
	/**
	 * Oppretter og returnerer et rigid body-objekt for gitt Ammo-shape og threeMesh.
	 * Setter Ammo-posisjon, rotasjon og skala basert på threeMesh-objektet.
	 * @param shape
	 * @param threeMesh
	 * @param restitution
	 * @param friction
	 * @param position
	 * @param mass
	 * @returns {*}
	 */
	createAmmoRigidBody(shape, threeMesh, restitution=0.7, friction=0.8, position={x:0, y:50, z:0}, mass=1) {

		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

		let quaternion = threeMesh.quaternion;
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		let scale = threeMesh.scale;
		shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

		let motionState = new Ammo.btDefaultMotionState(transform);
		let localInertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(mass, localInertia);

		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
		let rigidBody = new Ammo.btRigidBody(rbInfo);
		rigidBody.setRestitution(restitution);
		rigidBody.setFriction(friction);

		return rigidBody;
	},

	/**
	 * Brukes til bevegelige objekter:
	 * @param compoundShape
	 * @param mesh
	 */
	createConvexTriangleShapeAddToCompound(compoundShape, mesh) {
		let shape = this.generateTriangleShape(mesh, true);
		this.addToCompound(compoundShape, mesh, shape);
	},

	/**
	 * Brukes til statiske objekter.
	 * @param compoundShape
	 * @param mesh
	 */
	createTriangleShapeAddToCompound(compoundShape, mesh) {
		let shape = this.generateTriangleShape(mesh, false);
		this.addToCompound(compoundShape, mesh, shape);
	},

	/**
	 * Lager en btBoxShape og legger den til compopundShape.
	 * @param compoundShape
	 * @param mesh
	 */
	createBoxShapeAddToCompound(compoundShape, boxMesh) {
		let scale = new THREE.Vector3();
		boxMesh.getWorldScale(scale);
		let w = boxMesh.geometry.parameters.width * scale.x;
		let h = boxMesh.geometry.parameters.height * scale.y;
		let d = boxMesh.geometry.parameters.depth * scale.z;
		let shape = new Ammo.btBoxShape(new Ammo.btVector3(w/2, h/2, d/2));
		this.addToCompound(compoundShape, boxMesh, shape);
	},

	/**
	 * Lager en btBoxShape og legger den til compopundShape.
	 * @param compoundShape
	 * @param mesh
	 */
	createCylinderShapeAddToCompound(compoundShape, cylinderMesh) {
		let radius = cylinderMesh.geometry.parameters.radiusTop;
		let hoyde = cylinderMesh.geometry.parameters.height;
		let shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, hoyde/2, radius ));
		this.addToCompound(compoundShape, cylinderMesh, shape);
	},

	/**
	 * Setter transformasjon på shape-objektet tilvarende mesh-objektet.
	 * Legger shape-objektet til compoundShape.
	 * @param compoundShape
	 * @param mesh
	 * @param shape
	 */
	addToCompound(compoundShape, mesh, shape) {
		let shapeTrans = new Ammo.btTransform();
		shapeTrans.setIdentity();
		shapeTrans.setOrigin(new Ammo.btVector3(mesh.position.x,mesh.position.y,mesh.position.z));
		let quat = mesh.quaternion;
		shapeTrans.setRotation( new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w) );
		compoundShape.addChildShape(shapeTrans, shape);
	},

	createCylinderShape(cylinderMesh) {
		let radius = cylinderMesh.geometry.parameters.radiusTop;
		let hoyde = cylinderMesh.geometry.parameters.height;
		let shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, hoyde/2, radius ));
		return shape;
	},

	createSphereShape(sphereMesh) {
		let radius = sphereMesh.geometry.parameters.radius;
		return new Ammo.btSphereShape(radius);
	},

	createBoxShape(boxMesh) {
		let width = boxMesh.geometry.parameters.width;
		let height = boxMesh.geometry.parameters.height;
		let depth = boxMesh.geometry.parameters.depth;
		return new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	},

	createConvexHullShape(vertices) {
		let shape = new Ammo.btConvexHullShape();
		for (let i = 0; i < vertices.length; i++) {
			shape.addPoint(new Ammo.btVector3(vertices[i].x, vertices[i].y, vertices[i].z))
		}
		return shape;
	},

	/**
	 * Oppretter og returnerer en btBvhTriangleMeshShape ELLER btConvexTriangleMeshShape og skalerer shapen i forhold til meshet.
	 * MERK!
	 * Rigid body-objekter basert på btBvhTriangleMeshShape kan ikke kollidere med hverandre.
	 * Rigid body-objekter basert på btConvexTriangleMeshShape kan kollidere med hverandre, men har en konveks kollisjonsboks rundt seg.
	 * @param mesh
	 * @param useConvexShape
	 * @returns {*}
	 */
	generateTriangleShape(mesh, useConvexShape) {
		let vertices = this.traverseModel(mesh);
		let ammoMesh = new Ammo.btTriangleMesh();
		for (let i = 0; i < vertices.length; i += 9)
		{
			let v1_x = vertices[i];
			let v1_y = vertices[i+1];
			let v1_z = vertices[i+2];

			let v2_x = vertices[i+3];
			let v2_y = vertices[i+4];
			let v2_z = vertices[i+5];

			let v3_x = vertices[i+6];
			let v3_y = vertices[i+7];
			let v3_z = vertices[i+8];

			let bv1 = new Ammo.btVector3(v1_x, v1_y, v1_z);
			let bv2 = new Ammo.btVector3(v2_x, v2_y, v2_z);
			let bv3 = new Ammo.btVector3(v3_x, v3_y, v3_z);

			ammoMesh.addTriangle(bv1, bv2, bv3);
		}

		let triangleShape;
		if (useConvexShape)
			triangleShape = new Ammo.btConvexTriangleMeshShape(ammoMesh, false);
		else
			triangleShape = new Ammo.btBvhTriangleMeshShape(ammoMesh, false);

		let threeScale = mesh.scale;
		triangleShape.setLocalScaling(new Ammo.btVector3(threeScale.x, threeScale.y, threeScale.z));
		return triangleShape;
	},

	/**
	 * Traverserer meshet rekursivt.
	 * Henter og returnerer alle vertekser fra alle mesh- og barnemesh.
	 * @param mesh
	 * @param modelVertices
	 * @returns {*[]}
	 */
	traverseModel(mesh, modelVertices=[]) {
		if (mesh.type === "SkinnedMesh" || mesh.type === "Mesh" || mesh.type === "InstancedMesh") {
			let bufferGeometry = mesh.geometry;
			let attr = bufferGeometry.attributes;
			let position = attr.position;
			let tmpVertices = Array.from(position.array);
			//modelVertices = modelVertices.concat(tmpVertices);
			modelVertices.push(...tmpVertices);
		}
		mesh.children.forEach((child, ndx) => {
			this.traverseModel(child, modelVertices);
		});
		return modelVertices;
	}
}
