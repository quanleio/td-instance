import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { loadSakura, loadSuzanne } from "./components/model.js";
import { createDirLight, createHemiLight } from "./components/lights.js";
import { Geometries } from "./components/Geometries.js";
import { ProceduralTree } from "./components/ProceduralTree.js";
import { createRenderer } from "./systems/renderer.js";
import { createControl } from "./systems/controls.js";
import { Loop } from "./systems/Loop.js";
import { Resizer } from "./systems/Resizer.js";
import { Ray } from "./systems/Ray.js";
import { SceneComposer } from "./systems/SceneComposer.js";

// These variables are module-scoped: we cannot access them
// from outside the module
let camera, scene, renderer, controls, loop;
let composer = {};

class World {
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    // composers
    const sceneComposer = new SceneComposer(scene, camera, renderer);
    composer = sceneComposer.getComposers();

    const hemiLight = createHemiLight();
    const dirLight = createDirLight();
    scene.add(dirLight, hemiLight);

    // 3d geometries
    const geometryShape = new Geometries();

    // loop
    loop = new Loop(camera, scene, renderer , sceneComposer);

    /*const shape = geometryShape.generateShapes();
    scene.add(shape);
    loop.updatables.push(shape);*/

    // const cubes = geometryShape.floatingCube();
    // cubes.forEach(cube => {
    //   scene.add(cube);
    //   loop.updatables.push(cube);
    // })

    // particle
    // const particles = geometryShape.createParticles();
    // scene.add(particles);
    // loop.updatables.push(particles);

    // const instancedShapes = geometryShape.instanceShapes();
    // instancedShapes.forEach((shape) => {
    //   scene.add(shape);
    //   loop.updatables.push(shape);
    // });

    // const randomStars = geometryShape.randomStars();
    // randomStars.forEach(star =>{
    //   scene.add(star);
    //   loop.updatables.push(star);
    // })

    const groupTree = new ProceduralTree().genDraw();
    groupTree.forEach(tree => {
      scene.add(tree)
      loop.updatables.push(tree)
    })

    // tree from td json
    // new ProceduralTree().makeTree().then( branch => {
    //   branch.forEach(_branch => {
    //     scene.add(_branch);
    //     loop.updatables.push(_branch);
    //   })
    // })

    // proctree.js
    // let procTree = new ProceduralTree();
    // const groupTree1 = procTree.createTreeGroup("groupTree1", 6);
    // const groupTree2 = procTree.createTreeGroup("groupTree2", 6);
    // const groupTree3 = procTree.createTreeGroup("groupTree3", 6);
    // const groupTree4 = procTree.createTreeGroup("groupTree4", 6);
    // scene.add(groupTree1, groupTree2, groupTree3, groupTree4);
    // loop.updatables.push(
    //   groupTree1.children[0],
    //   groupTree2.children[0],
    //   groupTree3.children[0],
    //   groupTree4.children[0]
    // );

    /*let level = 3;
    setTimeout(() => {
      setInterval(() => {
        level = level + .1;
        if (level <= 8) {

          // scene.children.forEach(t => {
          //   if (t.name === 'TRUNK') scene.remove(t); // remove old trees
          // })

          // create new trees
          // const tree1 = procTree.createTree(level.toExponential(2), '0xFEFEB1');
          // tree1.position.set(-30, -27, 0); tree1.rotateY(Math.PI/180 * 100);

          // let tree2 = procTree.createTree(level.toExponential(2), '0xfc4c4e');
          // tree2.position.set(-15, -27, 0);
          // tree2.rotateY(Math.PI/180 * 80);

          // const tree3 = procTree.createTree(level.toExponential(2), '0x40DFA0');
          // tree3.position.set(10, -27, 0);  tree3.rotateY(Math.PI/180 * 60);

          // const tree4 = procTree.createTree(level.toExponential(2), '0xFF7AE9');
          // tree4.position.set(20, -27, 0);  tree4.rotateY(Math.PI/180 * 40);

          // scene.add(groupTree2);
          // loop.updatables.push(groupTree2);
        }
      }, 50)
    }, 1000)*/

    // Suzanne model
    // loadSuzanne().then(_model => {
    //   scene.add(_model);
    //   loop.updatables.push(_model);
    // });

    // Sakura model
    // loadSakura().then(_model => {
    //   scene.add(_model);
    // })

    console.error(scene);

    // Set background for scene as image
    let pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    new THREE.RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("./assets/")
      .load("royal_esplanade_1k.hdr", function (texture) {
        let envMap = pmremGenerator.fromEquirectangular(texture).texture;

        // scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();
      });

    // control
    controls = createControl(camera, renderer);
    controls.addEventListener("change", this.render);

    // ray
    new Ray(scene, camera);

    // resize
    new Resizer(camera, renderer , composer);
  }

  render() {
    renderer.render(scene, camera); // draw a single frame
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
