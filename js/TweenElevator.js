import * as THREE from "../lib/three/build/three.module.js";
import {TWEEN} from "../lib/three/examples/jsm/libs/tween.module.min.js";
import {GLTFLoader} from '../lib/three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from '../lib/three/examples/jsm/utils/SkeletonUtils.js';
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import {animateOnMain} from "./RudeGoldbergMachine.js";
import {myArbitraryTriangleMesh2} from "../lib/ammohelpers/MyArbitraryTriangleMesh2.js";

// Tween er implementert i TweenElevator.js, kode hentet fra Tween1.js

export const tweenElevator = {
    myPhysicsWorld: undefined,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true,
           position={x:200, y:410, z:-485},
           color=Math.random() * 0xffffff,
           mass= 0,
           radius= 50,
           holeRadiusPercent = 0.6,
           depth = 160,
           tiltX = 0,
           tiltY = Math.PI/2,
           tiltZ = 0,
           restitution = 0.5) {
        this.addTween();
    },

    addTween() {
        // https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
        this.tween = new TWEEN.Tween({y: 220, x: 450})
            .to({y: 175, x: 450}, 200000)
            .easing(TWEEN.Easing.Bounce.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .onUpdate(this.animateModel);

        this.loadModels();
    },

    //Brukes av tween:
    animateModel(position) {
        //this.position = {x: -360, y: -75, z: -8};
        // Bruk y'en til noe...:
        let lumaModel = myThreeScene.scene.getObjectByName('LumaModel', true);
        if (lumaModel) {
            lumaModel.position.set(position.x, position.y, 0);
        }
    },

    loadModels() {
        // Progressbar:
        const progressbarElem = document.querySelector('#progressbar');
        const manager = new THREE.LoadingManager();
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        }
        manager.onLoad = () => {
            this.initModels();
        }
        // this.initModels();

        this.models = {
            luma: {
                url: '../assets/models/luma/scene.gltf',
                scale: {x: 100, y: 100, z: 100},
                position: {x: 100, y: 300, z: 0}
            },
        };

        const gltfLoader = new GLTFLoader(manager);
        for (const model of Object.values(this.models)) {
            gltfLoader.load(model.url, (gltf) => {
                model.gltf = gltf;
            });
        }

        this.tween.start();

        this.animate();
        //animateOnMain();
    },

    initModels() {
        // hide the loading bar
        // const loadingElem = document.querySelector('#loading');
        // loadingElem.style.display = 'none';

        Object.values(this.models).forEach((model, ndx) => {
            model.gltf.scene.traverse(function (child) {
                if (child.type === "SkinnedMesh") {
                    console.log(child);
                }
            });

            const clonedScene = SkeletonUtils.clone(model.gltf.scene);
            const root = new THREE.Object3D();
            root.name = 'LumaModel';
            root.userData.tag = "rudegoldberg";
            root.userData.name = "tweenelevator";

            //Skalerer og posisjonerer:
            root.scale.set(model.scale.x, model.scale.y, model.scale.z);
            root.position.set(model.position.x, model.position.y, model.position.z);
            root.add(clonedScene);

            let gltfModelMass = 150;
            let gltfModelStartPos = new THREE.Vector3(-20, 120, 30);
            // myArbitraryTriangleMesh2 er basert på vilkårlig MESH-objekt. Bruker Ammo convex.
            myArbitraryTriangleMesh2.init(this.myPhysicsWorld);
            myArbitraryTriangleMesh2.create(true, root, gltfModelMass, gltfModelStartPos);

            myThreeScene.scene.add(root);
        });
    },

    animate(currentTime) {
        animateOnMain(currentTime)
    }
}