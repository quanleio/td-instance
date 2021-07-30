
import { PerspectiveCamera, CameraHelper } from 'https://unpkg.com/three@0.130.0/build/three.module.js';

function createCamera() {

  // const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100);
  // camera.position.z = 30;
  // const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  // camera.position.z = 5;

  const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( - 1, 0, 90 );

  const helper = new CameraHelper( camera );
  camera.add(helper)

  return camera;
}

export { createCamera };
