import { OrbitControls } from '../../../vendor2/OrbitControls.js';

function createControl(_camera, _renderer){

  const controls = new OrbitControls(_camera, _renderer.domElement);
  // controls.maxPolarAngle = Math.PI * 0.5;
  // controls.minDistance = 1;
  // controls.maxDistance = 120 ;

  return controls;
}

export { createControl };
