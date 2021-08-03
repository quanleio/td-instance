// import {
//   Raycaster,
//   Vector2,
//   Color,
// } from "https://unpkg.com/three@0.130.0/build/three.module.js";

class Ray {
  constructor(scene, camera) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("click", (ev) => {
      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.params.Points.threshold = 0.1;

      let objects = [];
      this.scene.children.forEach(child => {
        if (child.type === 'Line' || child.name === 'TRUNK') return;
        objects.push(child);
      })

      // const intersects = this.raycaster.intersectObjects(this.scene.children);
      const intersects = this.raycaster.intersectObjects(objects);
      this.setColor(intersects);
    });
  }

  setColor(intersects) {
    const color = new THREE.Color();
    if (intersects.length > 0) {
      const INTERSECTED = intersects[0].object;

      switch (INTERSECTED.type) {
        case "Mesh":
          INTERSECTED.material.color.set( color.setHex(Math.random() * 0xffffff) );
          break;
        case 'Line': break;
        case 'Points':
          const pointIndex = intersects[0].index;
          console.error('pointIndex:', pointIndex, 'point:', intersects[0]);

          // let newColor = color.setHex(Math.random() * 0xffffff);
          // intersects[0].object.geometry.colors[pointIndex] = newColor;
          // intersects[0].object.geometry.colorsNeedUpdate=true;

          break;
        case "InstancedMesh":
          const instanceId = intersects[0].instanceId;
          console.error('instanceId:', instanceId);

          intersects[0].object.setColorAt( instanceId, color.setHex(Math.random() * 0xffffff));
          intersects[0].object.instanceColor.needsUpdate = true;
          break;
      }
    }
  }
}

export { Ray };
