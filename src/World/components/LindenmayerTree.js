
const clock = new THREE.Clock();

class LindenmayerTree {

  constructor() {
    this.figureShape = {
      Structure: 1,
      // prev: 0,
      angle: 10, // Angle in degrees, gets converted into radiance in turtle during rendering, default=22
      'n (Iterations)': 4, // minimum number of iterations when generating sentence
      Axiom: 'F',
    };
    this.sentence = this.figureShape.Axiom;
    this.rules = [];
  }

  /**
   * Make 4 groups of tree with different colors.
   * @returns {*[]}
   */
  makeGroupTree(data) {
    let groupTree = [];
    let danTotal = data.data.danTotal;
    console.error('make Group tree:' , data);

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
    let treeA = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()), danTotal.a);
    treeA.position.set(0, -10, 0);
    treeA.rotation.y = Math.random() * Math.PI/180;

    let treeB = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()), danTotal.b);
    treeB.position.set(-1, -10, 0);
    treeB.rotation.y = Math.random() * 2 * Math.PI;

    let treeC = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()), danTotal.c);
    treeC.position.set(1, -10, 1);
    treeC.rotation.y = Math.random() * 2 * Math.PI;

    let treeD = this.generateTree(new THREE.Color().setHex(0xffffff * Math.random()), danTotal.d);
    treeD.position.set(1, -10, -1);
    treeD.rotation.y = Math.random() * 2 * Math.PI;

    groupTree.push(treeA, treeB, treeC, treeD);
    return groupTree;
  }

  /**
   * Recalculate the iteration, min:4, max:7
   * @param dan
   * @returns {number}
   */
  estimateDan(dan){
    const min = 4;
    let estimate;

    dan = Math.round(dan/100);
    console.error('dan: ', dan)

    if (dan <= 4) {
      estimate = min;
    }
    else if (dan >= 7) {
      estimate = 7;
    }
    else {
      estimate = dan;
    }

    console.error('estimate: ', estimate)
    return estimate;
  }

  /**
   * Generator tree with {color}
   * Create 1 root for 10 branches.
   * @param color
   * @returns {*}
   */
  generateTree(color, dan) {

    this.figureShape["n (Iterations)"] = this.estimateDan(dan);
    let branches = [];

    // let direction = new THREE.Vector3().subVectors(allTrunks[0].point1, allTrunks[0].point2);
    let rootTrunkGeo = new THREE.CylinderBufferGeometry(.2, .2, 20, 32, 1);
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
      branches.push(trunk);

      // add other trunks into root
      rootTrunk.add(trunk)
    }

    /*let allTrunks = this.genDraw();
    const trunk = this.makeInstanceTrunk(allTrunks, material);*/

    // console.error(rootTrunk)
    // rootTrunk.children.forEach(branch => branch.position.y = branch.position.y + 10)

    // rootTrunk.tick = () => {
      // const t = clock.getElapsedTime();
      // rootTrunk.children.forEach(branch => {
      //   if(branch.scale.x <= 1 ) {
      //     branch.position.y += t * .0008;
      //     branch.scale.x += t * .0001;
      //     branch.scale.y += t * .0001;
      //     branch.scale.z += t * .0001;
      //   }
      // })
    // }

    return rootTrunk;
  }

  /**
   * Check if rules are changed.
   */
  rulechange() {

    this.rules = [];

    // if (this.figureShape.Structure === 1) {
    //   console.error('update iteration: ', this.figureShape['n (Iterations)'])
    //   this.figureShape.angle = 22; // Conversion from degrees to radians
    //   this.figureShape['n (Iterations)'] = 4; // Number of iterations when generating sentence
    // this.figureShape.Axiom = 'F';

    this.rules[0] = {
      a: 'F',
      b: 'F´[+F´]F´[-F´]/F´',
      c: 'F´[+F´]^F´',
      d: 'F´+F´/F´',
      bpro: 33,
      cpro: 33,
    };
    // }
  }

  /**
   * Generate sentences based on turtle operators.
   */
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
          // else {
          //   nextSentence += this.rules[j].d;
          // }
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

  /**
   * Generate turtle rules.
   * @returns {*[]}
   */
  genDraw() {
    this.rulechange();

    this.sentence = this.figureShape.Axiom;
    let interation = this.figureShape["n (Iterations)"];
    console.error('===> final interation: ', interation)

    for (let i = 0; i < interation ; i++) {
      this.generate();
    }

    return this.turtle()
  }

  /**
   * Make trunks based on turtle operators.
   * @returns {*[]}
   */
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

  /**
   * Make branches.
   * @param allTrunks
   * @param mat
   * @returns {InstancedMesh|InstancedMesh}
   */
  makeInstanceTrunk(allTrunks, mat) {

    // console.warn(allTrunks)

    const matrix = new THREE.Matrix4();
    let dummy = new THREE.Object3D();
    const radiansPerSecond = THREE.MathUtils.degToRad(30);
    const sizes = [];

    let edgeGeometry = new THREE.CylinderBufferGeometry(0.06, 0.06, 1, 32, 1); // same geo
    let instancedMesh = new THREE.InstancedMesh(
        edgeGeometry,
        mat,
        allTrunks.length // how many instances
    );
    instancedMesh.type = "InstancedTree";
    instancedMesh.name = "branch";
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    instancedMesh.scale.setScalar(.01)
    instancedMesh.position.y = 10

    // i=0 is root
    for (let i = 1; i < allTrunks.length; i++) {
      let inst = allTrunks[i];
      let pointX = inst.point1;
      let pointY = inst.point2;

      // position
      const randomX = (pointY.x + pointX.x) / 2;
      const randomY = (pointY.y + pointX.y) / 2;
      const randomZ = (pointY.z + pointX.z) / 2;
      matrix.setPosition(randomX, randomY, randomZ);
      instancedMesh.setMatrixAt(i, matrix);
      sizes.push(20);

      // orientation
      instancedMesh.getMatrixAt(i, matrix);
      matrix.lookAt(pointX, pointY, new THREE.Object3D().up);
      matrix.multiply(new THREE.Matrix4().set(1, 0, 0, 0,
          0, 0, 1, 0,
          0, -1, 0, 0,
          0, 0, 0, 1));
      instancedMesh.setMatrixAt(i, matrix);

      // scale
      /*instancedMesh.getMatrixAt(i, matrix);
      matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.scale.x = dummy.scale.y = dummy.scale.z = .01;
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);*/

      // Enable bloom layers
      instancedMesh.layers.enable(1);
    }

    setInterval(() => {
      // for (let i = 1; i < instancedMesh.count; i++) {
      //   // rotation
      //   instancedMesh.getMatrixAt(i, matrix);
      //   matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      //
      //   if (dummy.scale.x < 2) {
      //     dummy.position.y += t * .0008;
      //     dummy.scale.x += t * .0001;
      //     dummy.scale.y += t * .0001;
      //     dummy.scale.z += t * .0001;
      //
      //     dummy.updateMatrix();
      //     instancedMesh.setMatrixAt(i, dummy.matrix);
      //   }
      // }
      // instancedMesh.instanceMatrix.needsUpdate = true;

    }, 500)

    instancedMesh.tick = (delta) => {
      const time = clock.getElapsedTime();
      // const time = Date.now() * 0.002;

      if (instancedMesh.scale.x < 1.2) {
        instancedMesh.position.y += 0.008 * (1 + Math.sin(0.1 + time)); //time * .008;
        instancedMesh.scale.x += 0.001 * (1 + Math.sin(0.1 + time)); //time * .001;
        instancedMesh.scale.y += 0.001 * (1 + Math.sin(0.1 + time)); //time * .001;
        instancedMesh.scale.z += 0.001 * (1 + Math.sin(0.1 + time)); //time * .001;
      }
      /*for (let i = 1; i < instancedMesh.count; i++) {
        // rotation
        instancedMesh.getMatrixAt(i, matrix);
        matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        if (dummy.scale.x < 100) {
          dummy.position.y += t * .08;
          dummy.scale.x += t * .01;
          dummy.scale.y += t * .01;
          dummy.scale.z += t * .01;

          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        }
      }
      instancedMesh.instanceMatrix.needsUpdate = true;*/

      // const sizes = edgeGeometry.attributes.size.array;
      // for (let i = 0; i < instancedMesh.count; i++) {
      //   sizes[i] = 0.01 * (1 + Math.sin(0.1 * i + delta));
      // }
      // edgeGeometry.attributes.size.needsUpdate = true;
    }

    return instancedMesh;
  }

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export { LindenmayerTree };
