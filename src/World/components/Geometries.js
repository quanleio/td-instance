const radiansPerSecond = THREE.MathUtils.degToRad(30);

class Geometries {
  constructor() {}

  /**
   * Create particles and make lines
   * @returns {*}
   */
  createParticles() {
    const particleCount = 1200; // 1000;
    const radius = 20; //10;
    const positions = [];
    const colors = [];
    const sizes = [];
    const color = new THREE.Color();
    let points = [];

    let uniforms = {
      pointTexture: {
        value: new THREE.TextureLoader().load("assets/spark1.png"),
      },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    const geometry = new THREE.BufferGeometry();
    for (let i = 0; i < particleCount; i++) {

      const randomX = (Math.random() * 6 - 3) * radius;
      const randomY = (Math.random() * 6 - 3) * radius;
      const randomZ = (Math.random() * 6 - 3) * radius;
      positions.push(randomX);
      positions.push(randomY);
      positions.push(randomZ);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));

      color.setHSL(i / particleCount, 1.0, 0.5);
      colors.push(color.r, color.g, color.b);
      sizes.push(20);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    let particleSystem = new THREE.Points(geometry, shaderMaterial);
    particleSystem.sortParticles = true;

    // add lines
    // let line = this.addLine(points);
    // particleSystem.add(line);
    // line.matrixAutoUpdate = false;

    // Dont apply bloom for particles
    particleSystem.layers.enable(0);

    particleSystem.tick = (delta) => {
      const time = Date.now() * 0.002;

      const sizes = geometry.attributes.size.array;
      for (let i = 0; i < particleCount; i++) {
        sizes[i] = 2 * (1 + Math.sin(0.1 * i + time));
      }
      geometry.attributes.size.needsUpdate = true;
    };

    return particleSystem;
  }

  createBubbles() {

    let start = Date.now();
    const bubbleMat = new THREE.ShaderMaterial( {
      uniforms: {
        tExplosion: {
          type: "t",
          value: THREE.ImageUtils.loadTexture( './assets/yellow.png' )
        },
        time: { // float initialized to 0
          type: "f",
          value: 0.0
        },
      },
      vertexShader: document.getElementById( 'vertexShader-bubble' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader-bubble' ).textContent
    });

    const bubble = new THREE.Mesh(
        new THREE.IcosahedronBufferGeometry(10, 32),
        bubbleMat
    );
    bubble.layers.enable(1)

    bubble.tick = () => {
      // uniform update
      bubbleMat.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
    }

    return bubble
  }

  /**
   * Generate position for each Instaned Mesh and makes lines
   * @returns {*}
   */
  instanceShapes() {
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    let amount = parseInt(window.location.search.substr(1)) || 10;
    const dummy = new THREE.Object3D();
    let position = new THREE.Vector3();
    let rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    let points = [];

    let lastTime = 0;
    const moveQ = new THREE.Quaternion(0.5, 0.5, 0.5, 0.0).normalize();
    const tmpQ = new THREE.Quaternion();
    const tmpM = new THREE.Matrix4();
    const currentM = new THREE.Matrix4();

    const totalMesh = this.createMesh();

    totalMesh.forEach((mesh) => {
      for (let i = 0; i < mesh.count; i++) {
        // color
        mesh.setColorAt(i, color.setHex(0xffffff * Math.random()));

        // position
        /*const randomX = ( Math.random() * 5 - 5/2 ) * 10;
        const randomY = ( Math.random() * 2 - 1 )   * 20;
        const randomZ = ( Math.random() * 4 - 2 )   * 10;*/
        const randomX = (Math.random() * 5 - 5 / 2) * 40;
        const randomY = (Math.random() * 2 - 1) * 40;
        const randomZ = (Math.random() * 4 - 2) * 20;
        matrix.setPosition(randomX, randomY, randomZ);
        mesh.setMatrixAt(i, matrix);

        // let identity = new THREE.Matrix4().identity();
        // mesh.getMatrixAt(i, identity);
        //
        // // Get position of each instance and push into points.
        // var vec = new THREE.Vector3();
        // vec.setFromMatrixPosition( identity );
        // points.push(vec);

        points.push(new THREE.Vector3(randomX, randomY, randomZ));

        // Enable bloom layers
        mesh.layers.enable(1);
      }

      /*let line = this.addLine(points);
      mesh.add(line);
      line.matrixAutoUpdate = false;*/

      mesh.tick = (delta) => {
        // position
        // mesh.getMatrixAt( 0, matrix ); // first instance
        // position.setFromMatrixPosition( matrix ); // extract position form transformationmatrix
        // position.x += 0.01; // move
        // matrix.setPosition( position ); // write new positon back
        // points.push(rotation);
        // mesh.setMatrixAt( 0, matrix );

        /*const time = performance.now();
        // mesh.rotation.y = time * 0.00005;
        const delta2 = ( time - lastTime ) / 5000;
        tmpQ.set( moveQ.x * delta2, moveQ.y * delta2, moveQ.z * delta2, 1 ).normalize();
        tmpM.makeRotationFromQuaternion( tmpQ );

        for ( let i = 0, il = mesh.count; i < il; i ++ ) {

          mesh.getMatrixAt( i, currentM );
          currentM.multiply( tmpM );
          mesh.setMatrixAt( i, currentM );

        }
        mesh.instanceMatrix.needsUpdate = true;
        lastTime = time;*/

        for (let index = 0; index < mesh.count; index++) {
          // rotation
          mesh.getMatrixAt(index, matrix);
          matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

          dummy.rotation.x += radiansPerSecond * delta;
          dummy.rotation.y += radiansPerSecond * delta;
          dummy.rotation.z += radiansPerSecond * delta;

          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      };
    });

    /*shapes.tick = (delta) => {

      /!*const time = Date.now() * 0.001;
      const offset = ( amount - 1 ) / 2;

      for ( let x = 0; x < amount; x ++ ) {
        for ( let y = 0; y < amount; y ++ ) {
          for ( let z = 0; z < amount; z ++ ) {
            dummy.position.set( offset - x, offset - y, offset - z );
            dummy.rotation.y = ( Math.sin( x / 4 + time ) + Math.sin( y / 4 + time ) + Math.sin( z / 4 + time ) );
            dummy.rotation.z = dummy.rotation.y * 2;
            dummy.updateMatrix();
            boxes.setMatrixAt( i ++, dummy.matrix );
          }
        }
      }
      boxes.instanceMatrix.needsUpdate = true;*!/
    }*/

    return totalMesh;
  }

  /**
   * Create instaned mesh for every shape here.
   * @returns {*[]}
   */
  createMesh() {
    let instanedMeshs = [];
    const count = 30;
    const size = 1.2;
    // const texture = new THREE.TextureLoader().load( 'assets/bubble.png' );
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 1
    });

    // Sphere
    const sphereGeo = new THREE.SphereBufferGeometry(size, 32, 32);
    let sphereShapes = new THREE.InstancedMesh(
        sphereGeo,
        material,
        count
    );
    sphereShapes.type = "InstancedMesh";
    sphereShapes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    sphereShapes.castShadow = true;
    sphereShapes.receiveShadow = true;
    // instanedMeshs.push(sphereShapes);

    // tetrahedron
    const tetraGeo = new THREE.TetrahedronBufferGeometry(size, 0);
    let tetraShapes = new THREE.InstancedMesh(tetraGeo, material, count);
    tetraShapes.type = "InstancedMesh";
    tetraShapes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    tetraShapes.castShadow = true;
    tetraShapes.receiveShadow = true;
    // instanedMeshs.push(tetraShapes);

    // Octahedron
    const octahedronGeo = new THREE.OctahedronBufferGeometry(size, 0);
    let octahedronGeoShapes = new THREE.InstancedMesh(
      octahedronGeo,
      material,
      count
    );
    octahedronGeoShapes.type = "InstancedMesh";
    octahedronGeoShapes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    octahedronGeoShapes.castShadow = true;
    octahedronGeoShapes.receiveShadow = true;
    instanedMeshs.push(octahedronGeoShapes);

    // Icosahedron
    const icosahedronGeo = new THREE.IcosahedronBufferGeometry(size, 0);
    let icosahedronGeoShapes = new THREE.InstancedMesh(
      icosahedronGeo,
      material,
      count
    );
    icosahedronGeoShapes.type = "InstancedMesh";
    icosahedronGeoShapes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    icosahedronGeoShapes.castShadow = true;
    icosahedronGeoShapes.receiveShadow = true;
    instanedMeshs.push(icosahedronGeoShapes);

    // box
    const boxGeo = new THREE.BoxBufferGeometry(size, size, size);
    let boxShapes = new THREE.InstancedMesh(boxGeo, material, count);
    boxShapes.type = "InstancedMesh";
    boxShapes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    boxShapes.castShadow = true;
    boxShapes.receiveShadow = true;
    // instanedMeshs.push(boxShapes);

    return instanedMeshs;
  }

  randomStars() {
    var rs = [];
    var shape = [];
    var pos = {
      x : 0,
      y : 0,
      z : 0
    }
    var color = "#fc6bcf";

    for(var x = 0; x < 500; x++) {
      const phongMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color("#fff"), emissive: new THREE.Color("#35bad8"), specular: 0x111111, shininess: 100 }); // need dir light

      // const material = new THREE.MeshStandardMaterial({
      //   color: new THREE.Color("#fff") * Math.random(),
      //   roughness: 0.4,
      //   metalness: 0.1,
      //   transparent: true,
      //   opacity: 1,
      // });

      // material = new THREE.MeshPhongMaterial({
      //   color      : new THREE.Color("#fff"),
      //   emissive   : new THREE.Color("#35bad8"),
      //   shininess  : new THREE.Color("#fff"),
      //   shininess  :  100,
      //   shading    :  THREE.FlatShading,
      // });
      if(x %2 === 0) {
        phongMaterial.emissive = new THREE.Color(color);
      }

      pos.x = this.getRandomArbitrary(-(window.innerWidth+500), window.innerWidth+500);
      pos.y = this.getRandomArbitrary(-(window.innerHeight+1000),window.innerHeight+1000);
      pos.z = this.getRandomArbitrary(0, 1000);

      rs[x] = new THREE.TetrahedronBufferGeometry(this.getRandomArbitrary(2,20), 0);
      shape[x] = new THREE.Mesh(rs[x], phongMaterial);
      shape[x].castShadow = true;
      shape[x].position.set(pos.x,pos.y,pos.z);
      shape[x].layers.enable(1)
    }

    shape.forEach(shape => {
      shape.tick = () => {
        shape.position.z -= 5;

        if(shape.position.z < -1000) {
          shape.position.z = this.getRandomArbitrary(0,1000)
        }

        // shape.position.y += 500;
        // if(shape.position.y < - 1000) {
        //   shape.position.y = this.getRandomArbitrary(0,1000)
        // }
      }
    })

    return shape;
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Create lines between points.
   * @param _points
   * @returns {*}
   */
  addLine(_points) {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xffffff).convertSRGBToLinear(),
      linewidth: 1,
      transparent: true,
      opacity: 0.1,
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints(_points);
    const line = new THREE.Line(lineGeo, material);

    // line.tick = (delta) => {
    //   line.geometry.setFromPoints(points);
    //   line.geometry.attributes.position.needsUpdate = true;
    // }
    return line;
  }

  autoRandom() {
    setTimeout(() => {
      let randomCube = this.randomCube();
      console.error("random cube");

      return randomCube;
    }, 1000);
  }

  randomCube() {
    let count = 4;

    const geometry = new THREE.BoxBufferGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xec173a).convertSRGBToLinear(),
      roughness: 0.4,
      metalness: 0.1,
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.random() * 40 - 20;
    cube.position.y = Math.random() * 40 - 20;
    cube.position.z = Math.random() * 40 - 20;

    cube.rotation.x = Math.random() * 2 * Math.PI;
    cube.rotation.y = Math.random() * 2 * Math.PI;
    cube.rotation.z = Math.random() * 2 * Math.PI;

    // enable bloom
    cube.layers.enable(1);

    cube.tick = (delta) => {
      cube.rotation.z += radiansPerSecond * delta;
      cube.rotation.x += radiansPerSecond * delta;
      cube.rotation.y += radiansPerSecond * delta;
      // cube.position.y += radiansPerSecond*delta;
    };

    return cube;
  }

  /**
   * Random cubes, use normal Mesh
   * @returns {*[]}
   */
  floatingCube() {
    let count = 50;
    let cubes = [];
    let points = [];
    let group = new THREE.Group();

    const geometry = new THREE.BoxBufferGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xec173a).convertSRGBToLinear(),
      roughness: 0.4,
      metalness: 0.1,
    });

    for (let i = 0; i < count; i++) {
      const cube = new THREE.Mesh(geometry, material);

      cube.position.x = Math.random() * 40 - 20;
      cube.position.y = Math.random() * 40 - 20;
      cube.position.z = Math.random() * 40 - 20;

      cube.rotation.x = Math.random() * 2 * Math.PI;
      cube.rotation.y = Math.random() * 2 * Math.PI;
      cube.rotation.z = Math.random() * 2 * Math.PI;

      // enable bloom
      cube.layers.enable(1);

      // line
      points.push(cube.position);
      group.add(cube);

      cube.tick = (delta) => {
        // increase the cube's rotation each frame
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;

        cube.position.y += radiansPerSecond * delta;
      };

      cubes.push(cube);
    }

    // let line = this.addLine(points);
    // group.add(line);
    // line.matrixAutoUpdate = false;

    return cubes;
  }

  /**
   * Using InstancedBufferGeometry to generate triangles.
   * @returns {*}
   */
  generateShapes() {
    let dummy = new THREE.Object3D();
    const count = 1000;
    const matrix = new THREE.Matrix4();
    const vector = new THREE.Vector4();
    const positions = [];
    const offsets = [];
    const colors = [];
    const orientationsStart = [];
    const orientationsEnd = [];

    positions.push(0.025, -0.025, 0);
    positions.push(-0.025, 0.025, 0);
    positions.push(0, 0, 0.025);

    // instanced attributes
    for (let i = 0; i < count; i++) {
      // offsets
      offsets.push(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );

      // colors
      colors.push(Math.random(), Math.random(), Math.random(), Math.random());

      // orientation start
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();

      orientationsStart.push(vector.x, vector.y, vector.z, vector.w);

      // orientation end

      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();

      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);
    }

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.instanceCount = count;
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "offset",
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(new Float32Array(colors), 4)
    );
    geometry.setAttribute(
      "orientationStart",
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
    );
    geometry.setAttribute(
      "orientationEnd",
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
    );

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
      },
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // const mesh = new Mesh( geometry, material );
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.type = "InstancedMesh";
    mesh.scale.setScalar(Math.random() * 50);

    /*var defaultTransform = new THREE.Matrix4().multiply( new THREE.Matrix4().makeScale( 0.75, 0.75, 0.75 ) )
    geometry.applyMatrix4( defaultTransform );

    mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

    for ( var i = 0; i < count; i++ ) { // Iterate and offset x pos

      var dummyOffset = -100*i;
      dummy.position.copy( new THREE.Vector3( 0,-15, dummyOffset ) );
      dummy.updateMatrix();
      mesh.setMatrixAt( i, dummy.matrix );
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;*/

    /*for ( let i = 0; i < count; i ++ ) {

      // set position
      randomizeMatrix(matrix);
      mesh.setMatrixAt(i, matrix);
      points.push(mesh.position);
    }
    */

    mesh.tick = (delta) => {
      const time = performance.now();

      // mesh.rotation.y = time * 0.0005;
      mesh.material.uniforms["time"].value = time * 0.005;
      // mesh.material.uniforms[ "sineTime" ].value = Math.sin( mesh.material.uniforms[ "time" ].value * 0.05 );
    };

    return mesh;
  }

  /**
   * Make line between points
   * @returns {*}
   */
  makeLineBetweenPoints() {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xffffff).convertSRGBToLinear(),
      linewidth: 1,
      transparent: true,
      opacity: 0.1,
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, material);

    line.tick = (delta) => {
      line.geometry.setFromPoints(points);
      line.geometry.attributes.position.needsUpdate = true;
    };
    return line;
  }
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

    scale.x = scale.y = scale.z = Math.random() * 20;

    matrix.compose(position, quaternion, scale);
  };
})();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export { Geometries };
