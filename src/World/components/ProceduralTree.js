import {
  SphereBufferGeometry,
  BoxBufferGeometry,
  CylinderBufferGeometry,
  TubeBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  MeshStandardMaterial,
  MeshLambertMaterial,
  PointsMaterial,
  MeshBasicMaterial,
  TextureLoader,
  InstancedMesh,
  Mesh,
  Points,
  Group,
  Matrix4,
  Color,
  Vector3,
  Euler,
  Quaternion,
  CatmullRomCurve3,
  MathUtils,
  DynamicDrawUsage,
  Clock
} from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { Tree } from '../../../vendor2/proctree.js'

const DEFAULT_CONFIG = {
  // proctree
  seed:                 10,                  // how many types of tree to generate when reloading, default is 256
  segments:             32,                  // segment to make cylinder trunk, default is 6
  levels:               1,                 // how many branches in each branch
  vMultiplier:          2.36,
  twigScale:            0.39,

  // branch
  initalBranchLength:   1, //0.49,
  lengthFalloffFactor:  1, //0.85,
  lengthFalloffPower:   0.99,
  clumpMax:             0.454,             // draw branches up and down  0~0.5
  clumpMin:             0.404,             // draw branches up and down
  branchFactor:         2.45,
  dropAmount:           -0.2,             // ratio to draw branch down, default is -0.1
  growAmount:           0.235,             // ratio to draw branch up
  sweepAmount:          0.01,

  // trunk
  maxRadius:            0.1/3,             // max radius for trunk, default is 0.139
  climbRate:            0.371,             // distance between branches
  trunkKink:            0.093,
  treeSteps:            13, //5,
  taperRate:            0.947,
  radiusFalloffRate:    0.73,             // radius of branches
  twistRate:            3.02,
  trunkLength:          10,                // height of trunk

  // custom
  // treeColor:            0x9d7362,         // brown
  // twigColor:            0x68AA55
}
const clock = new Clock();
let nEnd = 0;
let nMax, nStep = 90;

class ProceduralTree {

  constructor() {

    this.config = DEFAULT_CONFIG;
    this.textureLoader = new TextureLoader();
    // this.treeMaterial = new MeshStandardMaterial({
    //   color: this.config.treeColor,
    //   roughness: 1.0,
    //   metalness: 0.1,
    // });
    // this.twigMaterial = new MeshStandardMaterial({
    //   color: this.config.twigColor,
    //   roughness: 1.0,
    //   metalness: 0.0,
    //   map: this.textureLoader.load('./assets/twig-3.png'),
    //   alphaTest: 0.9
    // });
  }

  /**
   * Create tree with proctree.js
   * @returns {*}
   */
  createTree (_randomConfig, colorHex) {
    const tree = new Tree(_randomConfig);
    console.error(tree)

    const treeGeometry = new BufferGeometry();
    treeGeometry.setAttribute('position', createFloatAttribute(tree.verts, 3));
    treeGeometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(tree.normals, 3)));
    treeGeometry.setAttribute('uv', createFloatAttribute(tree.UV, 2));
    treeGeometry.setIndex(createIntAttribute(tree.faces, 1));
    console.error(treeGeometry)
    nMax = treeGeometry.attributes.position.count;

    // fixed color
    let colorValue = parseInt ( colorHex.replace("#","0x"), 16 );
    let colored = new Color( colorValue );

    // Random Color
    // let randomColor = new Color( 0xffffff );
    // randomColor.setHex( Math.random() * 0xffffff );
    // colored.setHex( Math.random() * 0xffffff );
    const treeMaterial = new MeshStandardMaterial({
      color: colored,
      roughness: 1.0,
      metalness: 0.1,
      transparent: true,
      opacity: 0
    });

    // const treeGroup = new Group();
    let trunk = new InstancedMesh( treeGeometry, treeMaterial, 4 );
    trunk.type = "InstancedMesh";
    trunk.name = 'TRUNK';

    // console.error(_randomConfig);
    const matrix = new Matrix4();
    for ( let i = 0; i < trunk.count; i ++ ) {
      randomizeMatrix(matrix, _randomConfig.type);
      trunk.setMatrixAt( i, matrix );
      trunk.layers.enable(1);
    }

    trunk.tick = () => {

      if (trunk.material.opacity < .6) {
        trunk.material.opacity += 0.005;
      }

      nEnd = Math.max( nEnd + nStep , nMax);
      treeGeometry.setDrawRange(0, nEnd);
    }

    return trunk;
  }

  createTreeGroup(_groupName, level) {

    let group = new Group();
    group.name = _groupName;

    const defaultConfig = {
      // custom
      type:_groupName,
      seed: 256,
      segments: 6,
      levels: level,
      vMultiplier: 2.36,
      twigScale: 0.39,
      initalBranchLength: 1,
      lengthFalloffFactor: 0.85,
      lengthFalloffPower: 0.99,
      clumpMax: 0.454,
      clumpMin: 0.404,
      branchFactor: 2.45,
      dropAmount: -0.15,
      growAmount: 0.235,
      sweepAmount: MathUtils.randFloat(-0.4, 0.4),
      maxRadius: 0.1/2,
      climbRate: 0.371,
      trunkKink: 0.093,
      treeSteps: 10,
      taperRate: 0.947,
      radiusFalloffRate: 0.73,
      twistRate: 3.02,
      trunkLength: 5,
    }

    switch (_groupName) {
      case 'groupTree1':
        let RANDOM_CONFIG_1 = {
          // custom
          type:                 _groupName,

          // tree
          seed:                 1,
          segments:             6,
          levels:               level,
          vMultiplier:          2.36,
          twigScale:            0.39,

          // branch
          initalBranchLength:   1,
          lengthFalloffFactor:  1,
          lengthFalloffPower:   0.2063940596015426, //  MathUtils.randFloat(0.1, 2.5),
          clumpMax:             0.16209421383523392, // MathUtils.randFloat(0, 1),
          clumpMin:             0.6810886025671663, //  MathUtils.randFloat(0, 0.9),
          branchFactor:         2.2907564173935904, //  MathUtils.randFloat(2, 4),
          dropAmount:           MathUtils.randFloat(-0.2, 0), //-0.2, // ,
          growAmount:           0.235,
          sweepAmount:          MathUtils.randFloat(-.8, .8), //-0.36071267851238353

          // trunk
          maxRadius:            0.1/3,
          climbRate:            0.5282817026061652, //  MathUtils.randFloat(0.05, 0.53),
          trunkKink:            0.20795269167420438, // MathUtils.randFloat(0, 0.8),
          treeSteps:            20,
          taperRate:            0.7556732381848323, //  MathUtils.randFloat(.7, 1),// 0.947,
          radiusFalloffRate:    0.5,
          twistRate:            7.820294672753711, //   MathUtils.randFloat(0, 10), //3.02,
          trunkLength:          4
        }
        let tree1 = this.createTree(defaultConfig, '0xFEFEB1');
        group.add(tree1);
        break;
      case 'groupTree2':
        let RANDOM_CONFIG_2 = {
          // custom
          type:                 _groupName,

          // proctree
          seed:                 1,
          segments:             6,
          levels:               level,
          vMultiplier:          2.36,
          twigScale:            0.39,

          // branch
          initalBranchLength:   1,
          lengthFalloffFactor:  1,
          lengthFalloffPower:   0.19215669933977964, //MathUtils.randFloat(0.1, 2.5),
          clumpMax:             0.33941567348001445, //MathUtils.randFloat(0, 1),
          clumpMin:             0.36128456637215095, //MathUtils.randFloat(0, 0.9),
          branchFactor:         2.440008648155277, // MathUtils.randFloat(2, 4),
          dropAmount:           0.06366507251179093, //MathUtils.randFloat(-0.2, 0.07),
          growAmount:           0.235,
          sweepAmount:          MathUtils.randFloat(-.8, .8), //-0.3108406901825827

          // trunk
          maxRadius:            0.1/3,
          climbRate:            0.47836896861960176, //MathUtils.randFloat(0.05, 0.53),
          trunkKink:            0.09493557972033351, //MathUtils.randFloat(0, 0.8),
          treeSteps:            20,
          taperRate:            0.8145902136162617, //MathUtils.randFloat(.7, 1),
          radiusFalloffRate:    0.5,
          twistRate:            0.6836371783348683, //MathUtils.randFloat(0, 10),
          trunkLength:          4
        }
        let tree2 = this.createTree(defaultConfig, '0xfc4c4e');
        group.add(tree2);
        break;
      case 'groupTree3':
        let RANDOM_CONFIG_3 = {
          // custom
          type:                 _groupName,

          // proctree
          seed:                 1,
          segments:             6,
          levels:               level,
          vMultiplier:          2.36,
          twigScale:            0.39,

          // branch
          initalBranchLength:   1,
          lengthFalloffFactor:  1,
          lengthFalloffPower:   0.357604487749664, //MathUtils.randFloat(0.1, 2.5),
          clumpMax:             0.9790741245992556, //MathUtils.randFloat(0, 1),
          clumpMin:             0.012107264630375791, //MathUtils.randFloat(0, 0.9),
          branchFactor:         2.802448182730217, // MathUtils.randFloat(2, 4),
          dropAmount:           0.01961555265689796, //MathUtils.randFloat(-0.2, 0.07),
          growAmount:           0.235,
          sweepAmount:          MathUtils.randFloat(-.8, .8), //-0.3337564497547323,

          // trunk
          maxRadius:            0.1/3,
          climbRate:            0.4973469993950035, //MathUtils.randFloat(0.05, 0.53),
          trunkKink:            0.09944751108776213, //MathUtils.randFloat(0, 0.8),
          treeSteps:            20,
          taperRate:            0.8478970608839123, //MathUtils.randFloat(.7, 1),
          radiusFalloffRate:    0.5,
          twistRate:            0.8955388844167378, //MathUtils.randFloat(0, 10),
          trunkLength:          4
        }
        let tree3 = this.createTree(defaultConfig, '0x40DFA0');
        group.add(tree3);
        break;
      case 'groupTree4':
        let RANDOM_CONFIG_4 = {
          // custom
          type:                 _groupName,

          // proctree
          seed:                 1,
          segments:             6,
          levels:               level,
          vMultiplier:          2.36,
          twigScale:            0.39,

          // branch
          initalBranchLength:   1,
          lengthFalloffFactor:  1,
          lengthFalloffPower:   0.8013271560162166, //MathUtils.randFloat(0.1, 2.5),
          clumpMax:             0.8493598951700212, //MathUtils.randFloat(0, 1),
          clumpMin:             0.06630050601993505, //MathUtils.randFloat(0, 0.9),
          branchFactor:         3.6234691184720123, // MathUtils.randFloat(2, 4),
          dropAmount:           -0.14905403848433774, //MathUtils.randFloat(-0.2, 0.07), //-0.2,
          growAmount:           0.235,
          sweepAmount:          MathUtils.randFloat(-.8, .8), //-0.5293518388238034,

          // trunk
          maxRadius:            0.1/3,
          climbRate:            0.4251183790857488, // MathUtils.randFloat(0.05, 0.53), //0.371,
          trunkKink:            0.14079340037449148, //MathUtils.randFloat(0, 0.8), //0.093,
          treeSteps:            20,
          taperRate:            0.9369354433191494, //MathUtils.randFloat(.7, 1),// 0.947,
          radiusFalloffRate:    0.5,
          twistRate:            8.83780839441161, //MathUtils.randFloat(0, 10), //3.02,
          trunkLength:          4
        }
        let tree4 = this.createTree(defaultConfig, '0xFF7AE9');
        group.add(tree4);
      break;
    }

    // group.tick = () => {
    //   group.children.forEach(tree => {
    //     if (tree.material.opacity < .6) {
    //       tree.material.opacity += 0.005;
    //     }
    //   })
    // };
    // return group;

    return group;
  }

  /*combineBuffer(model, bufferName) {
    let count = 0;
    model.traverse(function(child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];
        count += buffer.array.length;
      }
    });

    const combined = new Float32Array(count);
    let offset = 0;
    model.traverse(function(child) {
      if (child.isMesh) {
        const buffer = child.geometry.attributes[bufferName];
        combined.set(buffer.array, offset);
        offset += buffer.array.length;
      }
    });

    return new BufferAttribute(combined, 3);
  }

  createMesh(tree, scale, x, y, z, color) {

    console.error(tree.geometry)
    // const geometry = new BufferGeometry();
    // geometry.setAttribute('position', positions.clone());
    // tree.geometry.setAttribute('initialPosition', tree.geometry.attributes.position.clone());
    // tree.geometry.attributes.position.setUsage( DynamicDrawUsage );

    let mesh;
    let meshes = [];

    // mesh = new Points(geometry, treeMaterial);

    meshes.push({
      mesh: tree, verticesDown: 0, verticesUp: 0, direction: 0, speed: 5/2, delay: Math.floor(200 + 200 * Math.random()),
      start: Math.floor(100 + 200 * Math.random()),
    });

    tree.tick = () => {
      let delta = 10 * clock.getDelta();
      delta = delta < 2 ? delta : 2;

      // for (let j = 0; j < meshes.length; j++) {

        // const data = meshes[j];
        const positions = tree.geometry.attributes.position;
        const initialPositions = tree.geometry.attributes.initialPosition;
        const count = positions.count;

        if (data.start > 0) {
          data.start -= 1;
        } else {
          if (data.direction === 0) {
            data.direction = -1;
          }
        }

        for (let i = 0; i < count; i++) {

          const px = positions.getX(i);
          const py = positions.getY(i);
          const pz = positions.getZ(i);

          // // falling down
          // if (data.direction < 0) {
          //
          //   if (py > 0) {
          //     positions.setXYZ(
          //         i,
          //         px + 1.5 * (0.50 - Math.random()) * data.speed * delta,
          //         py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
          //         pz + 1.5 * (0.50 - Math.random()) * data.speed * delta,
          //     );
          //   } else {
          //     data.verticesDown += 1;
          //   }
          // }
          //
          // // rising up
          // if (data.direction > 0) {
          //
          //   const ix = initialPositions.getX(i);
          //   const iy = initialPositions.getY(i);
          //   const iz = initialPositions.getZ(i);
          //
          //   const dx = Math.abs(px - ix);
          //   const dy = Math.abs(py - iy);
          //   const dz = Math.abs(pz - iz);
          //
          //   const d = dx + dy + dx;
          //
          //   if (d > 1) {
          //
          //     positions.setXYZ(
          //         i,
          //         px - (px - ix) / dx * data.speed * delta * (0.85 - Math.random()),
          //         py - (py - iy) / dy * data.speed * delta * (1 + Math.random()),
          //         pz - (pz - iz) / dz * data.speed * delta * (0.85 - Math.random()),
          //     );
          //
          //   } else {
          //
          //     data.verticesUp += 1;
          //
          //   }
          //
          // }
        }

        // all vertices down
        if (data.verticesDown >= count) {

          if (data.delay <= 0) {

            data.direction = 1;
            data.speed = 5;
            data.verticesDown = 0;
            data.delay = 320;

          } else {

            data.delay -= 1;

          }

        }

        // all vertices up
        if (data.verticesUp >= count) {

          if (data.delay <= 0) {

            data.direction = -1;
            data.speed = 2;
            data.verticesUp = 0;
            data.delay = 120;

          } else {

            data.delay -= 1;

          }

        }

        positions.needsUpdate = true;
      // }
    }

    return tree;
  }*/

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
        branchs.push(branchA , branchB, branchC, branchD);

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
    let tube;

    switch (branch) {
      case 'danA':
        let danACount = data.length;
        const materialDanA = new MeshStandardMaterial({ color: new Color(0xec173a).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });
        instancedDan = new InstancedMesh(geometry, materialDanA, danACount);
        instancedDan.type = "InstancedMesh";
        let pointsA=[];

        for (let i = 0; i < danACount; i++) {
          let inst = data[i];
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]); // points
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          pointsA.push(pos);

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }

        // add tube into instance mesh
        tube = this.addTube(pointsA);
        // instancedDan.add(tubeA);
        // tubeA.matrixAutoUpdate = false;

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
          pointsB.push(pos);

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }

        tube = this.addTube(pointsB);
        // instancedDan.add(tubeB);
        // tubeB.matrixAutoUpdate = false;
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

        tube = this.addTube(pointsC);
        // instancedDan.add(tubeC);
        // tubeC.matrixAutoUpdate = false;
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

        tube = this.addTube(pointsD);
        // instancedDan.add(tubeD);
        // tubeD.matrixAutoUpdate = false;
        break;
    }

    // instancedDan.tick = (delta) => {
    //    instancedDan.rotation.y += radiansPerSecond * delta;
    // }

    return tube;
  }

  /**
   * Create tube as branch of the tree.
   * @param _points
   * @returns {*}
   */
  addTube(_points) {

    // const pipeSpline = new CatmullRomCurve3( _points );
    const params = {
      spline: 'PipeSpline',
      extrusionSegments: 100,
      radiusSegments: 10,
      closed: false,
    };
    // const tubeGeometry = new TubeBufferGeometry( pipeSpline, params.extrusionSegments, .03, params.radiusSegments, params.closed );
    // const material = new MeshLambertMaterial( { color: 0x9B2B27 } );
    // const tube = new Mesh( tubeGeometry, material );
    // tube.scale.setScalar(5);
    // tube.position.y =-10;

    var nEnd = 0;
    let nMax;
    let nStep = 90; // 30 faces * 3 vertices/face

    // Tube path
    var path = new CatmullRomCurve3( _points );
    var geometry = new TubeBufferGeometry(path, params.extrusionSegments, 0.05, params.radiusSegments, params.closed );

    // line bufferGeo
    nMax = geometry.attributes.position.count;
    const material = new MeshLambertMaterial( { color: 0x9B2B27 } );
    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    const tube = new Mesh( geometry, material );
    tube.scale.setScalar(3);
    tube.position.y = -20;

    // render
    tube.tick = () => {

      //nEnd = ( nEnd + nStep ) % nMax;
      nEnd = Math.max( nEnd + nStep , nMax);
      tube.geometry.setDrawRange( 0, nEnd );
      geometry.verticesNeedUpdate = true;
    }

    /*var points = [];
    var height = 10;
    var count = 20;
    for (var i = 0; i < count; i++) {
      //Push the vertex coordinates into the array
      let randomX = (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12;
      let randomY = ( i - count ) + count / 2;
      points.push(new Vector3(randomX, randomY, 0));
    }

    console.log(points)

    // Instantiate a THREE.LatheGeometry and set related information
    var latheGeometry = new LatheGeometry(points, 120, 2, 2 * Math.PI);
    latheGeometry.dynamic = true;
    latheGeometry.verticesNeedUpdate = true;

    nMax = latheGeometry.attributes.position.count;

    const material = new MeshLambertMaterial( { color: 0x9B2B27 } );
    // Instantiate the material of a normal vector
    material.side = DoubleSide; //Set both sides to be visible

    // Assign both materials to the geometry
    var lathe = new Mesh(latheGeometry, material);

    lathe.tick = () => {
      nEnd = Math.max( nEnd + nStep , nMax);
      latheGeometry.setDrawRange( 0, nEnd );
      latheGeometry.verticesNeedUpdate = true;
    }*/

    return tube;
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

  return function(matrix, type) {

    switch (type) {
      case 'groupTree1':
        position.x = ( Math.random() * 1 - 60 );
        position.y = -40;
        position.z = ( Math.random() * 1 - 3 );
        break;
      case 'groupTree2':
        position.x = ( Math.random() * 1 - 15 );
        position.y = -40;
        position.z = ( Math.random() * 1 - 3 );
        break;
      case 'groupTree3':
        position.x = ( Math.random() * 1 + 20 );
        position.y = -40;
        position.z = ( Math.random() * 1 - 3 );
        break;
      case 'groupTree4':
        position.x = ( Math.random() * 1 + 60 );
        position.y = -40;
        position.z = ( Math.random() * 1 - 3 );
        break;
    }

    rotation.x = 0;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = 0;
    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = 8;

    matrix.compose(position, quaternion, scale);
  };
}();

function createFloatAttribute (array, itemSize) {
  const typedArray = new Float32Array(Tree.flattenArray(array));
  return new BufferAttribute(typedArray, itemSize);
}

function createIntAttribute (array, itemSize) {
  const typedArray = new Uint16Array(Tree.flattenArray(array));
  return new BufferAttribute(typedArray, itemSize);
}

function normalizeAttribute (attribute) {
  var v = new Vector3();
  for (var i = 0; i < attribute.count; i++) {
    v.set(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
    v.normalize();
    attribute.setXYZ(i, v.x, v.y, v.z);
  }
  return attribute;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export { ProceduralTree }
