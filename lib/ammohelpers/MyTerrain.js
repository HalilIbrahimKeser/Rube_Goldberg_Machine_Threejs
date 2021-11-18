// ********************************************************************** //
// SE BULLET DOCS: https://pybullet.org/Bullet/BulletFull/annotated.html *** //
//
// SE OGSÅ: https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
//      OG: https://github.com/kripken/ammo.js/
//      OG HER; http://lo-th.github.io/Ammo.lab/
//      OG: https://github.com/BlueMagnificent/baller
//   QUATERNIONS: https://medium.com/@joshmarinacci/quaternions-are-spooky-3a228444956d
//
//   TERRAIN DEMO: https://github.com/kripken/ammo.js/blob/master/examples/webgl_demo_terrain/index.html
//
// ********************************************************************** //
import * as THREE from "../three/build/three.module.js";
import {getHeightData} from "../wfa-utils.js";
const TERRAIN_SIZE = 400;

export const myTerrain = {
	myPhysicsWorld: undefined,
	setCollisionMask: undefined,
	ammoHeightData: undefined,
	terrainWidthExtents: TERRAIN_SIZE*2,
	terrainDepthExtents: TERRAIN_SIZE*2,
	terrainMaxHeight: 0,    // Dennes settes basert på innleste høydedata (se createTerrainAmmoShape).
	terrainMinHeight: 0,    // Dennes settes basert på innleste høydedata (se createTerrainAmmoShape).
	terrainWidth: 128,      // NB! Denne må matche størrelse på innlest høydedatafil.
	terrainDepth: 128,      // NB! Denne må matche størrelse på innlest høydedatafil (er i dette eksemplet 128x128 piksler).

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true) {
		this.setCollisionMask = setCollisionMask;
		this.addTerrain();
	},

	addTerrain() {
		getHeightData('../assets/images/heightmap2.png', 128, 128, this.terrainHeightLoaded.bind(this));
	},

	terrainHeightLoaded(heightData) {
		let textureLoader = new THREE.TextureLoader();
		textureLoader.load( "../assets/images/tile2.png", ( texture ) => {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( this.terrainWidth - 1, this.terrainDepth - 1 );

			// Ammo: Lager og returnerer en btHeightfieldTerrainShape:
			let groundShape = this.createTerrainAmmoShape(heightData, this.terrainWidth, this.terrainDepth);
			let groundTransform = new Ammo.btTransform();
			groundTransform.setIdentity();
			groundTransform.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );
			let groundMass = 0;
			let groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
			groundShape.calculateLocalInertia( groundMass, groundLocalInertia );
			let groundMotionState = new Ammo.btDefaultMotionState( groundTransform );

			let rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, groundMotionState, groundShape, groundLocalInertia );
			let rbTerrain = new Ammo.btRigidBody(rbInfo);
			rbTerrain.setRestitution(0.5); //Sprett!
			rbTerrain.setFriction(0.3);

			// Three:
			// scaleX / scaleY henger sammen med heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );
			// i createTerrainAmmoShape()
			let scaleX = this.terrainWidthExtents / ( this.terrainWidth - 1 );    //2 * 400 / (128-1) = 6
			let scaleZ = this.terrainDepthExtents / ( this.terrainDepth - 1 );    //2 * 400 / (128-1) = 6
			// Størrelse på PlaneGeometry: with = height = 128 * 6 = 768
			// Denne inndeles så i 127 * 127 småruter.
			let terrainGeometry = new THREE.PlaneGeometry( this.terrainWidth*scaleX, this.terrainDepth*scaleZ, this.terrainWidth - 1, this.terrainDepth - 1 );
			terrainGeometry.rotateX( - Math.PI / 2 );
			let vertices = terrainGeometry.attributes.position.array;
			// Ammo-shapen blir (automatisk) sentrert om origo basert på this.terrainMinHeight og this.terrainMaxHeight.
			// Må derfor korrigere THREE-planets y-verdier i forhold til dette.
			// Flytter dermed three-planet NED, tilsvarende minHeigt + (maxHeight - minHeight)/2.
			let delta = (this.terrainMinHeight + ((this.terrainMaxHeight-this.terrainMinHeight)/2));
			for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
				// j + 1 because it is the y component that we modify
				vertices[ j + 1 ] = heightData[ i ] - delta;
			}
			// Oppdater normaler:
			terrainGeometry.computeVertexNormals();

			let groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7, side: THREE.DoubleSide } );
			groundMaterial.map = texture;
			groundMaterial.needsUpdate = true;

			let terrainMesh = new THREE.Mesh( terrainGeometry, groundMaterial );
			terrainMesh.userData.tag = 'terrain';
			terrainMesh.receiveShadow = true;

			// Legger til physics world:
			this.myPhysicsWorld.addPhysicsObject(
				rbTerrain,
				terrainMesh,
				this.setCollisionMask,
				this.myPhysicsWorld.COLLISION_GROUP_PLANE,
				this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
					this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
					this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
					this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
					this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE
			);

		} );
	},

	// FRA: http://kripken.github.io/ammo.js/examples/webgl_demo_terrain/index.html
	// Lager en Ammo.btHeightfieldTerrainShape vha. minnebufret ammoHeightData.
	// ammoHeightData FYLLES vha. heightData OG this.terrainWidth, this.terrainDepth - parametrene.
	// Gjøres vha. brukes Ammo._malloc og Ammo.HEAPF32[].
	createTerrainAmmoShape(heightData, terrainWidth, terrainDepth) {

		// This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
		let heightScale = 1;

		// Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
		let upAxis = 1;

		// hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
		let hdt = "PHY_FLOAT";

		// Set this to your needs (inverts the triangles)
		let flipQuadEdges = false;

		// Creates height data buffer in Ammo heap
		this.ammoHeightData = Ammo._malloc( 4 * this.terrainWidth * this.terrainDepth );

		// NB! Viktig å finne og sette this.terrainMaxHeight og this.terrainMinHeight:
		let p = 0;
		let p2 = 0;
		this.terrainMaxHeight = -100000;     //NB! setter til en lav (nok) verdi for å være sikker.
		this.terrainMinHeight = 100000;      //NB! setter til en høy (nok) verdi for å være sikker.
		// Copy the javascript height data array to the Ammo one.
		for ( let j = 0; j < this.terrainDepth; j ++ ) {
			for ( let i = 0; i < this.terrainWidth; i ++ ) {
				if (heightData[p] < this.terrainMinHeight)
					this.terrainMinHeight = heightData[p];
				if (heightData[p] >= this.terrainMaxHeight)
					this.terrainMaxHeight = heightData[p];
				// write 32-bit float data to memory  (Se: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
				Ammo.HEAPF32[this.ammoHeightData + p2 >> 2] = heightData[ p ];   // >>  Signed right shift. Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off.
				p ++;
				// 4 bytes/float
				p2 += 4;
			}
		}
		// Creates the heightfield physics shape
		let heightFieldShape = new Ammo.btHeightfieldTerrainShape(
			this.terrainWidth,
			this.terrainDepth,
			this.ammoHeightData,
			heightScale,
			this.terrainMinHeight,
			this.terrainMaxHeight,
			upAxis,
			hdt,
			flipQuadEdges
		);

		// Set horizontal scale
		let scaleX = this.terrainWidthExtents / ( this.terrainWidth - 1 );
		let scaleZ = this.terrainDepthExtents / ( this.terrainDepth - 1 );
		heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );
		heightFieldShape.setMargin( 0.0 );
		return heightFieldShape;
	},

}
