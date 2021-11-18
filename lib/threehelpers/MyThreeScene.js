import * as THREE from "../three/build/three.module.js";
import { TrackballControls } from '../three/examples/jsm/controls/TrackballControls.js';
import { addCoordSystem} from "../wfa-coord.js";

/**
 * Brukes til å opprette en standard Three-scene.
 * Hånterer window resize.
 * Bruker TrackballControls.
 *
 */
export const myThreeScene = {
	scene: undefined,
	camera: undefined,
	renderer: undefined,
	controls: undefined,

	setupGraphics()
	{
		window.addEventListener('resize', this.onWindowResize.bind(this), false);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xffffff);

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 5000);
		this.camera.position.set(35, 50, 70);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		let dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
		dirLight1.color.setHSL(0.1, 1, 0.95);
		dirLight1.position.set(-0.1, 1.75, 0.1);
		dirLight1.position.multiplyScalar(100);

		dirLight1.castShadow = true;
		let dLight = 500;
		let sLight = dLight;
		dirLight1.shadow.camera.left = -sLight;
		dirLight1.shadow.camera.right = sLight;
		dirLight1.shadow.camera.top = sLight;
		dirLight1.shadow.camera.bottom = -sLight;
		dirLight1.shadow.camera.near = dLight / 30;
		dirLight1.shadow.camera.far = dLight;
		dirLight1.shadow.mapSize.x = 1024 * 2;
		dirLight1.shadow.mapSize.y = 1024 * 2;
		this.scene.add(dirLight1);

		let dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
		dirLight2.position.set(0.1, 0.1, 10);
		dirLight2.castShadow = true;
		this.scene.add(dirLight2);

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setClearColor(0xbfd1e5);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.renderer.shadowMap.enabled = true;

		addCoordSystem(this.scene);

		this.controls = new TrackballControls(this.camera, this.renderer.domElement);
		this.controls.addEventListener('change', this.render.bind(this), false);
	},

	updateGraphics() {
		this.render();
		if (this.controls)
			this.controls.update();
	},

	render() {
		this.renderer.render(this.scene, this.camera);
	},

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.controls.handleResize();
		this.updateGraphics();
	},
}
