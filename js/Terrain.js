import * as THREE from "../lib/three/build/three.module.js";
import { addTerrainFromTerrainClass } from "./RudeGoldbergMachine.js";
import {loadTerrain} from "../lib/wfa-utils";

//ALLE TERRAIN FUNKSJONER FLYTTES HIT



//Terreng:
let meshTerrain;

let SIZE = 1000;

// Holder på alle lastede teksturer:
let loadedTextures = {};


//Denne kjøres når høydedata er ferdiga lastet og generert.
//heightData = et array bestående av 16 bits heltall.
export function terrainLoaded(heightData) {
    // Legger til et terreng-mesh:
    addTerrain();

    // Setter z-posisjonen til terrengmeshets vertekser i henhold til verdiene i heightData.
    const vertexPositions = meshTerrain.geometry.attributes.position.array;    //NB! MERK .array
    let index = 0;
    // Gjennomløper alle vertekser (hver verteks består av tre verdier; x,y,z)
    // til meshet, endrer z-verdien:
    for (let i = 0; i < meshTerrain.geometry.attributes.position.count; i++)
    {
        index++;    // øker med 1 for å "gå forbi" x.
        index++;    // øker med 1 for å "gå forbi" y.
        //Endrer z-verdien, øker index med for å gå til neste verteks sin x.
        vertexPositions[ index++] = heightData[i] / 30000 * 70;
    }
    meshTerrain.geometry.computeVertexNormals();      // NB! Viktig for korrekt belysning.

    // Alt på plass - fortsetter!


    // animate();
}
function addTerrain() {
    //Gir 199 x 199 ruter (hver bestående av to trekanter). Texturen er 200x200 piksler.
    let gPlane = new THREE.PlaneGeometry(SIZE * 2, SIZE * 2, 199, 199);
    let mPlane = new THREE.MeshPhongMaterial({
        //color: 0x91aff11,
        map: loadedTextures['jotunheimen-texture']
    });
    // Bruker IKKE tiling her, teksturen dekker hele planet.
    meshTerrain = new THREE.Mesh( gPlane, mPlane);
    meshTerrain.rotation.x = -Math.PI / 2;
    meshTerrain.receiveShadow = true;	//NB!
    meshTerrain.position.y = -150

    addTerrainFromTerrainClass(meshTerrain)
    // scene.add(meshTerrain);

}

function loadTextures() {
    let texturesToLoad = [
        {name: 'jotunheimen-texture', url: '../assets/images/jotunheimen-texture.png'},
        {name: 'bird1', url: '../assets/images/bird1.png'},
        {name: 'metal1', url: '../assets/images/metal1.jpg'},
        {name: 'chocchip', url: '../assets/images/chocchip.png'},
    ];
    const loader = new THREE.TextureLoader();
    for ( let image of texturesToLoad ) {
        // Laster bilde for bilde vha. TextureLoader:
        loader.load(
            image.url,
            (texture) => {
                // Legger lastet tekstur i loadedTexures:
                loadedTextures[image.name] = texture;
                // Fjerner et og et element fra texturesToLoad:
                texturesToLoad.splice(texturesToLoad.indexOf(image), 1);
                // Når texturesToLoad er tomt er vi ferdig med lasting av teksturer:
                if (!texturesToLoad.length) {
                    //Alle teksturer er nå lastet... FORTSETTER:
                    // Høydeverdiene ligger i en .bin fil (200x200 = 40000 verdier).
                    loadTerrain("../assets/jotunheimen.bin", terrainLoaded); 	// lib/wfa-utils.js
                }
            },
            undefined,
            function (err) {
                console.error('Feil ved lasting av teksturfiler...');
            });
    }
}

export function addTerrainFromTerrainClass(meshTerrain) {
    scene.add(meshTerrain);
}

