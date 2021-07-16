import {
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  MeshBasicMaterial,
  Mesh,
  CylinderBufferGeometry,
  DynamicDrawUsage
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function makeLineBetweenPoints(points) {
  let lineGeom = new BufferGeometry().setFromPoints(points);
  // console.error(points);
  lineGeom.computeBoundingSphere();
  lineGeom.attributes.position.needsUpdate = true;

  // drawcalls
  // let drawCount = 2; // draw the first 2 points, only
  // lineGeom.setDrawRange( 0, drawCount );

  const lineMat = new LineBasicMaterial({
    color: "white",
    opacity: 1,
    linewidth: 2,
  });
  const line = new LineSegments(lineGeom, lineMat);

  line.tick = (delta) => {
    // console.warn(points);
    line.geometry.setFromPoints(points);
    line.geometry.attributes.position.needsUpdate = true;
  }

  return line;
}

export { makeLineBetweenPoints };
