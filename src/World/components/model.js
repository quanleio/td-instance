import {
  BufferGeometryLoader,
  MeshPhongMaterial,
  InstancedMesh,
  Color,
  Vector3,
  Matrix4,
  MathUtils,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

function addModel() {
  return new Promise((resolve, reject) => {
    new BufferGeometryLoader().load(
      "../assets/suzanne_buffergeometry.json",
      (buffGeo) => {
        buffGeo.computeVertexNormals();

        makeInstance(buffGeo).then(_instancedMesh => {

          const radiansPerSecond = MathUtils.degToRad(30);

          // this method will be called once per frame
          _instancedMesh.tick = ( delta ) => {
            _instancedMesh.rotation.y += radiansPerSecond * delta;
          }

          resolve(_instancedMesh);
        });
      },
      onProgress,
      onError
    );
  });
}

function makeInstance(_buffGeo) {
  return new Promise((resolve, reject) => {
    const matrix = new Matrix4();

    fetch("../assets/instances.json")
      .then((r) => r.json())
      .then((instanceData) => {
        let instancedCount = instanceData.length;
        console.error("instancedCount: ", instancedCount);

        const material = new MeshPhongMaterial();
        const color = new Color();

        let instancedMesh = new InstancedMesh(
          _buffGeo,
          material,
          instancedCount
        );
        instancedMesh.type = "InstancedMesh";

        for (let i = 0; i < instanceData.length; i++) {
          let inst = instanceData[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedMesh.setMatrixAt(i, matrix);
          instancedMesh.setColorAt(i, color);
        }

        resolve(instancedMesh);
      });
  });
}

/**
 * Show the progress of loading model
 * @param xhr
 */
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.warn(Math.round(percentComplete) + "%");
  }
}

/**
 * Show error if loading error.
 * @param e
 */
function onError(e) {
  console.error(e);
}

export { addModel };
