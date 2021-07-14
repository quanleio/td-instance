import {
  BufferGeometryLoader,
  TextureLoader,
  MeshPhongMaterial,
  MeshBasicMaterial,
  InstancedMesh,
  Color,
  Vector3,
  Matrix4,
  MathUtils,
  Euler,
  Quaternion
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

/**
 * Load BufferGeometry to make mesh.
 * @returns {Promise<unknown>}
 */
function loadSuzanne() {
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

/**
 * Load BufferGeometry to make mesh.
 * @returns {Promise<unknown>}
 */
function loadSakura() {
  return new Promise((resolve, reject) => {
    new BufferGeometryLoader().load(
        "../assets/sakura.json",
        (buffGeo) => {
          buffGeo.computeVertexNormals();
          makeInstanceWithRandomPos(buffGeo).then(_instancedMesh => resolve(_instancedMesh));
        },
        onProgress,
        onError
    );
  });
}

/**
 * Create mesh instanced from {_buffGeo}.
 * instance.json to set the position for each instancedMesh.
 * @param _buffGeo
 * @returns {Promise<unknown>}
 */
function makeInstance(_buffGeo) {
  return new Promise((resolve, reject) => {
    const matrix = new Matrix4();

    fetch("../assets/instances.json")
      .then((r) => r.json())
      .then((instanceData) => {
        let instancedCount = instanceData.length;
        // console.error("instancedCount: ", instancedCount);

        const material = new MeshPhongMaterial();
        const color = new Color();

        let instancedMesh = new InstancedMesh(_buffGeo, material, instancedCount);
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
 * Create mesh instanced from {_buffGeo}.
 * instance.json to set the position for each instancedMesh.
 * @param _buffGeo
 * @returns {Promise<unknown>}
 */
function makeInstanceWithRandomPos(_buffGeo) {
  return new Promise((resolve, reject) => {
    const matrix = new Matrix4();
    const color = new Color();
    const count = 1000;

    let textureLeaf = new TextureLoader().load("../assets/branch.002_baseColor.png");
    let material = new MeshBasicMaterial( {
      map: textureLeaf
    } );

    let instancedMesh = new InstancedMesh(_buffGeo, material, count);
    instancedMesh.type = "InstancedMesh";

    for (let i = 0; i < count; i++) {

      // set position
      randomizeMatrix(matrix);
      instancedMesh.setMatrixAt(i, matrix);
      instancedMesh.setColorAt(i, color);
    }

    resolve(instancedMesh);
  });
}

/**
 * Random position for each object
 * @type {(function(*): void)|*}
 */
const randomizeMatrix = function() {

  const position = new Vector3();
  const rotation = new Euler();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  return function(matrix) {

    position.x = Math.random() * 40 - 20;
    position.y = Math.random() * 40 - 20;
    position.z = Math.random() * 40 - 20;

    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = Math.random() * 1;

    matrix.compose(position, quaternion, scale);

  };

}();

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

export { loadSuzanne, loadSakura };
