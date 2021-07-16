
import { PerspectiveCamera } from 'https://unpkg.com/three@0.130.0/build/three.module.js';

function createCamera() {

  // const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
  // camera.position.z = 30;
  // const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // camera.position.z = 5;

  const camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set( - 1, 1.5, 2 );
  camera.lookAt( 0, 0.5, 0 );

  return camera;
}

export { createCamera };