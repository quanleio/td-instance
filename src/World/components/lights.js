
// import { HemisphereLight, DirectionalLight, Vector2 } from 'https://unpkg.com/three@0.130.0/build/three.module.js';

function createHemiLight() {

  // return new HemisphereLight( 0x444444 );
  const light = new THREE.HemisphereLight();
  light.intensity = 0.35;

  return light;
}

function createDirLight() {

  /*const light = new DirectionalLight(0xffffff, 2.5);
  light.position.set(1, 0.4, 0.2);
  light.castShadow = false;
  light.shadow.mapSize = new Vector2(512, 512);*/

  const light = new THREE.DirectionalLight();
  light.position.set( 5, 5, 5 );
  light.castShadow = true;
  light.shadow.camera.zoom = 2;

  return light;
}

export { createHemiLight, createDirLight };
