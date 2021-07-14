import { OrbitControls } from '../../../../build/three/controls/OrbitControls.js';

function createControl(_camera, _renderer){

  const controls = new OrbitControls(_camera, _renderer.domElement);
  // controls.maxPolarAngle = Math.PI * 0.5;
  // controls.minDistance = 1;
  // controls.maxDistance = 100;

  return controls;
}

export { createControl };