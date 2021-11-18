/**
 * Basert på: https://github.com/kripken/ammo.js/blob/master/examples/webgl_demo_terrain/index.html
 * SE BULLET DOCS: https://pybullet.org/Bullet/BulletFull/annotated.html
 * SE OGSÅ:
 *  https://medium.com/@bluemagnificent/intro-to-javascript-3d-physics-using-ammo-js-and-three-js-dd48df81f591
 *  https://github.com/kripken/ammo.js/
 *  http://lo-th.github.io/Ammo.lab/
 *  https://github.com/BlueMagnificent/baller
 */
import * as THREE from "../three/build/three.module.js";
import {commons} from "./lib/Common.js";

export const myTerrainHeightField = {
	myPhysicsWorld: undefined,
	setCollisionMask: undefined,
	ammoHeightData: undefined,
	terrainMaxHeight: 0,
	terrainMinHeight: 0,
	terrainWidth: 128,
	terrainDepth: 128,
	terrainWidthExtents:100,
	terrainDepthExtents:100,
	heightData: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	create(setCollisionMask=true) {
		this.setCollisionMask = setCollisionMask;
		const position = {x:0,y:0, z:0};
		const mass = 0;

		let textureLoader = new THREE.TextureLoader();
		textureLoader.load( "../assets/images/grid.png", ( texture ) => {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( this.terrainWidth - 1, this.terrainDepth - 1 );

			let groundMaterial = new THREE.MeshPhongMaterial( { color: 0xC7C7C7, side: THREE.DoubleSide, wireframe: false } );
			groundMaterial.map = texture;
			groundMaterial.needsUpdate = true;

			const minimumHoyde=-7;
			const maksimumHoyde=7;
			this.heightData = this.generateHeight(minimumHoyde, maksimumHoyde);
			const terrainWidthSegments = this.terrainWidth - 1;
			const terrainHeightSegmenst = this.terrainDepth -1;
			// MERK bruk av terrainWidth og terrainHeight:
			let geometry = new THREE.PlaneGeometry( this.terrainWidth, this.terrainDepth, terrainWidthSegments, terrainHeightSegmenst);
			geometry.rotateX( - Math.PI / 2 );
			let verticesValues = geometry.attributes.position.array;

			// MERK:
			// verticesValues inneholder 49152 verdier (16384 vertekser * 3).
			// heightData inneholder 16384 høydeverdier.
			for ( let i = 0; i<this.heightData.length; i++) {
				// 1 + (i*3) siden det er y-verdien som endres:
				verticesValues[ 1 + (i*3) ] = this.heightData[i];
			}
			geometry.computeVertexNormals();

			// Mesh:
			let terrainMesh = new THREE.Mesh( geometry, groundMaterial );
			terrainMesh.userData.tag = 'terrain';
			// Shape:
			let groundShape = this.createTerrainShape( this.heightData );
			// Rigid body:
			let rigidBody = commons.createAmmoRigidBody(groundShape, terrainMesh, 0.3, 0.4, position, mass);

			this.myPhysicsWorld.addPhysicsObject(
				rigidBody,
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
	generateHeight(minHeight, maxHeight ) {
		let minH=Number.POSITIVE_INFINITY;
		let maxH=0;
		const width = this.terrainWidth;    //128
		const depth = this.terrainDepth;    //128
		// Generates the height data (a sinus wave)
		let size = width * depth;
		let data = new Float32Array( size );
		let hRange = maxHeight - minHeight; // 5 - (-5)
		let w2 = width / 2;     //w2=64
		let d2 = depth / 2;     //d2=64
		let phaseMult = 12;
		let p = 0;
		for ( let j = 0; j < depth; j ++ ) {
			for ( let i = 0; i < width; i ++ ) {
				let radius = Math.sqrt(
					Math.pow( ( i - w2 ) / w2, 2.0 ) +
					Math.pow( ( j - d2 ) / d2, 2.0 ) );
				let height = ( Math.sin( radius * phaseMult ) + 1 ) * 0.5  * hRange + minHeight;
				data[ p ] = height;
				p++;
				//Finner høyeste og laveste høydeveri:
				if (height>maxH)
					maxH=height;
				if (height<=minH)
					minH=height;
			}
		}
		this.terrainMaxHeight = maxH;
		this.terrainMinHeight = minH;
		return data;
	},

	// FRA: http://kripken.github.io/ammo.js/examples/webgl_demo_terrain/index.html
	// Lager en Ammo.btHeightfieldTerrainShape vha. minnebufret ammoHeightData.
	// ammoHeightData FYLLES vha. heightData OG this.terrainWidth, this.terrainDepth - parametrene.
	// Gjøres vha. Ammo._malloc og Ammo.HEAPF32[].
	createTerrainShape() {
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
		// Copy the javascript height data array to the Ammo one.
		let p = 0;
		let p2 = 0;
		for ( let j = 0; j < this.terrainDepth; j ++ ) {
			for ( let i = 0; i < this.terrainWidth; i ++ ) {
				// write 32-bit float data to memory
				Ammo.HEAPF32[this.ammoHeightData + p2 >> 2] = this.heightData[ p ];
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
		heightFieldShape.setMargin( 0.05 );
		return heightFieldShape;
	},

}
