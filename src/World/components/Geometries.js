import {
  BoxBufferGeometry,
  SphereBufferGeometry,
  TetrahedronBufferGeometry,
  BufferGeometry,
  InstancedBufferGeometry,
  ShaderMaterial,
  MeshStandardMaterial,
  LineBasicMaterial,
  RawShaderMaterial,
  MeshLambertMaterial,
  MeshPhysicalMaterial,
  Line,
  Mesh,
  InstancedMesh,
  MathUtils,
  Color,
  Vector3,Points,
  Quaternion,DynamicDrawUsage,TextureLoader,AdditiveBlending,FrontSide, BackSide,
  Euler, Matrix4,DoubleSide,Float32BufferAttribute,InstancedBufferAttribute,Vector4,Object3D,BufferAttribute
} from "https://unpkg.com/three@0.130.0/build/three.module.js";

const radiansPerSecond = MathUtils.degToRad(30);
let points= [];

class Geometries {

  constructor() {}

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

      /*let radius = Math.random();
      radius = Math.pow(Math.sin(radius * Math.PI / 2), 0.8);
      let alpha = Math.random()* 3.14 * 20;
      let delta = Math.random()* 3.14 * 40;

      // generate position in sphere shape
      const randomX = radius * Math.cos(delta) * Math.sin(alpha);
      const randomY = radius * Math.sin(delta) * Math.sin(alpha);
      const randomZ = radius * Math.cos(alpha);*/

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

    console.error(particleSystem)

    particleSystem.tick = (delta) => {
      const time = Date.now() * 0.002;

      const sizes = geometry.attributes.size.array;
      for ( let i = 0; i < particleCount; i ++ ) {
        // sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );
        sizes[ i ] = 4 * ( 1 + Math.sin( 0.1 * i + time ) );
      }
      geometry.attributes.size.needsUpdate = true;
    }

    return particleSystem;
  }

  /**
   * Generate cubes using Instaned Mesh and makes lines
   * @returns {*}
   */
  instanceShapes() {
    const matrix = new Matrix4();
    const color = new Color();
    let amount = 10;
    const dummy = new Object3D();

    const geometry = new TetrahedronBufferGeometry(0.8, 0);
    const material = new MeshStandardMaterial({ roughness: 0.4,metalness: 0.1, transparent: true, opacity: 1 });

    let shapes = new InstancedMesh( geometry, material, 10 );
    shapes.type = "InstancedMesh";
    shapes.instanceMatrix.setUsage(DynamicDrawUsage ); // will be updated every frame
    shapes.castShadow = true;
    shapes.receiveShadow = true;

    for ( let i = 0; i < shapes.count; i ++ ) {

      /*let radius = Math.random();
      radius = Math.pow(Math.sin(radius * Math.PI / 2), 0.8);
      let alpha = Math.random()* 3.14;
      let delta = Math.random()* 3.14 * 2;

      // generate position in sphere shape
      matrix.setPosition( radius * Math.cos(delta) * Math.sin(alpha), radius * Math.sin(delta) * Math.sin(alpha), radius * Math.cos(alpha) );*/

      // genertate position in cube shape
      // matrix.setPosition( Math.random()*2 - 1, Math.random()*2-1, Math.random()*2 - 0.5 );
      let randomX = Math.random()*40 - 20;
      let randomY = Math.random()*30 - 10;
      let randomZ = Math.random()*20 - 10;
      matrix.setPosition( randomX, randomY , randomZ );
      shapes.setMatrixAt( i, matrix );
      let identity = new Matrix4().identity();
      shapes.getMatrixAt(i, identity);

      // Get position of each instance and push into points.
      var vec = new Vector3();
      vec.setFromMatrixPosition( identity );
      points.push(vec);

      shapes.setColorAt( i, color.setHex( 0xffffff * Math.random() ) );
    }

    shapes.tick = (delta) => {

      /*const time = Date.now() * 0.001;
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
      boxes.instanceMatrix.needsUpdate = true;*/
    }

    return shapes;
  }

  /**
   * Random cubes, use normal Mesh
   * @returns {*[]}
   */
  randomCube() {
    let count = 100;
    let cubes=[];
    const matrix = new Matrix4();

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

      points.push(cube.position);
      cube.tick = (delta) => {
        // increase the cube's rotation each frame
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;
      }

      cubes.push(cube);
    }
    return cubes;
  }

  /*createCube() {
    const geometry = new BoxBufferGeometry(2, 2, 2);
    const material = new MeshStandardMaterial({ color: new Color(0xec173a).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
    const cube = new Mesh(geometry, material);
    cube.name = 'Cube';
    cube.position.set(0, 10, 0);
    cube.rotation.set(-0.5, -0.1, -0.5);
    points.push(cube.position);

    // this method will be called once per frame
    cube.tick = (delta) => {
      let timestamp = new Date() * 0.0005; // test

      // increase the cube's rotation each frame
      cube.rotation.z += radiansPerSecond * delta;
      cube.rotation.x += radiansPerSecond * delta;
      cube.rotation.y += radiansPerSecond * delta;

      cube.position.x = Math.cos(timestamp) * 7;
      cube.position.z = Math.sin(timestamp) * 7;
    }
    return cube;
  }

  createSphere() {
    const geometry = new SphereBufferGeometry(1.5, 32, 32);
    const material = new MeshStandardMaterial({ color: new Color(0xF2C811).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
    const sphere = new Mesh(geometry, material);
    sphere.position.set(2, 0, 0);
    points.push(sphere.position);

    sphere.tick = (delta) => {
      let timestamp = new Date() * 0.0005; // test

      sphere.rotation.z += radiansPerSecond * delta;
      sphere.rotation.x += radiansPerSecond * delta;
      sphere.rotation.y += radiansPerSecond * delta;

      sphere.position.x = Math.cos(timestamp * 2) * 5;
      sphere.position.y = Math.sin(timestamp * 2) * 5;
    };

    return sphere;
  }

  createTetrahedron() {

    const geometry = new TetrahedronBufferGeometry(2, 0);
    const material = new MeshStandardMaterial({ color: new Color(0x006bff).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
    const tetrahedron = new Mesh(geometry, material);
    tetrahedron.position.set(-20, 0, 0);
    tetrahedron.rotation.set(-0.5, -0.1, -0.5);
    points.push(tetrahedron.position);

    tetrahedron.tick = (delta) => {
      let timestamp = new Date() * 0.0005; // test

      tetrahedron.rotation.z += radiansPerSecond * delta;
      tetrahedron.rotation.x += radiansPerSecond * delta;
      tetrahedron.rotation.y += radiansPerSecond * delta;

      tetrahedron.position.x = Math.cos(timestamp * 2) * 9;
      tetrahedron.position.y = Math.sin(timestamp * 2) * 9;
    }

    return tetrahedron;
  }*/

  /**
   * Make line between points
   * @returns {*}
   */
  makeLineBetweenPoints() {
    const material = new LineBasicMaterial( { color: new Color(0xffffff).convertSRGBToLinear(), linewidth: 10, transparent: true, opacity: .3 } );
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

export { Geometries };