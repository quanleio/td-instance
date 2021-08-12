
// let rules = [];
// let figureShape = {
//   Structure: 1,
//   prev: 0,
//   angle: 22, // Angle in degrees, gets converted into radiance in turtle during rendering
//   'n (Iterations)': 4, // Number of iterations when generating sentence
//   Axiom: 'F',
// };
// let sentence = figureShape.Axiom;

class LindenmayerTree {

  constructor() {
    this.figureShape = {
      Structure: 1,
      prev: 0,
      angle: 22, // Angle in degrees, gets converted into radiance in turtle during rendering
      'n (Iterations)': 4, // Number of iterations when generating sentence
      Axiom: 'F',
    };
    this.sentence = this.figureShape.Axiom;
    this.rules = [];
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

    // tree1.material.color = new THREE.Color().setHex(getRandomColor())
    let tree1 = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()));
    tree1.position.set(-50, -20, 0);

    let tree2 = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()));
    tree2.position.set(-20, -20, 0);

    let tree3 = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()));
    tree3.position.set(10, -20, 0);

    let tree4 = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()));
    tree4.position.set(40, -20, 0);

    groupTree.push(tree1, tree2, tree3, tree4);
    return groupTree;
  }

  genDraw() {
    this.rulechange();

    this.sentence = this.figureShape.Axiom;
    let interation = this.figureShape["n (Iterations)"];

    for (let i = 0; i < interation ; i++) {
      this.generate();
    }

    return this.turtle()
  }
  rulechange() {

    this.rules = [];

    if (this.figureShape.Structure === 1) {
      this.figureShape.angle = 22; // Conversion from degrees to radians
      this.figureShape['n (Iterations)'] = 4; // Number of iterations when generating sentence
      this.figureShape.Axiom = 'F';

      this.rules[0] = {
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
    for (let i = 0; i < this.sentence.length; i++) {
      let current = this.sentence.charAt(i);
      let found = false;
      for (let j = 0; j < this.rules.length; j++) {
        if (current === this.rules[j].a) {
          found = true;
          let rand = Math.floor(Math.random() * 101);
          if (rand < this.rules[j].bpro) {
            nextSentence += this.rules[j].b;
          }
          else if (rand < this.rules[j].bpro + this.rules[j].cpro) {
            nextSentence += this.rules[j].c;
          }
          else {
            nextSentence += this.rules[j].d;
          }
          break;
        }
      }
      if (!found) {
        nextSentence += current;
      }
    }
    this.sentence = nextSentence;
    // console.log(sentence);
  }
  turtle() {
    let angle = this.figureShape.angle * Math.PI / 180;
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

    for (let i = 0; i < this.sentence.length; i++) {
      let current = this.sentence.charAt(i);

      // Go forward one step. Draw a cylinder along path.
      if (current === 'F' || current === 'G') {
        let point1 = turtle.pos;
        turtle.len *= turtle.scalar;
        let temp = new THREE.Vector3(turtle.hlu.elements[0], turtle.hlu.elements[1], turtle.hlu.elements[2]);

        temp.multiplyScalar(turtle.len);
        let point2 = new THREE.Vector3().addVectors(point1, temp);

        // let trunk = {id: i, point1: point1, point2: point2, color: colorMaterial[currentColorIndex]}
        let trunk = {id: i, point1: point1, point2: point2}
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
        //currentColorIndex = (currentColorIndex + 1) % colorMaterial.length;
      }
    }

    return trunks;
  }

  generateTree(color) {

    console.error('generateTree');

    // let direction = new THREE.Vector3().subVectors(allTrunks[0].point1, allTrunks[0].point2);
    let rootTrunkGeo = new THREE.CylinderBufferGeometry(.1, .4, 20, 32, 1);
    const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4,metalness: 0.1 });
    let rootTrunk = new THREE.Mesh(rootTrunkGeo, material);
    rootTrunk.name = 'rootTrunk';
    rootTrunk.position.set(0, -10, 0); // fix position of root
    rootTrunk.layers.enable(1);

    // make other branches
    // make 10 trunks for 1 root
    for (let i=0; i< 10; i++) {
      let allTrunks = this.genDraw();
      const trunk = this.makeInstanceTrunk(allTrunks, material);

      // add other trunks into root
      rootTrunk.add(trunk)
    }

    console.error(rootTrunk)

    rootTrunk.tick = (delta) => {}

    return rootTrunk;
  }

  makeInstanceTrunk(allTrunks, mat) {

    console.error('make other trunks')

    const matrix = new THREE.Matrix4();
    let edgeGeometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 1, 32, 1);
    let instancedMesh = new THREE.InstancedMesh(
        edgeGeometry,
        mat,
        allTrunks.length
    );
    instancedMesh.type = "InstancedTree";
    instancedMesh.name = "branch";
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

    return instancedMesh;
  }

}

export { LindenmayerTree };
