import {
  BoxBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  MathUtils,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function createCube() {
  const geometry = new BoxBufferGeometry(2, 2, 2);
  const material = new MeshStandardMaterial({ color: "red" });
  const cube = new Mesh(geometry, material);
  cube.name = 'Cube';
  cube.position.set(0, 10, 0);
  cube.rotation.set(-0.5, -0.1, -0.5);

  const radiansPerSecond = MathUtils.degToRad(30);

  // this method will be called once per frame
  cube.tick = (delta) => {
    // increase the cube's rotation each frame
    cube.rotation.z += radiansPerSecond * delta;
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
  }

  return cube;
}

export { createCube };
