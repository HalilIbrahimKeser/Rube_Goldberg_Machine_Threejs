import * as THREE from "../lib/three/build/three.module.js";
import {commons} from "../lib/ammohelpers/lib/Common.js";
import {TWEEN} from "../lib/three/examples/jsm/libs/tween.module.min.js";

export const tweenElevator = {
    myPhysicsWorld: undefined,
    scene: undefined,

    init(scene) { // må endres til ammophysicsworld
        this.scene = scene;
    },

    create(setCollisionMask = true, mass = 0, texture = false, color = 0xF4F0EF, position = {
        x: -360,
        y: -75,
        z: -8
    }, radius = 0.2, length = 350, width = 150) {
        if (texture) { //Hvis tekstur er ønsket
            const loadManager = new THREE.LoadingManager();
            const loader = new THREE.TextureLoader(loadManager);
            this.material = new THREE.MeshPhongMaterial({map: loader.load(url)});
        } else {
            this.material = new THREE.MeshPhongMaterial({color: color});
        }

        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = "rudegoldberg";
        groupMesh.userData.name = "tweenelevator"
        groupMesh.position.z = -500;
        this.scene.add(groupMesh);

        //let elevator = new THREE.Mesh(this.createHoledCylinderShape(), this.material);

        // https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md
        tween = new TWEEN.Tween({y: 0, x: 0})
            .to({y: 180, x: 200}, 5000)
            .easing(TWEEN.Easing.Bounce.InOut)
            .yoyo(true)
            .repeat(Infinity)
            .onUpdate(this.animateModel);

        tween.start();

        this.animate();
    },

    animateModel(position) {
        // Bruk y'en til noe...:
        let heis = scene.getObjectByName('tweenelevator', true);
        if (heis) {
            heis.position.set(position.x, position.y, 0);
        }
    },


    //
    // animate(currentTime) {
    //     requestAnimationFrame(animate);
    //     //Oppdaterer tween:
    //     TWEEN.update(currentTime);
    //
    //     renderer.render(scene, camera);
    // }


}