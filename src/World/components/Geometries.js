import {
  BoxBufferGeometry,
  TetrahedronBufferGeometry,
  IcosahedronBufferGeometry,
  OctahedronBufferGeometry,
  TubeBufferGeometry,
  SphereBufferGeometry,
  BufferGeometry,
  InstancedBufferGeometry,
  ShaderMaterial,
  MeshStandardMaterial,
  LineBasicMaterial,
  RawShaderMaterial,
  MeshLambertMaterial,
  TextureLoader,
  Object3D,
  Line,
  Mesh,
  InstancedMesh,
  Points,
  CatmullRomCurve3,
  InstancedBufferAttribute,
  Float32BufferAttribute,
  MathUtils,
  Color,
  Vector3,
  Vector4,
  Matrix4,
  Quaternion,
  DynamicDrawUsage,
  AdditiveBlending,
  Euler,
  DoubleSide,
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

const radiansPerSecond = MathUtils.degToRad(30);
let points= [];

class Geometries {

  constructor() {}

  /**
   * Create particles and make lines
   * @returns {*}
   */
  createParticles() {
    const particleCount = 300;
    const radius = 10;
    const positions = [];
    const colors = [];
    const sizes = [];
    const color = new Color();

    let uniforms = {
      pointTexture: { value: new TextureLoader().load( "assets/spark1.png" ) }
    };

    const shaderMaterial = new ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      blending: AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    } );

    const geometry = new BufferGeometry();
    for ( let i = 0; i < particleCount; i ++ ) {

      const randomX = ( Math.random() * 4 - 2 ) * radius;
      const randomY = ( Math.random() * 4 - 2 ) * radius;
      const randomZ = ( Math.random() * 4 - 2 ) * radius;

      positions.push( randomX );
      positions.push( randomY );
      positions.push( randomZ );

      points.push(new Vector3(randomX, randomY, randomZ));

      color.setHSL( i / particleCount, 1.0, 0.5 );
      colors.push( color.r, color.g, color.b );
      sizes.push( 20 );
    }

    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'size', new Float32BufferAttribute( sizes, 1 ).setUsage( DynamicDrawUsage ) );
    let particleSystem = new Points( geometry, shaderMaterial );
    particleSystem.sortParticles = true;

    // Dont apply bloom for particles
    particleSystem.layers.enable(0);

    particleSystem.tick = (delta) => {
      const time = Date.now() * 0.002;

      const sizes = geometry.attributes.size.array;
      for ( let i = 0; i < particleCount; i ++ ) {
        sizes[ i ] = 2 * ( 1 + Math.sin( 0.1 * i + time ) );
      }
      geometry.attributes.size.needsUpdate = true;
    }

    return particleSystem;
  }

  /**
   * Generate position for each Instaned Mesh and makes lines
   * @returns {*}
   */
  instanceShapes() {
    const matrix = new Matrix4();
    const color = new Color();
    let amount = parseInt( window.location.search.substr( 1 ) ) || 10;
    const dummy = new Object3D();
    let position = new Vector3();
    let rotation = new Euler();
    const quaternion = new Quaternion();

    const totalMesh = this.createMesh();

    totalMesh.forEach( mesh => {

      for ( let i = 0; i < mesh.count; i ++ ) {

        // color
        mesh.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );

        // position
        const randomX = ( Math.random() * 4 - 2 ) * 10;
        const randomY = ( Math.random() * 4 - 2 ) * 10;
        const randomZ = ( Math.random() * 4 - 2 ) * 10;

        // genertate position area in cube shape
        // let randomX = Math.random()*40 - 20;
        // let randomY = Math.random()*30 - 10;
        // let randomZ = Math.random()*20 - 10;
        matrix.setPosition( randomX, randomY , randomZ );
        mesh.setMatrixAt( i, matrix );

        // let identity = new Matrix4().identity();
        // mesh.getMatrixAt(i, identity);
        //
        // // Get position of each instance and push into points.
        // var vec = new Vector3();
        // vec.setFromMatrixPosition( identity );
        // points.push(vec);

        points.push(new Vector3(randomX, randomY, randomZ));
        // line.points.push(new Vector3(randomX, randomY, randomZ));

        // Enable bloom layers
        mesh.layers.enable(1);
      }

      mesh.tick = (delta) => {

        // position
        // mesh.getMatrixAt( 0, matrix ); // first instance
        // position.setFromMatrixPosition( matrix ); // extract position form transformationmatrix
        // position.x += 0.01; // move
        // matrix.setPosition( position ); // write new positon back
        // points.push(rotation);
        // mesh.setMatrixAt( 0, matrix );

        for (let index=0; index< mesh.count; index++) {

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
      }

    })

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
    const material = new MeshStandardMaterial({ roughness: 0.4,metalness: 0.1, transparent: true, opacity: 1 });

    // tetrahedron
    const tetraGeo = new TetrahedronBufferGeometry(0.8, 0);
    let tetraShapes = new InstancedMesh( tetraGeo, material, 10 );
    tetraShapes.type = "InstancedMesh";
    tetraShapes.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame
    tetraShapes.castShadow = true;
    tetraShapes.receiveShadow = true;
    // instanedMeshs.push(tetraShapes);

    // Octahedron
    const octahedronGeo = new OctahedronBufferGeometry(0.8, 0);
    let octahedronGeoShapes = new InstancedMesh( octahedronGeo, material, 10 );
    octahedronGeoShapes.type = "InstancedMesh";
    octahedronGeoShapes.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame
    octahedronGeoShapes.castShadow = true;
    octahedronGeoShapes.receiveShadow = true;
    instanedMeshs.push(octahedronGeoShapes);

    // Icosahedron
    const icosahedronGeo = new IcosahedronBufferGeometry(0.8, 0);
    let icosahedronGeoShapes = new InstancedMesh( icosahedronGeo, material, 10 );
    icosahedronGeoShapes.type = "InstancedMesh";
    icosahedronGeoShapes.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame
    icosahedronGeoShapes.castShadow = true;
    icosahedronGeoShapes.receiveShadow = true;
    instanedMeshs.push(icosahedronGeoShapes);

    // box
    const boxGeo = new BoxBufferGeometry(0.8, 0.8, 0.8);
    let boxShapes = new InstancedMesh( boxGeo, material, 10 );
    boxShapes.type = "InstancedMesh";
    boxShapes.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame
    boxShapes.castShadow = true;
    boxShapes.receiveShadow = true;
    // instanedMeshs.push(boxShapes);

    return instanedMeshs;
  }

  /**
   * Create tree from JSON data
   * @returns {Promise<unknown>}
   */
  makeTree(){
    return new Promise((resolve, reject) => {
      let branchs = [];
      fetch("assets/4dan.json")
      .then((r) => r.json())
      .then(instanceData => {
        console.error(instanceData);

        let branchA = this.createBranch('danA', instanceData.danA);
        let branchB = this.createBranch('danB', instanceData.danB);
        let branchC = this.createBranch('danC', instanceData.danC);
        let branchD = this.createBranch('danD', instanceData.danD);
        branchs.push(branchA, branchB, branchC, branchD);

        resolve(branchs);
      });
    });
  }

  /**
   * Create branch for tree
   * @param branch
   * @param data
   * @returns {*}
   */
  createBranch( branch, data ) {

    const matrix = new Matrix4();
    const geometry = new SphereBufferGeometry(.2, 32);
    let instancedDan;

    switch (branch) {
      case 'danA':
        let danACount = data.length;
        const materialDanA = new MeshStandardMaterial({ color: new Color(0xec173a).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
        instancedDan = new InstancedMesh(geometry, materialDanA, danACount);
        instancedDan.type = "InstancedMesh";
        let pointsA=[];

        for (let i = 0; i < danACount; i++) {
          let inst = data[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          // points.push(pos);
          pointsA.push(pos);

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }

        let tubeA = this.addTube(pointsA);
        instancedDan.add(tubeA);
        tubeA.matrixAutoUpdate = false;

        // console.error(matrix, tube.matrix);
        // tube.matrixWorld = matrix * tube.matrix;

        break;
      case 'danB':
        let danBCount = data.length;
        const materialDanB = new MeshStandardMaterial({ color: new Color(0xF2C811).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
        instancedDan = new InstancedMesh(geometry, materialDanB, danBCount);
        instancedDan.type = "InstancedMesh";
        let pointsB =[];

        for (let i = 0; i < danBCount; i++) {
          let inst = data[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          // points.push(pos);
          pointsB.push(pos);

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }

        let tubeB = this.addTube(pointsB);
        instancedDan.add(tubeB);
        tubeB.matrixAutoUpdate = false;
        break;
      case 'danC':
        let danCCount = data.length;
        const materialDanC = new MeshStandardMaterial({ color: new Color(0x006bff).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
        instancedDan = new InstancedMesh(geometry, materialDanC, danCCount);
        instancedDan.type = "InstancedMesh";
        let pointsC = [];

        for (let i = 0; i < danCCount; i++) {
          let inst = data[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          pointsC.push(pos)

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }
        let tubeC = this.addTube(pointsC);
        instancedDan.add(tubeC);
        tubeC.matrixAutoUpdate = false;
        break;
      case 'danD':
        let danDCount = data.length;
        const materialDanD = new MeshStandardMaterial({ color: new Color(0xffffff).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
        instancedDan = new InstancedMesh(geometry, materialDanD, danDCount);
        instancedDan.type = "InstancedMesh";
        let pointsD =[];

        for (let i = 0; i < danDCount; i++) {
          let inst = data[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          pointsD.push(pos)

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }
        let tubeD = this.addTube(pointsD);
        instancedDan.add(tubeD);
        tubeD.matrixAutoUpdate = false;

        break;
    }



    instancedDan.tick = (delta) => {
      // instancedDan.rotation.y += radiansPerSecond * delta;
    }

    return instancedDan;
  }

  addTube(_points) {

    // const pipeSpline = new CatmullRomCurve3( [
    //   new Vector3( 0, 10, - 10 ),
    //   new Vector3( 10, 0, - 10 ),
    //   new Vector3( 20, 0, 0 ),
    //   new Vector3( 30, 0, 10 ),
    //   new Vector3( 30, 0, 20 ),
    //   new Vector3( 20, 0, 30 ),
    //   new Vector3( 10, 0, 30 ),
    //   new Vector3( 0, 0, 30 ),
    // ] );

    console.error(_points);
    // const pipeSpline = new CatmullRomCurve3( [
    //   new Vector3( 0, 0, 0 ),
    //   new Vector3( -0.023828517645597458, 0.9530288577079773, 0.11299587041139603 ),
    //   new Vector3( -0.047657035291194916, 1.9060577154159546, 0.22599174082279205 ),
    //   new Vector3( -0.08095603436231613, 2.8443384170532227, 0.42629188299179077 ),
    //   new Vector3( -0.11425503343343735, 3.7826192378997803, 0.6265920400619507 ),
    //   // new Vector3( 20, 0, 30 ),
    //   // new Vector3( 10, 0, 30 ),
    //   // new Vector3( 0, 0, 30 ),
    // ] );

    const pipeSpline = new CatmullRomCurve3( _points );
    const params = {
      spline: 'PipeSpline',
      extrusionSegments: 100,
      radiusSegments: 10,
      closed: false,
    };

    const tubeGeometry = new TubeBufferGeometry( pipeSpline, params.extrusionSegments, .03, params.radiusSegments, params.closed );
    const material = new MeshLambertMaterial( { color: 0xff00ff } );

    const tube = new Mesh( tubeGeometry, material );
    tube.scale.setScalar(0.1/10);

    return tube;
  }

  /**
   * Random cubes, use normal Mesh
   * @returns {*[]}
   */
  randomCube() {
    let count = 100;
    let cubes=[];

    const geometry = new BoxBufferGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({ color: new Color(0xec173a).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });

    for (let i=0; i< count; i++) {
      const cube = new Mesh(geometry, material);

      cube.position.x = Math.random() * 40 - 20;
      cube.position.y = Math.random() * 40 - 20;
      cube.position.z = Math.random() * 40 - 20;

      cube.rotation.x = Math.random() * 2 * Math.PI;
      cube.rotation.y = Math.random() * 2 * Math.PI;
      cube.rotation.z = Math.random() * 2 * Math.PI;

      cube.layers.enable(1);

      points.push(cube.position); // ok
      cube.tick = (delta) => {
        // increase the cube's rotation each frame
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;

        cube.position.y += radiansPerSecond*delta;
      }

      cubes.push(cube);
    }
    return cubes;
  }

  /**
   * Using InstancedBufferGeometry to generate triangles.
   * @returns {*}
   */
  generateShapes() {
    let dummy = new Object3D();
    const count = 1000;
    const matrix = new Matrix4();
    const vector = new Vector4();
    const positions = [];
    const offsets = [];
    const colors = [];
    const orientationsStart = [];
    const orientationsEnd = [];

    positions.push( 0.025, - 0.025, 0 );
    positions.push( - 0.025, 0.025, 0 );
    positions.push( 0, 0, 0.025 );

    // instanced attributes
    for ( let i = 0; i < count; i ++ ) {

      // offsets
      offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );

      // colors
      colors.push( Math.random(), Math.random(), Math.random(), Math.random() );

      // orientation start
      vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
      vector.normalize();

      orientationsStart.push( vector.x, vector.y, vector.z, vector.w );

      // orientation end

      vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
      vector.normalize();

      orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );
    }

    const geometry = new InstancedBufferGeometry();
    geometry.instanceCount = count;
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'offset', new InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
    geometry.setAttribute( 'color', new InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
    geometry.setAttribute( 'orientationStart', new InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
    geometry.setAttribute( 'orientationEnd', new InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );

    const material = new RawShaderMaterial( {
      uniforms: {
        "time": { value: 1.0 },
        "sineTime": { value: 1.0 }
      },
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
      side: DoubleSide,
      transparent: true
    } );

    // const mesh = new Mesh( geometry, material );
    const mesh = new InstancedMesh( geometry, material, count );
    mesh.type = "InstancedMesh";
    mesh.scale.setScalar(Math.random()*50);

    /*var defaultTransform = new Matrix4().multiply( new Matrix4().makeScale( 0.75, 0.75, 0.75 ) )
    geometry.applyMatrix4( defaultTransform );

    mesh.instanceMatrix.setUsage( DynamicDrawUsage );

    for ( var i = 0; i < count; i++ ) { // Iterate and offset x pos

      var dummyOffset = -100*i;
      dummy.position.copy( new Vector3( 0,-15, dummyOffset ) );
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
      mesh.material.uniforms[ "time" ].value = time * 0.005;
      // mesh.material.uniforms[ "sineTime" ].value = Math.sin( mesh.material.uniforms[ "time" ].value * 0.05 );
    }

    return mesh;
  }

  /**
   * Make line between points
   * @returns {*}
   */
  makeLineBetweenPoints() {
    const material = new LineBasicMaterial( { color: new Color(0xffffff).convertSRGBToLinear(), linewidth: 1, transparent: true, opacity: .1 } );
    const lineGeo = new BufferGeometry().setFromPoints( points );
    const line = new Line( lineGeo, material );

    line.tick = (delta) => {
      line.geometry.setFromPoints(points);
      line.geometry.attributes.position.needsUpdate = true;
    }
    return line;
  }
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

    scale.x = scale.y = scale.z = Math.random() * 20;

    matrix.compose(position, quaternion, scale);

  };
}();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export { Geometries };