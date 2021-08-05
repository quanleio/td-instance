class Ray {
  constructor(scene, camera) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.objects = [];
    this.scene.children.forEach((child) => {
      if (child.type === "Line" || child.name === "TRUNK") return;
      this.objects.push(child);
    });
    this.opts = {
      noiseForce: 0.6,
      curvesLength: 10,
      radius: 350,
      cubesQuantity: 45,
      pathOpacity: 0.2,
      speedAverage: 150000, //Ms
      zCamera: 120
    };
    this.dummy = new THREE.Object3D();

    let INTERSECTED = null;
    const matrix = new THREE.Matrix4();
    let position = new THREE.Vector3();
    let rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    window.addEventListener("click", (ev) => {
      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.raycaster.params.Points.threshold = 0.1;

      // const intersects = this.raycaster.intersectObjects(this.scene.children);
      const intersects = this.raycaster.intersectObjects(this.objects);
      this.setColor(intersects);
    });

    window.addEventListener("mousemove", (ev) => {
      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {

        (intersects[0].object instanceof THREE.Mesh ) ? document.body.style.cursor = "pointer" : document.body.style.cursor = "default";

        if (intersects[0].object instanceof THREE.Mesh) {

          // INTERSECTED = intersects[0].object;
          // let instanceId = intersects[0].instanceId;
          // INTERSECTED.material.opacity = .2;

          // INTERSECTED.getMatrixAt( instanceId, matrix );
          // matrix.decompose(position, quaternion, scale);
          //
          // // change scale
          // scale.x *= 1.2;
          // scale.y *= 1.2;
          // scale.z *= 1.2;
          //
          // // write scale back to matrix
          // matrix.scale( scale );
          // INTERSECTED.setMatrixAt( instanceId, matrix );
        }
      }
      else document.body.style.cursor = "default";
    });

    // For mobile
    window.addEventListener("touchstart", (ev) => {
      this.mouse.x = (ev.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.touches[0].clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {

        //Check if clicked item is instance of a Mesh
        if (intersects[0].object instanceof THREE.Mesh) {
          this.INTERSECTED = intersects[0].object;
          let instanceId = intersects[0].instanceId;
          this.INTERSECTED.getMatrixAt( instanceId, matrix );
          matrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);
          this.zoomInCameraToPosition(this.dummy.position)

          TweenMax.to(this.INTERSECTED.material, 1.5, {
            opacity: 0,
            ease: Power1.easeIn,
            onComplete: function() {
              this.INTERSECTED.visible = false;
            }
          });
        }
      }
      else {
        if (this.INTERSECTED) {
          this.INTERSECTED.visible = true;
          TweenMax.to(this.INTERSECTED.material, 0.6, {
            opacity: 1,
            ease: Power1.easeIn
          });
        }
        this.INTERSECTED = null;
        this.resetCamera();
      }
    });

    // for Desktop
    window.addEventListener("mouseup", (ev) => {

      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {

        //Check if clicked item is instance of a Mesh
        if (intersects[0].object instanceof THREE.Mesh) {
          // if (clickedCube) {
          // clickedCube.cameraMustFollow = false;
          // clickedCube.visible = true;
          // TweenMax.to(clickedCube.material, 2, {
          //   opacity: 1,
          //   ease: Power1.easeIn
          // });
          // }
          // clickedCube = intersects[0].object;

          INTERSECTED = intersects[0].object;
          let instanceId = intersects[0].instanceId;
          INTERSECTED.getMatrixAt( instanceId, matrix );
          matrix.decompose(this.dummy.position, this.dummy.quaternion, this.dummy.scale);
          // this.zoomInCameraToPosition(this.dummy.position);

          TweenMax.to(INTERSECTED.material, 1.5, {
            opacity: 0,
            ease: Power1.easeIn,
            onComplete: function() {
              INTERSECTED.visible = false;
            }
          });
        }
      }
      else {
        if (INTERSECTED) {
          INTERSECTED.visible = true;
          TweenMax.to(INTERSECTED.material, 0.6, {
            opacity: 1,
            ease: Power1.easeIn
          });
        }
        INTERSECTED = null;
        // this.resetCamera();
      }
    });
  }

  /*onMouseUp(ev) {
    var clickedCube = null;
    var hoverCube = null;
    let dummy = new THREE.Object3D();
    const matrix = new THREE.Matrix4();
    console.error(this.mouse)
    if (ev.type === "touchstart") {
      this.mouse.x = (ev.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.touches[0].clientY / window.innerHeight) * 2 + 1;
    } else {
      this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0) {

      //Check if clicked item is instance of a Mesh
      if (intersects[0].object instanceof THREE.Mesh) {
        // if (clickedCube) {
        // clickedCube.cameraMustFollow = false;
        // clickedCube.visible = true;
        // TweenMax.to(clickedCube.material, 0.6, {
        //   opacity: 1,
        //   ease: Power1.easeIn
        // });
        // }
        // clickedCube = intersects[0].object;

        // TweenMax.to(clickedCube.material, 0.6, {
        //   opacity: 0,
        //   ease: Power1.easeIn,
        //   onComplete: function() {
        //     clickedCube.visible = false;
        //   }
        // });
        // clickedCube.cameraMustFollow = true;
        // console.error(clickedCube);

        const INTERSECTED = intersects[0].object;
        let instanceId = intersects[0].instanceId;
        INTERSECTED.getMatrixAt( instanceId, matrix );
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        this.zoomInCameraToPosition(dummy.position)
      }
    }
    else {
      if (clickedCube) {
        clickedCube.cameraMustFollow = false;
        clickedCube.visible = true;
        TweenMax.to(clickedCube.material, 0.6, {
          opacity: 1,
          ease: Power1.easeIn
        });
      }
      clickedCube = null;
      this.resetCamera();
    }
  }*/

  resetCamera() {
    console.error('reset camera')
    TweenMax.to(this.camera.position, 2, {
      x: -1,
      y: 0,
      z: this.opts.zCamera,
      ease: Power1.easeInOut
    });
  }

  zoomInCameraToPosition(pos){
    console.error('zoomInCameraToPosition:', pos)
    TweenMax.to(this.camera.position, 2, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      ease: Power1.easeInOut,
    });
  }

  zoomObject(scale) {

  }

  setColor(intersects) {
    const color = new THREE.Color();
    if (intersects.length > 0) {
      const INTERSECTED = intersects[0].object;

      switch (INTERSECTED.type) {
        case "Mesh":
          INTERSECTED.material.color.set(
            color.setHex(Math.random() * 0xffffff)
          );
          break;
        case "Line":
          break;
        case "Points":
          const pointIndex = intersects[0].index;
          console.error("pointIndex:", pointIndex, "point:", intersects[0]);

          // let newColor = color.setHex(Math.random() * 0xffffff);
          // intersects[0].object.geometry.colors[pointIndex] = newColor;
          // intersects[0].object.geometry.colorsNeedUpdate=true;

          break;
        case "InstancedMesh":
          const instanceId = intersects[0].instanceId;
          console.error("CLICK instanceId:", instanceId);

          intersects[0].object.setColorAt(
            instanceId,
            color.setHex(Math.random() * 0xffffff)
          );
          intersects[0].object.instanceColor.needsUpdate = true;
          break;
      }
    }
  }
}

export { Ray };
