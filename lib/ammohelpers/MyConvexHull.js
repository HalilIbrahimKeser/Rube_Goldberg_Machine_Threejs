import * as THREE from "../three/build/three.module.js";
import {ConvexGeometry} from '../three/examples/jsm/geometries/ConvexGeometry.js';
import {commons} from "./lib/Common.js";
// "Konveks omhylning"
// https://en.wikipedia.org/wiki/Convex_hull
export const myConvexHull = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true, position={x: -10, y: 20, z: -10}, color= 0x0EFE1d, mass=30) {
		// Genererer vertekser for convex:
		let vertices = this.generateRandomConvexGeometry();  //new THREE.DodecahedronGeometry( 3 ).vertices;

		// THREE:
		var geometry = new ConvexGeometry(vertices);
		let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: color}));
		mesh.userData.tag = 'convex';
		mesh.position.set(position.x, position.y, position.z);
		mesh.castShadow = true;

		// AMMO:
		let convexShape = new Ammo.btConvexHullShape(); //( new Ammo.btVector3( scaleScreen.x * 0.5, scaleScreen.y * 0.5, scaleScreen.z * 0.5 ) );
		for (var i = 0; i < vertices.length; i++) {
			convexShape.addPoint(new Ammo.btVector3(vertices[i].x, vertices[i].y, vertices[i].z))
		}

		let rigidBody = commons.createAmmoRigidBody(convexShape, mesh, 0.8, 0.8, position, mass);
		this.myPhysicsWorld.addPhysicsObject(
			rigidBody,
			mesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_CONVEX,
				this.myPhysicsWorld.COLLISION_GROUP_PLANE |
					this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
					this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
					this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
					this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
					this.myPhysicsWorld.COLLISION_GROUP_BOX |
					this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
		);
	},

	generateRandomConvexGeometry()
	{
		// add 300 random points / spheres:
		let points = [];
		for (let i = 0; i < 300; i++) {
			let randomX = -4 + Math.round(Math.random() * 8);
			let randomY = -9 + Math.round(Math.random() * 18);
			let randomZ = -8 + Math.round(Math.random() * 16);
			points.push(new THREE.Vector3(randomX, randomY, randomZ));
		}
		return points;
	}
}
