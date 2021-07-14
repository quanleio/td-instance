
import { HemisphereLight, DirectionalLight, Vector2 } from 'https://unpkg.com/three@0.130.0/build/three.module.js';

function createHemiLight() {

  return new HemisphereLight( 0xffffff, 0x000000, 1 );
}

function createDirLight() {
  const dirLight = new DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(-0.5, 0.5, 0.866);
  dirLight.castShadow = false;
  dirLight.shadow.mapSize = new Vector2(512, 512);

  return dirLight;
}

export { createHemiLight, createDirLight };