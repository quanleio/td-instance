/**
 * Create WebGLRenderer
 * @returns {*}
 */
function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  // set the pixel ratio (for mobile devices)
  // renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add the Canvas to body
  document.body.appendChild(renderer.domElement);

  return renderer;
}

export { createRenderer };
