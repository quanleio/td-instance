/**
 * Create Scene
 * @returns {*}
 */
function createScene() {
  const scene = new THREE.Scene();
  const backgroundColor = new THREE.Color(0xeceddc).convertSRGBToLinear();
  // scene.background = backgroundColor;
  // scene.fog = new FogExp2(backgroundColor, 0.05);

  return scene;
}

export { createScene };
