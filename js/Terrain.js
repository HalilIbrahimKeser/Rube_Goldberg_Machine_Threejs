// import * as THREE from "../lib/three/build/three.module.js";
// import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
// // import { getHeightData } from "../lib/wfa-utils.js";
// //import {updateBooleanisTerrainHeightLoaded} from "./RudeGoldbergMachine.js";
//
//
//
// let meshTerrain;
// let loadedTextures = {};
// let SIZE = 500;
// let heightAdjustment = 0; //min/max z-verdi på heightmap
//
// let myPhysicsWorld = undefined;
// let _width = 128;
// let _height = 128;
// let heightData = new Float32Array(_width * _height);
//
// export function addTerrain() {
//     let planeNoTiles = 128-1; //heightmap.png har størrelse = 128 x 128 piksler.
//     let gPlane = new THREE.PlaneGeometry( SIZE*2, SIZE*2, planeNoTiles, planeNoTiles );
//     gPlane.computeVertexNormals();
//
//     // Texture tiling (f.eks. 20 x 20 rutenett med gjenbruk av tekstur):
//     // NB! Texture tiling er uavhengig av plan-rutenettet:
//     let textureLoader = new THREE.TextureLoader();
//     textureLoader.load( "./assets/images/grass_tile.png", function( textureMap ) {
//         textureMap.wrapS = THREE.RepeatWrapping;
//         textureMap.wrapT = THREE.RepeatWrapping;
//         textureMap.repeat.x = 20;
//         textureMap.repeat.y = 20;
//
//         let mPlane = new THREE.MeshLambertMaterial(
//             {
//                 color: '#21471e',
//                 side: THREE.DoubleSide,
//                 map: textureMap,
//                 wireframe: false,
//             });
//         meshTerrain = new THREE.Mesh( gPlane, mPlane);
//         meshTerrain.rotation.x = -Math.PI / 2;
//         meshTerrain.receiveShadow = true;	//NB!
//         meshTerrain.position.y = -20 ;
//         // meshTerrain.terrainWidthExtents = SIZE * 2;
//         // meshTerrain.terrainDepthExtents = SIZE * 2;
//         // meshTerrain.terradepth = 128;
//         // meshTerrain.terrainWidth = 128;
//         myThreeScene.scene.add(meshTerrain);
//
//         //Laster fil med høydedata for planet (/lib/wfa-utils.js):
//         getHeightData('./assets/images/heightmap3.png', _width, _height, terrainHeightLoaded);
//     });
// }
//
// //fra wfa utils
// function getHeightData(fileName, _width, _height, callback) {
//     let canvas = document.createElement('canvas');
//     canvas.width = _width;
//     canvas.height = _height;
//     let context = canvas.getContext('2d');
//     let size = _width * _height;
//
//     let img = new Image();	//NB! Image-objekt.
//     img.onload = function () {
//         //Ferdig nedlastet:
//         context.drawImage(img, 0, 0);
//
//         for (let i = 0; i < size; i++) {
//             heightData[i] = 0;
//         }
//         //imgd = et ImageData-objekt. Inneholder pikseldata. Hver piksel består av en RGBA-verdi (=4x8 byte).
//         let imgd = context.getImageData(0, 0, _width, _height);
//         let pix = imgd.data;	//pix = et Uint8ClampedArray - array. 4 byte per piksel. Ligger etter hverandre.
//
//         let j = 0;
//         //Gjennomløper pix, piksel for piksel (i += 4). Setter heightData for hver piksel lik summen av fargen / 3 (f.eks.):
//         for (let i = 0, n = pix.length; i < n; i += 4) {
//             let all = pix[i] + pix[i + 1] + pix[i + 2];
//             heightData[j++] = all / 3;
//         }
//         callback(heightData);
//     };
//     //Starter nedlasting:
//     img.src = fileName;
// }
//
// //Denne kjøres når høydedata er ferdiga lastet og generert.
// //heightData = et array bestående av 16 bits heltall.
// function terrainHeightLoaded(heightData) {
//     const vertexPositions = meshTerrain.geometry.attributes.position.array;    //NB! MERK .array
//     let index = 0;
//     let minZ=Number.POSITIVE_INFINITY;
//     let maxZ=0;
//     let height=0;
//     for (let i = 0; i < meshTerrain.geometry.attributes.position.count; i++)
//     {
//         index++;    // øker med 1 for å "gå forbi" x.
//         index++;    // øker med 1 for å "gå forbi" y.
//         height = heightData[i]; //verdiene kommer fra getHeightData() wfa-utils.js. Hele funksjonen er flyttet hit
//         vertexPositions[ index++] = height;
//         if (height>maxZ)
//             maxZ=height;
//         if (height<minZ)
//             minZ=height;
//     }
//     let heightDiff = maxZ-minZ;
//     heightAdjustment = -Math.abs(minZ) - (Math.abs(heightDiff)/2);
//
//     meshTerrain.geometry.computeVertexNormals();
//     meshTerrain.translateZ(heightAdjustment);
//
//     updateBooleanisTerrainHeightLoaded();
//
// }
//
