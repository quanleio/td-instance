import {
  TetrahedronBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  MathUtils, Color,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function createTetrahedron() {

  const geometry = new TetrahedronBufferGeometry(2, 0);
  const material = new MeshStandardMaterial({ color: new Color(0x006bff).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
  const tetrahedron = new Mesh(geometry, material);
  tetrahedron.position.set(-20, 0, 0);
  tetrahedron.rotation.set(-0.5, -0.1, -0.5);

  const radiansPerSecond = MathUtils.degToRad(30);

  // this method will be called once per frame
  tetrahedron.tick = (delta) => {
    let timestamp = new Date() * 0.0005; // test

    // increase the cube's rotation each frame
    tetrahedron.rotation.z += radiansPerSecond * delta;
    tetrahedron.rotation.x += radiansPerSecond * delta;
    tetrahedron.rotation.y += radiansPerSecond * delta;

    tetrahedron.position.x = Math.cos(timestamp * 2) * 9;
    tetrahedron.position.y = Math.sin(timestamp * 2) * 9;
  }

  return tetrahedron;
}

export { createTetrahedron }