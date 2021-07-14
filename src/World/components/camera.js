
import { PerspectiveCamera } from 'https://unpkg.com/three@0.130.0/build/three.module.js';

function createCamera() {

  const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.z = 30;

  return camera;
}

export { createCamera };