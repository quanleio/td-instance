import {
  SphereBufferGeometry,
  BoxBufferGeometry,
  TubeBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  MeshStandardMaterial,
  MeshLambertMaterial,
  TextureLoader,
  InstancedMesh,
  Mesh,
  Group,
  Matrix4,
  Color,
  Vector3,
  CatmullRomCurve3
} from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { Tree } from '../../../vendor2/proctree.js'

const DEFAULT_CONFIG = {
  // proctree
  seed:                 1,                  // how many types of tree to generate when reloading, default is 256
  segments:             6,                  // segment to make cylinder trunk, default is 6
  levels:               10,                 // how many branches in each branch
  vMultiplier:          2.36,
  twigScale:            0.39,

  // branch
  initalBranchLength:   1, //0.49,
  lengthFalloffFactor:  0.85,
  lengthFalloffPower:   0.99,
  clumpMax:             0.454,             // draw branches up and down
  clumpMin:             0.404,             // draw branches up and down
  branchFactor:         2.45,
  dropAmount:           0.1/4,             // ratio to draw branch down, default is -0.1
  growAmount:           0.235,             // ratio to draw branch up
  sweepAmount:          0.01,

  // trunk
  maxRadius:            0.1/8,             // max radius for trunk, default is 0.139
  climbRate:            0.371,             // distance between branches
  trunkKink:            0.093,
  treeSteps:            5,
  taperRate:            0.947,
  radiusFalloffRate:    0.73,             // radius of branches
  twistRate:            3.02,
  trunkLength:          1,                // height of trunk

  // custom
  // treeColor:            0x9d7362,         // brown
  twigColor:            0x68AA55
}

class ProceduralTree {

  constructor() {

    this.config = DEFAULT_CONFIG;
    this.textureLoader = new TextureLoader();
    // this.treeMaterial = new MeshStandardMaterial({
    //   color: this.config.treeColor,
    //   roughness: 1.0,
    //   metalness: 0.1,
    // });
    this.twigMaterial = new MeshStandardMaterial({
      color: this.config.twigColor,
      roughness: 1.0,
      metalness: 0.0,
      map: this.textureLoader.load('./assets/twig-3.png'),
      alphaTest: 0.9
    });
  }

  /**
   * Create tree with proctree.js
   * @returns {*}
   */
  createTree (colorHex) {
    const tree = new Tree(this.config);

    const treeGeometry = new BufferGeometry();
    treeGeometry.setAttribute('position', createFloatAttribute(tree.verts, 3));
    treeGeometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(tree.normals, 3)));
    treeGeometry.setAttribute('uv', createFloatAttribute(tree.UV, 2));
    treeGeometry.setIndex(createIntAttribute(tree.faces, 1));

    const twigGeometry = new BufferGeometry();

    let colorValue = parseInt ( colorHex.replace("#","0x"), 16 );
    let colored = new Color( colorValue );

    // Random Color
    // let color = new Color( 0xffffff );
    // color.setHex( Math.random() * 0xffffff );
    const treeMaterial = new MeshStandardMaterial({
      color: colored,
      roughness: 1.0,
      metalness: 0.1,
    });
    twigGeometry.setAttribute('position', createFloatAttribute(tree.vertsTwig, 3));
    twigGeometry.setAttribute('normal', normalizeAttribute(createFloatAttribute(tree.normalsTwig, 3)));
    twigGeometry.setAttribute('uv', createFloatAttribute(tree.uvsTwig, 2));
    twigGeometry.setIndex(createIntAttribute(tree.facesTwig, 1));

    const treeGroup = new Group();
    const trunk = new Mesh(treeGeometry, treeMaterial);
    trunk.name = 'TRUNK';
    trunk.layers.enable(1);

    // const twig = new Mesh(twigGeometry, this.twigMaterial);
    // twig.name = 'TWIG';
    // twig.layers.enable(1);
    treeGroup.add(trunk);

    // treeGroup.position.set(0, -27, 0)
    treeGroup.scale.setScalar(8)
    // treeGroup.rotateY(Math.PI/180 * 100)

    treeGroup.tick = () => {

    }

    return treeGroup;
  }

  createNewBranch(_tree) {

    console.warn(_tree.children[0])
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
          let pos = new Vector3(inst["tx"], inst["ty"], inst["tz"]);
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
    nMax = geometry.attributes.position.count;
    const material = new MeshLambertMaterial( { color: 0x9B2B27 } );
    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    const tube = new Mesh( geometry, material );
    tube.scale.setScalar(3);
    tube.position.y = -20;

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

export { ProceduralTree }
