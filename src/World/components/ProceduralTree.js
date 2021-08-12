import { Tree } from "../../../vendor/proctree.js";

const DEFAULT_CONFIG = {
  seed: 256,
  segments: 6,
  levels: 6,
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
  sweepAmount: THREE.MathUtils.randFloat(-0.4, 0.4),
  maxRadius: 0.1 / 2,
  climbRate: 0.371,
  trunkKink: 0.093,
  treeSteps: 10,
  taperRate: 0.947,
  radiusFalloffRate: 0.73,
  twistRate: 3.02,
  trunkLength: 5,

  // custom
  // treeColor:            0x9d7362,
  twigColor: 0x68aa55,
};
let nEnd = 0;
let nMax,
  nStep = 90;

let figureShape = {
  Structure: 1,
  prev: 0,
  angle: 22, // Angle in degrees, gets converted into radiance in turtle during rendering
  'n (Iterations)': 4, // Number of iterations when generating sentence
  Axiom: 'F',
};
let rules = [];
let sentence = figureShape.Axiom;
let colorMaterial = [];
colorMaterial[0] = new THREE.MeshLambertMaterial({color: 0xcf2734});
colorMaterial[1] = new THREE.MeshLambertMaterial({color: 0xffffff});
colorMaterial[2] = new THREE.MeshLambertMaterial({color: 0x009343});
let currentColorIndex = 0;



class ProceduralTree {
  constructor() {
    this.config = DEFAULT_CONFIG;
    this.textureLoader = new THREE.TextureLoader();
    this.twigMaterial = new THREE.MeshStandardMaterial({
      color: this.config.twigColor,
      roughness: 1.0,
      metalness: 0.0,
      map: this.textureLoader.load("./assets/twig-3.png"),
      alphaTest: 0.9,
    });
  }

  /**
   * Create tree with proctree.js
   * @returns {*}
   */
  createTree(_randomConfig, colorHex) {
    const tree = new Tree(_randomConfig);
    console.error(tree);

    // trunk
    const treeGeometry = new THREE.BufferGeometry();
    treeGeometry.setAttribute("position", createFloatAttribute(tree.verts, 3));
    treeGeometry.setAttribute("normal",normalizeAttribute(createFloatAttribute(tree.normals, 3)));
    treeGeometry.setAttribute("uv", createFloatAttribute(tree.UV, 2));
    treeGeometry.setIndex(createIntAttribute(tree.faces, 1));
    // console.error(treeGeometry);
    nMax = treeGeometry.attributes.position.count;

    // Color
    let colorValue = parseInt(colorHex.replace("#", "0x"), 16);
    let colored = new THREE.Color(colorValue);
    colored.setHex( Math.random() * 0xffffff );

    // Random Color
    // let randomColor = new THREE.Color( 0xffffff );
    // randomColor.setHex( Math.random() * 0xffffff );
    const treeMaterial = new THREE.MeshStandardMaterial({
      color: colored,
      transparent: true,
      opacity: 0,
    });

    let trunk = new THREE.InstancedMesh(treeGeometry, treeMaterial, 4);
    trunk.type = "InstancedMesh";
    trunk.name = "TRUNK";

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < trunk.count; i++) {
      randomizeMatrix(matrix, _randomConfig.type);
      trunk.setMatrixAt(i, matrix);
      trunk.layers.enable(1);
    }

    trunk.tick = (delta) => {
      if (trunk.material.opacity < 0.6) {
        trunk.material.opacity += 0.005;
      }

      nEnd = Math.max(nEnd + nStep, nMax);
      treeGeometry.setDrawRange(0, nEnd);

      // let timestamp = new Date() * 0.0005;
      // const angle = this.map(Math.sin(timestamp * 0.001 + Math.random() * 2), -1, 1, -this.rad(5), this.rad(5));
      // trunk.rotation.y = angle * 3;
      // trunk.rotation.z = angle;

    };

    return trunk;
  }

  map = (value, sMin, sMax, dMin, dMax) => {
    return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
  };
  rad = (deg) => (deg / 180) * Math.PI;

  /**
   * Create group of tree. Each group has 4 trees.
   * @param _groupName
   * @param level
   * @returns {*}
   */
  createTreeGroup(_groupName, level) {
    let group = new THREE.Group();
    group.name = _groupName;

    DEFAULT_CONFIG.type = _groupName;

    switch (_groupName) {
      case "groupTree1":
        let RANDOM_CONFIG_1 = {
          // custom
          type: _groupName,

          // tree
          seed: 1,
          segments: 6,
          levels: level,
          vMultiplier: 2.36,
          twigScale: 0.39,

          // branch
          initalBranchLength: 1,
          lengthFalloffFactor: 1,
          lengthFalloffPower: 0.2063940596015426, //  THREE.MathUtils.randFloat(0.1, 2.5),
          clumpMax: 0.16209421383523392, // THREE.MathUtils.randFloat(0, 1),
          clumpMin: 0.6810886025671663, //  THREE.MathUtils.randFloat(0, 0.9),
          branchFactor: 2.2907564173935904, //  THREE.MathUtils.randFloat(2, 4),
          dropAmount: THREE.MathUtils.randFloat(-0.2, 0), //-0.2, // ,
          growAmount: 0.235,
          sweepAmount: THREE.MathUtils.randFloat(-0.8, 0.8), //-0.36071267851238353

          // trunk
          maxRadius: 0.1 / 3,
          climbRate: 0.5282817026061652, //  THREE.MathUtils.randFloat(0.05, 0.53),
          trunkKink: 0.20795269167420438, // THREE.MathUtils.randFloat(0, 0.8),
          treeSteps: 20,
          taperRate: 0.7556732381848323, //  THREE.MathUtils.randFloat(.7, 1),// 0.947,
          radiusFalloffRate: 0.5,
          twistRate: 7.820294672753711, //   THREE.MathUtils.randFloat(0, 10), //3.02,
          trunkLength: 4,
        };
        let tree1 = this.createTree(DEFAULT_CONFIG, "0xFEFEB1");
        group.add(tree1);
        break;
      case "groupTree2":
        let RANDOM_CONFIG_2 = {
          // custom
          type: _groupName,

          // proctree
          seed: 1,
          segments: 6,
          levels: level,
          vMultiplier: 2.36,
          twigScale: 0.39,

          // branch
          initalBranchLength: 1,
          lengthFalloffFactor: 1,
          lengthFalloffPower: 0.19215669933977964, //THREE.MathUtils.randFloat(0.1, 2.5),
          clumpMax: 0.33941567348001445, //THREE.MathUtils.randFloat(0, 1),
          clumpMin: 0.36128456637215095, //THREE.MathUtils.randFloat(0, 0.9),
          branchFactor: 2.440008648155277, // THREE.MathUtils.randFloat(2, 4),
          dropAmount: 0.06366507251179093, //THREE.MathUtils.randFloat(-0.2, 0.07),
          growAmount: 0.235,
          sweepAmount: THREE.MathUtils.randFloat(-0.8, 0.8), //-0.3108406901825827

          // trunk
          maxRadius: 0.1 / 3,
          climbRate: 0.47836896861960176, //THREE.MathUtils.randFloat(0.05, 0.53),
          trunkKink: 0.09493557972033351, //THREE.MathUtils.randFloat(0, 0.8),
          treeSteps: 20,
          taperRate: 0.8145902136162617, //THREE.MathUtils.randFloat(.7, 1),
          radiusFalloffRate: 0.5,
          twistRate: 0.6836371783348683, //THREE.MathUtils.randFloat(0, 10),
          trunkLength: 4,
        };
        let tree2 = this.createTree(DEFAULT_CONFIG, "0xfc4c4e");
        group.add(tree2);
        break;
      case "groupTree3":
        let RANDOM_CONFIG_3 = {
          // custom
          type: _groupName,

          // proctree
          seed: 1,
          segments: 6,
          levels: level,
          vMultiplier: 2.36,
          twigScale: 0.39,

          // branch
          initalBranchLength: 1,
          lengthFalloffFactor: 1,
          lengthFalloffPower: 0.357604487749664, //THREE.MathUtils.randFloat(0.1, 2.5),
          clumpMax: 0.9790741245992556, //THREE.MathUtils.randFloat(0, 1),
          clumpMin: 0.012107264630375791, //THREE.MathUtils.randFloat(0, 0.9),
          branchFactor: 2.802448182730217, // THREE.MathUtils.randFloat(2, 4),
          dropAmount: 0.01961555265689796, //THREE.MathUtils.randFloat(-0.2, 0.07),
          growAmount: 0.235,
          sweepAmount: THREE.MathUtils.randFloat(-0.8, 0.8), //-0.3337564497547323,

          // trunk
          maxRadius: 0.1 / 3,
          climbRate: 0.4973469993950035, //THREE.MathUtils.randFloat(0.05, 0.53),
          trunkKink: 0.09944751108776213, //THREE.MathUtils.randFloat(0, 0.8),
          treeSteps: 20,
          taperRate: 0.8478970608839123, //THREE.MathUtils.randFloat(.7, 1),
          radiusFalloffRate: 0.5,
          twistRate: 0.8955388844167378, //THREE.MathUtils.randFloat(0, 10),
          trunkLength: 4,
        };
        let tree3 = this.createTree(DEFAULT_CONFIG, "0x40DFA0");
        group.add(tree3);
        break;
      case "groupTree4":
        let RANDOM_CONFIG_4 = {
          // custom
          type: _groupName,

          // proctree
          seed: 1,
          segments: 6,
          levels: level,
          vMultiplier: 2.36,
          twigScale: 0.39,

          // branch
          initalBranchLength: 1,
          lengthFalloffFactor: 1,
          lengthFalloffPower: 0.8013271560162166, //THREE.MathUtils.randFloat(0.1, 2.5),
          clumpMax: 0.8493598951700212, //THREE.MathUtils.randFloat(0, 1),
          clumpMin: 0.06630050601993505, //THREE.MathUtils.randFloat(0, 0.9),
          branchFactor: 3.6234691184720123, // THREE.MathUtils.randFloat(2, 4),
          dropAmount: -0.14905403848433774, //THREE.MathUtils.randFloat(-0.2, 0.07), //-0.2,
          growAmount: 0.235,
          sweepAmount: THREE.MathUtils.randFloat(-0.8, 0.8), //-0.5293518388238034,

          // trunk
          maxRadius: 0.1 / 3,
          climbRate: 0.4251183790857488, // THREE.MathUtils.randFloat(0.05, 0.53), //0.371,
          trunkKink: 0.14079340037449148, //THREE.MathUtils.randFloat(0, 0.8), //0.093,
          treeSteps: 20,
          taperRate: 0.9369354433191494, //THREE.MathUtils.randFloat(.7, 1),// 0.947,
          radiusFalloffRate: 0.5,
          twistRate: 8.83780839441161, //THREE.MathUtils.randFloat(0, 10), //3.02,
          trunkLength: 4,
        };
        let tree4 = this.createTree(DEFAULT_CONFIG, "0xFF7AE9");
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

  makeGroupTree() {
    let groupTree = [];

    const randomColors = {
      red : 0xF2003C,
      pink: 0xff0082,
      green: 0x0AE500,
      purple: 0x5109ae,
      blue: 0x003590,
      orange: 0xc30000,
    };
    let colorsLength = Object.keys(randomColors).length;
    const getRandomColor = () => {
      var colIndx = Math.floor(Math.random()*colorsLength);
      var colorStr = Object.keys(randomColors)[colIndx];
      return randomColors[colorStr];
    }

    let tree1 = this.genDraw();
    // tree1.position.set(-40, 0, 0);
    // tree1.material.color = new THREE.Color().setHex(getRandomColor())
    tree1.material.color = new THREE.Color().setHex(0xffffff * Math.random())

    // let tree2 = this.genDraw();
    // tree2.position.set(0, 0, 0);
    // tree2.material.color = new THREE.Color().setHex(0xffffff * Math.random())

    // let tree3 = this.genDraw();
    // tree3.position.set(20, 0, 0);
    // tree3.material.color = new THREE.Color().setHex(0xffffff * Math.random())

    // let tree4 = this.genDraw();
    // tree4.position.set(40, 0, 0);
    // tree4.material.color = new THREE.Color().setHex(0xffffff * Math.random())

    groupTree.push(tree1);
    return groupTree;
  }

  genDraw() {
    this.rulechange();

    sentence = figureShape.Axiom;
    let interation = figureShape["n (Iterations)"];

    for (let i = 0; i < interation ; i++) {
      this.generate();
    }

    return this.turtle()
  }

  rulechange() {

    rules = [];

    if (figureShape.Structure === 1) {
      figureShape.angle = 22; // Conversion from degrees to radians
      figureShape['n (Iterations)'] = 4; // Number of iterations when generating sentence
      figureShape.Axiom = 'F';

      rules[0] = {
        a: 'F',
        b: 'F´[+F´]F´[-F´]/F´',
        c: 'F´[+F´]^F´',
        d: 'F´+F´/F´',
        bpro: 33,
        cpro: 33,
      };
    }
  }
  generate() {
    let nextSentence = '';
    for (let i = 0; i < sentence.length; i++) {
      let current = sentence.charAt(i);
      let found = false;
      for (let j = 0; j < rules.length; j++) {
        if (current === rules[j].a) {
          found = true;
          let rand = Math.floor(Math.random() * 101);
          if (rand < rules[j].bpro) {
            nextSentence += rules[j].b;
          }
          else if (rand < rules[j].bpro + rules[j].cpro) {
            nextSentence += rules[j].c;
          }
          else {
            nextSentence += rules[j].d;
          }
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    sentence = nextSentence;
    // console.log(sentence);
  }
  turtle() {

    console.error('generate turtle')
    let angle = figureShape.angle * Math.PI / 180;
    let turtle = {
      pos: new THREE.Vector3(0, -10, 0), // position of the tree
      // Up, Left, Head, can be compared to yaw, pitch, roll
      hlu: new THREE.Matrix3().set(
          0, 1, 0,
          1, 0, 0,
          0, 0, -1 ),
      len: 1,
      scalar: 1,
    };

    // Stack
    let turtleHistory = [turtle];

    let trunks = [];

    // Rotational matrices
    let RuPos = new THREE.Matrix3().set(Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0, 1);
    let RuNeg = new THREE.Matrix3().set(Math.cos(-angle), Math.sin(-angle), 0, -Math.sin(-angle), Math.cos(-angle), 0, 0, 0, 1);
    let RlPos = new THREE.Matrix3().set(Math.cos(angle), 0, -Math.sin(angle), 0, 1, 0, Math.sin(angle), 0, Math.cos(angle));
    let RlNeg = new THREE.Matrix3().set(Math.cos(-angle), 0, -Math.sin(-angle), 0, 1, 0, Math.sin(-angle), 0, Math.cos(-angle));
    let RhPos = new THREE.Matrix3().set(1, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle));
    let RhNeg = new THREE.Matrix3().set(1, 0, 0, 0, Math.cos(-angle), -Math.sin(-angle), 0, Math.sin(-angle), Math.cos(-angle));
    let Ru180 = new THREE.Matrix3().set(Math.cos(Math.PI), Math.sin(Math.PI), 0, -Math.sin(Math.PI), Math.cos(Math.PI), 0, 0, 0, 1);

    for (let i = 0; i < sentence.length; i++) {
      let current = sentence.charAt(i);

      // Go forward one step. Draw a cylinder along path.
      if (current === 'F' || current === 'G') {
        let point1 = turtle.pos;
        turtle.len *= turtle.scalar;
        let temp = new THREE.Vector3(turtle.hlu.elements[0], turtle.hlu.elements[1], turtle.hlu.elements[2]);

        temp.multiplyScalar(turtle.len);
        let point2 = new THREE.Vector3().addVectors(point1, temp);

        let trunk = {id: i, point1: point1, point2: point2, color: colorMaterial[currentColorIndex]}
        trunks.push(trunk);
        turtle.pos = point2;
      }

      // Go forward one step without drawing anything.
      else if (current === 'X' || current === 'f') {
        let point1 = turtle.pos;

        let temp = new THREE.Vector3(turtle.hlu.elements[0], turtle.hlu.elements[1], turtle.hlu.elements[2]);
        let point2 = new THREE.Vector3().addVectors(point1, temp);

        turtle.pos = point2;
      }
      // Rotations around H, L or U
      else if (current === '-') {
        turtle.hlu.multiply(RuPos);
      } else if (current === '+') {
        turtle.hlu.multiply(RuNeg);
      } else if (current === '&') {
        turtle.hlu.multiply(RlPos);
      } else if (current === '^') {
        turtle.hlu.multiply(RlNeg);
      } else if (current === '/') {
        turtle.hlu.multiply(RhPos);
      } else if (current === '\\') {
        turtle.hlu.multiply(RhNeg);
      } else if (current === '|') {
        turtle.hlu.multiply(Ru180);
      }
      // Save current state in stack
      else if (current === '[') {
        turtleHistory.push({pos: turtle.pos, hlu: turtle.hlu.clone(), len: turtle.len, scalar: turtle.scalar});
        turtle = turtleHistory[turtleHistory.length - 1];
      }
      // Go back to last saved state in stack and remove it from stack
      else if (current === ']') {
        turtleHistory.pop();
        turtle = turtleHistory[turtleHistory.length - 1];
      }
          // Rotate the turtle to vertical.
      // Inte testad än
      else if (current === '$') {
        // L = (V x H) / |V x H|
        let V = new THREE.Vector3(0, 1, 0); // V = direction opposite to gravity
        let H = new THREE.Vector3(turtle.hlu.elements[0], turtle.hlu.elements[1], turtle.hlu.elements[2]);
        let L = V.cross(H).divide(V.cross(H).normalize());

        let U = H.cross(L);

        turtle.hlu.set(H.x, L.x, U.x,
            H.y, L.y, U.y,
            H.z, L.z, U.z);
      }
      // Decrement the diameter of segments
      else if (current === '!') {

      }
      // Increment the current color index
      else if (current === '´') {
        currentColorIndex = (currentColorIndex + 1) % colorMaterial.length;
      }
    }

    return this.makeInstanceTrunk(trunks);
  }
  makeInstanceTrunk(allTrunks) {

    const matrix = new THREE.Matrix4();
    let matrixRoot = new THREE.Matrix4();
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xec173a).convertSRGBToLinear(), roughness: 0.4,metalness: 0.1 });

    // let direction = new THREE.Vector3().subVectors(allTrunks[0].point1, allTrunks[0].point2);
    let rootTrunkGeo = new THREE.CylinderBufferGeometry(.1, .2, 20, 32, 1);
    let rootTrunk = new THREE.Mesh(rootTrunkGeo, material);
    rootTrunk.name = 'rootTrunk';
    rootTrunk.position.set(0, -10, 0);
    rootTrunk.layers.enable(1)
    /*rootTrunk.matrixAutoUpdate = false;

    // set position for rootTrunk
    console.error(allTrunks[0]);
    let point1 = allTrunks[0].point1;
    let point2 = allTrunks[0].point2;
    // position
    const randomX = (point2.x + point1.x) / 2;
    const randomY = (point2.y + point1.y) / 2;
    const randomZ = (point2.z + point1.z) / 2;
    matrixRoot.setPosition(randomX, randomY, randomZ);
    matrixRoot.lookAt(point1, point2, new THREE.Object3D().up);
    matrixRoot.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
        0, 0, 1, 0,
        0, -1, 0, 0,
        0, 0, 0, 1));
    rootTrunk.updateMatrix();*/

    // make other trunks
    let edgeGeometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 1, 32, 1);
    let instancedMesh = new THREE.InstancedMesh(
        edgeGeometry,
        material,
        allTrunks.length
    );
    instancedMesh.type = "InstancedTree";
    instancedMesh.name = "edge";
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

    // i=0 is root
    for (let i = 1; i < allTrunks.length; i++) {
      let inst = allTrunks[i];
      let pointX = inst.point1;
      let pointY = inst.point2;

      // position
      const randomX = (pointY.x + pointX.x) / 2;
      const randomY = (pointY.y + pointX.y) / 2 + 18;
      const randomZ = (pointY.z + pointX.z) / 2;
      matrix.setPosition(randomX, randomY, randomZ);
      instancedMesh.setMatrixAt(i, matrix);

      // orientation
      instancedMesh.getMatrixAt(i, matrix);
      matrix.lookAt(pointX, pointY, new THREE.Object3D().up);
      matrix.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1));
      instancedMesh.setMatrixAt(i, matrix);

      // Enable bloom layers
      instancedMesh.layers.enable(1);
    }

    rootTrunk.add(instancedMesh)
    console.error(rootTrunk);

    rootTrunk.tick = (delta) => {}

    return rootTrunk;
  }

  /**
   * Create tree from JSON data
   * @returns {Promise<unknown>}
   */
  makeTree() {
    return new Promise((resolve, reject) => {
      let branchs = [];
      fetch("assets/4dan.json")
        .then((r) => r.json())
        .then((instanceData) => {
          console.error(instanceData);

          let branchA = this.createBranch("danA", instanceData.danA);
          let branchB = this.createBranch("danB", instanceData.danB);
          let branchC = this.createBranch("danC", instanceData.danC);
          let branchD = this.createBranch("danD", instanceData.danD);
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
  createBranch(branch, data) {
    const matrix = new THREE.Matrix4();
    const geometry = new THREE.SphereBufferGeometry(0.2, 32);
    let instancedDan;
    let tube;

    switch (branch) {
      case "danA":
        let danACount = data.length;
        const materialDanA = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xec173a).convertSRGBToLinear(),
          roughness: 0.4,
          metalness: 0.1,
        });
        instancedDan = new THREE.InstancedMesh(
          geometry,
          materialDanA,
          danACount
        );
        instancedDan.type = "InstancedMesh";
        let pointsA = [];

        for (let i = 0; i < danACount; i++) {
          let inst = data[i];
          let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"]); // points
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
      case "danB":
        let danBCount = data.length;
        const materialDanB = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xf2c811).convertSRGBToLinear(),
          roughness: 0.4,
          metalness: 0.1,
        });
        instancedDan = new THREE.InstancedMesh(
          geometry,
          materialDanB,
          danBCount
        );
        instancedDan.type = "InstancedMesh";
        let pointsB = [];

        for (let i = 0; i < danBCount; i++) {
          let inst = data[i];
          let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"]);
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
      case "danC":
        let danCCount = data.length;
        const materialDanC = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x006bff).convertSRGBToLinear(),
          roughness: 0.4,
          metalness: 0.1,
        });
        instancedDan = new THREE.InstancedMesh(
          geometry,
          materialDanC,
          danCCount
        );
        instancedDan.type = "InstancedMesh";
        let pointsC = [];

        for (let i = 0; i < danCCount; i++) {
          let inst = data[i];
          let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          pointsC.push(pos);

          // Enable bloom layers
          instancedDan.layers.enable(1);
        }

        tube = this.addTube(pointsC);
        // instancedDan.add(tubeC);
        // tubeC.matrixAutoUpdate = false;
        break;
      case "danD":
        let danDCount = data.length;
        const materialDanD = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xffffff).convertSRGBToLinear(),
          roughness: 0.4,
          metalness: 0.1,
        });
        instancedDan = new THREE.InstancedMesh(
          geometry,
          materialDanD,
          danDCount
        );
        instancedDan.type = "InstancedMesh";
        let pointsD = [];

        for (let i = 0; i < danDCount; i++) {
          let inst = data[i];
          let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"]);
          matrix.setPosition(pos);
          instancedDan.setMatrixAt(i, matrix);
          pointsD.push(pos);

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
      spline: "PipeSpline",
      extrusionSegments: 100,
      radiusSegments: 10,
      closed: false,
    };
    // const tubeGeometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, .03, params.radiusSegments, params.closed );
    // const material = new THREE.MeshLambertMaterial( { color: 0x9B2B27 } );
    // const tube = new Mesh( tubeGeometry, material );
    // tube.scale.setScalar(5);
    // tube.position.y =-10;

    var nEnd = 0;
    let nMax;
    let nStep = 90; // 30 faces * 3 vertices/face

    // Tube path
    var path = new CatmullRomCurve3(_points);
    var geometry = new THREE.TubeBufferGeometry(
      path,
      params.extrusionSegments,
      0.05,
      params.radiusSegments,
      params.closed
    );

    // line bufferGeo
    nMax = geometry.attributes.position.count;
    const material = new THREE.MeshLambertMaterial({ color: 0x9b2b27 });
    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    const tube = new THREE.Mesh(geometry, material);
    tube.scale.setScalar(3);
    tube.position.y = -20;

    // render
    tube.tick = () => {
      //nEnd = ( nEnd + nStep ) % nMax;
      nEnd = Math.max(nEnd + nStep, nMax);
      tube.geometry.setDrawRange(0, nEnd);
      geometry.verticesNeedUpdate = true;
    };

    /*var points = [];
    var height = 10;
    var count = 20;
    for (var i = 0; i < count; i++) {
      //Push the vertex coordinates into the array
      let randomX = (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12;
      let randomY = ( i - count ) + count / 2;
      points.push(new THREE.Vector3(randomX, randomY, 0));
    }

    console.log(points)

    // Instantiate a THREE.LatheGeometry and set related information
    var latheGeometry = new LatheGeometry(points, 120, 2, 2 * Math.PI);
    latheGeometry.dynamic = true;
    latheGeometry.verticesNeedUpdate = true;

    nMax = latheGeometry.attributes.position.count;

    const material = new THREE.MeshLambertMaterial( { color: 0x9B2B27 } );
    // Instantiate the material of a normal vector
    material.side = DoubleSide; //Set both sides to be visible

    // Assign both materials to the geometry
    var lathe = new THREE.Mesh(latheGeometry, material);

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
const randomizeMatrix = (function () {
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  return function (matrix, type) {
    switch (type) {
      case "groupTree1":
        position.x = Math.random() * 1 - 60;
        position.y = -40;
        position.z = Math.random() * 1 - 3;
        break;
      case "groupTree2":
        position.x = Math.random() * 1 - 15;
        position.y = -40;
        position.z = Math.random() * 1 - 3;
        break;
      case "groupTree3":
        position.x = Math.random() * 1 + 20;
        position.y = -40;
        position.z = Math.random() * 1 - 3;
        break;
      case "groupTree4":
        position.x = Math.random() * 1 + 60;
        position.y = -40;
        position.z = Math.random() * 1 - 3;
        break;
    }

    rotation.x = 0;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = 0;
    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = 8;

    matrix.compose(position, quaternion, scale);
  };
})();

function createFloatAttribute(array, itemSize) {
  const typedArray = new Float32Array(Tree.flattenArray(array));
  return new THREE.BufferAttribute(typedArray, itemSize);
}

function createIntAttribute(array, itemSize) {
  const typedArray = new Uint16Array(Tree.flattenArray(array));
  return new THREE.BufferAttribute(typedArray, itemSize);
}

function normalizeAttribute(attribute) {
  var v = new THREE.Vector3();
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

export { ProceduralTree };
