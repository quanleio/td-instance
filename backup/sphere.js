import {
  SphereBufferGeometry,
  MeshStandardMaterial,
  Mesh,
  MathUtils,
    Color,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function createSphere() {
  const geometry = new SphereBufferGeometry(1.5, 32, 32);
  const material = new MeshStandardMaterial({ color: new Color(0xF2C811).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
  const sphere = new Mesh(geometry, material);
  sphere.position.set(2, 0, 0);

  const radiansPerSecond = MathUtils.degToRad(30);

  // this method will be called once per frame
  sphere.tick = (delta) => {
    let timestamp = new Date() * 0.0005; // test
    
    // increase the cube's rotation each frame
    sphere.rotation.z += radiansPerSecond * delta;
    sphere.rotation.x += radiansPerSecond * delta;
    sphere.rotation.y += radiansPerSecond * delta;

    sphere.position.x = Math.cos(timestamp * 2) * 5;
    sphere.position.y = Math.sin(timestamp * 2) * 5;
  };

  return sphere;
}

export { createSphere };
