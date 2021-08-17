const randomColors = {
  green: 0x5fbb88, // 1
  red: 0x771b56, // 2
  pink: 0xf9e5f6, // 3
  brown: 0x8e5032, // 4
  lightblue: 0x57aed7, // 5
  blue: 0x436fb3, // 6
  yellow: 0xe0ba4a, // 7
  white: 0xffffff, // 8
};
let colorsLength = Object.keys(randomColors).length;

function getRandomColor() {
  var colIndx = Math.floor(Math.random() * colorsLength);
  var colorStr = Object.keys(randomColors)[colIndx];
  return randomColors[colorStr];
}

const radiansPerSecond = THREE.MathUtils.degToRad(30);
const texture = new THREE.TextureLoader().load('assets/bubble.png');
function vertexShader() {
  return `
    precision highp float;
  
      uniform float sineTime;
  
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
  
      attribute vec3 position;
      attribute vec3 offset;
      attribute vec4 color;
      attribute vec4 orientationStart;
      attribute vec4 orientationEnd;
  
      varying vec3 vPosition;
      varying vec4 vColor;
  
      void main(){
  
        vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
        vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
        vec3 vcV = cross( orientation.xyz, vPosition );
        vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );
  
        vColor = color;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
  
      }
  `;
}
function fragmentShader() {
  return `
    precision highp float;
  
      uniform float time;
  
      varying vec3 vPosition;
      varying vec4 vColor;
  
      void main() {
  
        vec4 color = vec4( vColor );
        color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
  
        gl_FragColor = color;
  
      }
  `;
}
const clock = new THREE.Clock();

function loadRobot() {

  const matrix = new THREE.Matrix4();
  const dummy = new THREE.Object3D();
  const count = 1000;

  return new Promise(resolve => {
    let gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load( 'assets/Flower.glb' , function(gltf) {

      gltf.scene.scale.setScalar(50);
      console.error(gltf.scene)

      const _blossomMesh = gltf.scene.getObjectByName( 'Blossom' ); // child1
      const blossomGeometry = _blossomMesh.geometry.clone(); // child2

      const defaultTransform = new THREE.Matrix4()
      .makeRotationX( Math.PI )
      .multiply( new THREE.Matrix4().makeScale( 7, 7, 7 ) );

      blossomGeometry.applyMatrix4( defaultTransform );

      const blossomMaterial = _blossomMesh.material;

      const blossomMesh = new THREE.InstancedMesh( blossomGeometry, blossomMaterial, 1000 );
      blossomMesh.name = 'blossomMesh'

      // Assign random colors to the blossoms.
      const color = new THREE.Color();
      const blossomPalette = [ 0xF20587, 0xF2D479, 0xF2C879, 0xF2B077, 0xF24405 ];

      for ( let i = 0; i < count; i ++ ) {

        color.setHex( blossomPalette[ Math.floor( Math.random() * blossomPalette.length ) ] );
        blossomMesh.setColorAt( i, color );

        const randomX = (Math.random() * 5 - 5 / 2) * 40;
        const randomY = (Math.random() * 2 - 1) * 40;
        const randomZ = (Math.random() * 4 - 2) * 20;
        matrix.setPosition(randomX, randomY, randomZ);
        blossomMesh.setMatrixAt(i, matrix);

      }

      blossomMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

      blossomMesh.tick = () => {


      }

      resolve(blossomMesh);
    });

    gltfLoader.load( 'assets/RobotExpressive.glb' , function(gltf) {

      gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
          console.error(child)
          var instancedMesh = new THREE.InstancedMesh( child.geometry, child.material, 1 );

          for ( let i = 0; i < count; i ++ ) {

            const randomX = (Math.random() * 5 - 5 / 2) * 40;
            const randomY = (Math.random() * 2 - 1) * 40;
            const randomZ = (Math.random() * 4 - 2) * 20;
            matrix.setPosition(randomX, randomY, randomZ);
            instancedMesh.setMatrixAt(i, matrix);

          }

          instancedMesh.tick = () => {}

          resolve(instancedMesh);

        }
      } );
    });

  })
}

/**
 * Load BufferGeometry to make mesh.
 * @returns {Promise<unknown>}
 */
function loadSuzanne() {
  return new Promise((resolve, reject) => {
    new THREE.BufferGeometryLoader().load(
      "assets/suzanne_buffergeometry.json",
      (buffGeo) => {
        buffGeo.computeVertexNormals();

        makeInstance(buffGeo).then((_instancedMesh) => {
          // this method will be called once per frame
          _instancedMesh.tick = (delta) => {
            var time = clock.getElapsedTime(); // elapsed time since last reset
            if (time > 1.5) {
              for (let index = 0; index < _instancedMesh.count; index++) {
                _instancedMesh.setColorAt( index, new THREE.Color().setHex(getRandomColor())
                );
                _instancedMesh.instanceColor.needsUpdate = true;
              }
              clock.start(); // resets clock
            }
          };
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
    new THREE.BufferGeometryLoader().load(
      "assets/sakura.json",
      (buffGeo) => {
        buffGeo.computeVertexNormals();
        makeInstanceWithRandomPos(buffGeo).then((_instancedMesh) =>
          resolve(_instancedMesh)
        );
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
 /* const vertex = vertexShader();
  const fragment = fragmentShader();
  const shaderMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      sineTime: { value: 1.0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
    transparent: true,
  });*/

  return new Promise((resolve, reject) => {
    const matrix = new THREE.Matrix4();

    fetch("assets/instances.json")
      .then((r) => r.json())
      .then((instanceData) => {
        let instancedCount = instanceData.length;
        console.error("instancedCount: ", instancedCount);

        // const material = new THREE.MeshBasicMaterial({
        //   color: 0xBA0A1B,
        //   map: texture,
        //   transparent: true,
        //   opacity: 1,
        //   depthTest: false,
        //   depthWrite: false,
        //   blending: THREE.AdditiveBlending
        // });
        const material = new THREE.MeshPhongMaterial();
        let instancedMesh = new THREE.InstancedMesh(
          _buffGeo,
          material,
          instancedCount
        );
        instancedMesh.type = "InstancedMesh";

        for (let i = 0; i < instanceData.length; i++) {
          let inst = instanceData[i];
          let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedMesh.setMatrixAt(i, matrix);
          // instancedMesh.setColorAt(i, color);

          // Enable bloom layers
          // instancedMesh.layers.enable(1);
        }

        /*instancedMesh.tick = (delta) => {
            const time = performance.now();

            // instancedMesh.material.uniforms["time"].value = time * 0.005;
            // mesh.material.uniforms[ "sineTime" ].value = Math.sin( mesh.material.uniforms[ "time" ].value * 0.05 );
          };*/

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
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const count = 1000;
    const dummy = new THREE.Object3D();
    let points = [];

    let textureLeaf = new THREE.TextureLoader().load(
      "assets/branch.002_baseColor.png"
    );
    let material = new THREE.MeshBasicMaterial({
      map: textureLeaf,
    });

    let instancedMesh = new THREE.InstancedMesh(_buffGeo, material, count);
    instancedMesh.type = "InstancedMesh";

    for (let i = 0; i < count; i++) {
      // set position
      randomizeMatrix(matrix);
      instancedMesh.setMatrixAt(i, matrix);
      instancedMesh.setColorAt(i, color);

      instancedMesh.getMatrixAt(i, matrix);
      matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      points.push(dummy.position);

      // Enable bloom layers
      // if (Math.random() < 0.25) instancedMesh.layers.enable(1);
    }

    resolve(instancedMesh);
  });
}

/**
 * Random position for each object
 * @type {(function(*): void)|*}
 */
const randomizeMatrix = (function () {
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  return function (matrix) {
    position.x = Math.random() * 40 - 20;
    position.y = Math.random() * 40 - 20;
    position.z = Math.random() * 40 - 20;

    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = (Math.random() * 1) / 2;

    matrix.compose(position, quaternion, scale);
  };
})();

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

export { loadSuzanne, loadSakura, loadRobot };
