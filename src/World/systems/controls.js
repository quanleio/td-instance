/**
 * Create OrbitControls
 * @param _camera
 * @param _renderer
 * @returns {*}
 */
function createControl(_camera, _renderer) {
  const controls = new THREE.OrbitControls(_camera, _renderer.domElement);
  // controls.maxPolarAngle = Math.PI * 0.5;
  // controls.minDistance = 1;
  // controls.maxDistance = 120 ;

  return controls;
}

export { createControl };
