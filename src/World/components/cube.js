import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  Mesh,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // Switch the old "basic" material to
  // a physically correct "standard" material
  const material = new MeshStandardMaterial({ color: "red" });

  const cube = new Mesh(geometry, material);
  cube.name = 'Cube';
  cube.position.set(0, 10, 0);
  cube.rotation.set(-0.5, -0.1, -0.5);

  return cube;
}

export { createCube };
