import * as THREE from "../three/build/three.module.js";

/**
 * Simulerer en fjær mellom to objekter:
 * Basert på: https://stackoverflow.com/questions/46671809/how-to-make-a-spring-constraint-with-bullet-physics
 */
export const myPointToPoint = {
	myPhysicsWorld: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true) {

		let mass1 = 0;
		let mass2 = 20;
		let pos1 = {x: 10, y: 20, z: 0};
		let pos2 = {x: 10, y: 10, z: 0};
		let scale = {x: 2, y: 2, z: 2};

		// Three:
		let springCubeMesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		springCubeMesh1.position.set(pos1.x, pos1.y, pos1.z);
		springCubeMesh1.scale.set(scale.x, scale.y, scale.z);
		let springCubeMesh2 = springCubeMesh1.clone();
		springCubeMesh2.position.set(pos2.x, pos2.y, pos2.z);

		// Ammo: samme shape brukes av begge RBs:
		let boxShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );

		let rbBox1 = this.createRB(boxShape, mass1, pos1);
		let rbBox2 = this.createRB(boxShape, mass2, pos2);

		//Pivotpunkt: rbBox2 "koples til" nedre, venstre, ytre hjørne av rbBox1
		let box1Pivot = new Ammo.btVector3( -scale.x/2, - scale.y/2, scale.z/2 );   //nedre, venstre, ytre
		let box2Pivot = new Ammo.btVector3( - scale.x/2, 1, 1 );

		let p2pConstraint = new Ammo.btPoint2PointConstraint( rbBox1, rbBox2, box1Pivot, box2Pivot);
		this.myPhysicsWorld.ammoPhysicsWorld.addConstraint( p2pConstraint, false );

		// Legger til physics world:
		this.myPhysicsWorld.addPhysicsObject(rbBox1, springCubeMesh1);
		this.myPhysicsWorld.addPhysicsObject(rbBox2, springCubeMesh2);
	},

	createRB(shape,  mass, position) {
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin( new Ammo.btVector3( position.x, position.y, position.z ) );
		let motionState = new Ammo.btDefaultMotionState( transform );
		let localInertia = new Ammo.btVector3( 0, 0, 0 );
		shape.calculateLocalInertia( mass, localInertia );
		let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
		let rbBox = new Ammo.btRigidBody(rbInfo);
		rbBox.setRestitution(0.4);
		rbBox.setFriction(0.6);
		return rbBox;
	}
}
