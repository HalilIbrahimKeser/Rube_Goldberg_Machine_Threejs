import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

/**
 * Simulerer en fjær mellom to objekter:
 * Basert på: https://stackoverflow.com/questions/46671809/how-to-make-a-spring-constraint-with-bullet-physics
 */
export const mySpring = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true) {

		let mass1 = 0;
		let mass2 = 20;
		let pos1 = {x: 10, y: 20, z: 0};
		let pos2 = {x: 10, y: 0, z: 0};
		let size = {x: 2, y: 2, z: 2};

		// Three:
		let springCubeMesh1 = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		springCubeMesh1.position.set(pos1.x, pos1.y, pos1.z);
		let springCubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), new THREE.MeshPhongMaterial({color: 0x008a1d}));
		springCubeMesh2.position.set(pos2.x, pos2.y, pos2.z);

		// Ammo: samme shape brukes av begge RBs:
		let boxShape = new Ammo.btBoxShape( new Ammo.btVector3( size.x/2, size.y/2, size.z/2 ) );

		let rbBox1 = commons.createAmmoRigidBody(boxShape, springCubeMesh1, 0.4, 0.6, pos1, mass1);
		let rbBox2 = commons.createAmmoRigidBody(boxShape, springCubeMesh2, 0.4, 0.6, pos2, mass2);

		//FJÆR MELLOM box1 og 2: https://stackoverflow.com/questions/46671809/how-to-make-a-spring-constraint-with-bullet-physics
		let transform1 = new Ammo.btTransform();
		transform1.setIdentity();
		transform1.setOrigin( new Ammo.btVector3( 0, -1, 0 ) );
		let transform2 = new Ammo.btTransform();
		transform2.setIdentity();
		transform2.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );

		let springConstraint = new Ammo.btGeneric6DofSpringConstraint(
			rbBox1,
			rbBox2,
			transform1,
			transform2,
			true);

		// Removing any restrictions on the y-coordinate of the hanging box
		// by setting the lower limit above the upper one.
		springConstraint.setLinearLowerLimit(new Ammo.btVector3(0.0, 1.0, 0.0));
		springConstraint.setLinearUpperLimit(new Ammo.btVector3(0.0, 0.0, 0.0));

		// NB! Disse er viktig for at ikke den hengende kuben ikke skal rotere om alle akser!!
		// Disse gjør at den hengende boksen ikke roterer når den er festet til en constraint (se side 130 i Bullet-boka).
		springConstraint.setAngularLowerLimit(new Ammo.btVector3(0, 0.0, 0.0));
		springConstraint.setAngularUpperLimit(new Ammo.btVector3(0, 0.0, 0.0));

		// FRA: https://pybullet.org/Bullet/BulletFull/classbtGeneric6DofSpringConstraint.html
		// DOF index used in enableSpring() and setStiffness() means:
		// 0 : translation X
		// 1 : translation Y
		// 2 : translation Z
		// 3 : rotation X (3rd Euler rotational around new position of X axis, range [-PI+epsilon, PI-epsilon] )
		// 4 : rotation Y (2nd Euler rotational around new position of Y axis, range [-PI/2+epsilon, PI/2-epsilon] )
		// 5 : rotation Z (1st Euler rotational around Z axis, range [-PI+epsilon, PI-epsilon] )

		// Enabling the spring behavior for they y-coordinate (index = 1)
		//springConstraint.enableSpring(0,  false);
		springConstraint.enableSpring(1,  true);    // Translation on y-axis
		//springConstraint.enableSpring(2,  false);
		//springConstraint.enableSpring(3,  false);
		//springConstraint.enableSpring(4,  false);
		//springConstraint.enableSpring(5,  false);

		//springConstraint.setStiffness(0, 0);
		springConstraint.setStiffness(1, 55);
		//springConstraint.setStiffness(2, 0);

		//springConstraint.setDamping  (0,  0);
		springConstraint.setDamping  (1,  0.9);
		//springConstraint.setDamping  (2,  0);

		this.myPhysicsWorld.ammoPhysicsWorld.addConstraint( springConstraint, false );

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(rbBox1, springCubeMesh1);
		this.myPhysicsWorld.addPhysicsObject(rbBox2, springCubeMesh2);
	}
}
