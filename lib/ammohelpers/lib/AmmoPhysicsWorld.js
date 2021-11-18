/**
 *
 * @type {{init(*=, *=): void, COLLISION_GROUP_COMPOUND: number, ammoPhysicsWorld: undefined, COLLISION_GROUP_BOX: number, catchCollisionEvents: boolean, COLLISION_GROUP_PLANE: number, addPhysicsObject(*=, *=, *=, *=, *=): void, scene: undefined, COLLISION_GROUP_TRIANGLE: number, checkCollisions(*): void, tmpTrans: undefined, COLLISION_GROUP_HINGE_SPHERE: number, checkSphereBumperCollision(*, *, *, *): void, updatePhysics(*=): void, COLLISION_GROUP_SPHERE: number, COLLISION_GROUP_MOVEABLE: number, rigidBodies: *[], COLLISION_GROUP_CONVEX: number}}
 */
export const ammoPhysicsWorld = {
	ammoPhysicsWorld: undefined,
	scene: undefined,
	catchCollisionEvents: false,
	rigidBodies: [],
	COLLISION_GROUP_PLANE:1,
	COLLISION_GROUP_SPHERE:2,
	COLLISION_GROUP_CONVEX:4,
	COLLISION_GROUP_COMPOUND:8,
	COLLISION_GROUP_MOVEABLE:16,
	COLLISION_GROUP_TRIANGLE:32,
	COLLISION_GROUP_HINGE_SPHERE: 64,
	COLLISION_GROUP_BOX: 128,       //..osv. legg til etter behov.
	tmpTrans: undefined,            // Hjelpeobjekt.

	init(scene, catchCollisionEvents=false) {
		if (!scene) {
			console.log("Mangler three-sceneobjekt.")
			return;
		}
		this.scene = scene;
		this.catchCollisionEvents = catchCollisionEvents;
		this.tmpTrans = new Ammo.btTransform();

		let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
			dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
			overlappingPairCache = new Ammo.btDbvtBroadphase(),
			solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.ammoPhysicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.ammoPhysicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));
	},

	// Bruker kollisjonsmaske kun dersom begge parametre er satt:
	addPhysicsObject(rb, mesh, setCollisionMask, collisionGroup, collisionMask) {
		if (setCollisionMask){
			this.ammoPhysicsWorld.addRigidBody(rb, collisionGroup, collisionMask);
		} else {
			this.ammoPhysicsWorld.addRigidBody(rb);
		}
		mesh.userData.physicsBody = rb;
		this.scene.add(mesh);
		this.rigidBodies.push(mesh);
		//NB! Brukes til collision events:
		rb.threeMesh = mesh;
	},

	updatePhysics(deltaTime) {
		if (!this.tmpTrans)
			return;

		// Step physics world:
		this.ammoPhysicsWorld.stepSimulation(deltaTime, 10);

		// Update rigid bodies
		for (let i = 0; i < this.rigidBodies.length; i++) {
			let objThree = this.rigidBodies[i];
			let objAmmo = objThree.userData.physicsBody;
			let ms = objAmmo.getMotionState();
			if (ms) {
				ms.getWorldTransform(this.tmpTrans);
				let p = this.tmpTrans.getOrigin();
				let q = this.tmpTrans.getRotation();
				objThree.position.set(p.x(), p.y(), p.z());
				objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
			}
		}

		if (this.catchCollisionEvents)
			this.checkCollisions(deltaTime);
	},

	/**
	 * Finner alle manifolds/kollisjonspunkter. Gjennomløper disse.
	 * Henter ut Rigid Body (RB) fra hver manifold-punkt. Hvert manifold-punkt inneholder to RBs.
	 * Dersom kollison mellom RB-objektene (distance <= 0) endres
	 * fargen på tilhørende threeMesh-objekt.
	 * @param deltaTime
	 */
	checkCollisions(deltaTime) {
		// Finner antall btPersistentManifold-objekter :
		let numManifolds = this.ammoPhysicsWorld.getDispatcher().getNumManifolds();
		// Gjennomløper alle btPersistentManifold:
		for (let i=0; i < numManifolds;i++) {
			// contactManifold er et btPersistentManifold-objekt:
			let contactManifold =  this.ammoPhysicsWorld.getDispatcher().getManifoldByIndexInternal(i);
			let numContacts = contactManifold.getNumContacts();
			if (numContacts>0) {
				// Henter objektene som er involvert:
				// getBody0() og getBody1() returnerer et btCollisionObject,
				// gjøres derfor om til btRigidBody-objekter vha. Ammo.castObject():
				let rbObject0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
				let rbObject1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);
				let threeMesh0 = rbObject0.threeMesh;
				let threeMesh1 = rbObject1.threeMesh;
				if (threeMesh0 && threeMesh1) {
					for (let j = 0; j < numContacts; j++) {
						let pt = contactManifold.getContactPoint(j);
						if (pt.getDistance() <= 0) {
							//Merk: tag må være satt ved opprettelese av mesh-objektet.
							if ((threeMesh0.userData.tag === 'sphere' || threeMesh0.userData.tag === 'movalbe') &&
								(threeMesh1.userData.tag === 'sphere' || threeMesh1.userData.tag === 'movalbe') ) {
								//Endrer farge på begge kulene dersom kollisjon mellom kuler:
								//Merk: collisionResponse(..) - funksjonen må knyttes til mesh-objektet ved opprettelese av mesh-objektet.
								if (typeof threeMesh0.collisionResponse === 'function')
									threeMesh0.collisionResponse(threeMesh0);

								if (typeof threeMesh1.collisionResponse === 'function')
									threeMesh1.collisionResponse(threeMesh1);
							}
						}
					}
				}
			}
		}
	},
}
