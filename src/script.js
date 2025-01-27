import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import coffeeSmokeVertexShader from "./shaders/coffeesmoke/vertex.glsl";
import coffeeSmokeFragmentShader from "./shaders/coffeesmoke/fragment.glsl";
import textSmokeVertexShader from "./shaders/textSmoke/vertex.glsl";
import textSmokeFragmentShader from "./shaders/textSmoke/fragment.glsl";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as TWEEN from "@tweenjs/tween.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2;
camera.position.y = 4;
camera.position.z = 6;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Model
 */
gltfLoader.load("./bakedModel.glb", (gltf) => {
  gltf.scene.getObjectByName("baked").material.map.anisotropy = 8;
  scene.add(gltf.scene);
});

/**
 * Smoke
 */

//Geometry
const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
smokeGeometry.translate(0, 0.5, 0);
smokeGeometry.scale(1.5, 6, 1.5);

// Perlin texture
const perlinTexture = textureLoader.load("./perlin.png");
perlinTexture.wrapS = THREE.RepeatWrapping;
perlinTexture.wrapT = THREE.RepeatWrapping;

//Material
const smokeMaterial = new THREE.ShaderMaterial({
  vertexShader: coffeeSmokeVertexShader,
  fragmentShader: coffeeSmokeFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uPerlinTexture: new THREE.Uniform(perlinTexture),
  },
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  // wireframe: true
});
const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
smoke.position.y = 1.83;
scene.add(smoke);

/**
 * Fonts
 */
// tsmokeMaterial
const tsmokeMaterial = new THREE.ShaderMaterial({
  vertexShader: textSmokeVertexShader,
  fragmentShader: textSmokeFragmentShader,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uPerlinTexture: new THREE.Uniform(perlinTexture),
  },
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  // wireframe: true
});
const fontLoader = new FontLoader();

// song lyrics
const lyricsWithTimings = [
  { text: "Wherever you go, that's where I'll follow", time: 0 },
  { text: "Nobody's promised tomorrow", time: 4 },
  { text: "So I'ma love you every night like it's the last night", time: 9 },
  { text: "Like it's the last night", time: 12 },
  { text: "If the world was ending, I'd wanna be next to you", time: 15 },
  { text: "If the party was over and our time on Earth was through", time: 24 },
  {
    text: "I'd wanna hold you just for a while and die with a smile",
    time: 33,
  },
  { text: "If the world was ending, I'd wanna be next to you", time: 42.5 },
];

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("", {
    font: font,
    size: 0.2,
    height: 0.02,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();
  var text = new THREE.Mesh(textGeometry, tsmokeMaterial);
  text.position.y = 3.0;
  text.material.opacity = 3;
  scene.add(text);

  // جدولة النصوص
  lyricsWithTimings.forEach(({ text: line, time }) => {
    setTimeout(() => {
      // تحديث النص
      const newTextGeometry = new TextGeometry(line, {
        font: font,
        size: 0.2,
        height: 0.02,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      newTextGeometry.center();
      text.geometry.dispose();
      text.geometry = newTextGeometry;
    }, time * 1000);
  });
});

// /**
//  * Animate
//  */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update smoke
  smokeMaterial.uniforms.uTime.value = elapsedTime;
  tsmokeMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
