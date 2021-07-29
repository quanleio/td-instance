import { PMREMGenerator, UnsignedByteType } from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { RGBELoader } from '../../vendor2/RGBELoader.js';
import {createCamera} from './components/camera.js';
import {createScene} from './components/scene.js';
import {loadSakura, loadSuzanne} from './components/model.js';
import { createDirLight, createHemiLight} from './components/lights.js';
import { Geometries } from './components/Geometries.js';
import { ProceduralTree } from './components/ProceduralTree.js';
import { createRenderer} from './systems/renderer.js';
import { createControl} from './systems/controls.js';
import {Loop} from './systems/Loop.js';
import {Resizer} from './systems/Resizer.js';
import {Ray} from './systems/Ray.js';
import {SceneComposer} from './systems/SceneComposer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera, scene, renderer, controls, loop;
let composer={};

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
    loop = new Loop(camera, scene, renderer, sceneComposer);

    /*const shape = geometryShape.generateShapes();
    scene.add(shape);
    loop.updatables.push(shape);*/

    // const cubes = geometryShape.floatingCube();
    // cubes.forEach(cube => {
    //   scene.add(cube);
    //   loop.updatables.push(cube);
    // })

    // particle
    const particles = geometryShape.createParticles();
    scene.add(particles);
    loop.updatables.push(particles);

    const instancedShapes = geometryShape.instanceShapes();
    instancedShapes.forEach(shape => {
      scene.add(shape);
      loop.updatables.push(shape);
    })

    // tree from td json
    // new Tree().makeTree().then( branch => {
    //   branch.forEach(_branch => {
    //     scene.add(_branch);
    //     loop.updatables.push(_branch);
    //   })
    // })

    // proctree.js
    let procTree = new ProceduralTree();
    const tree1 = procTree.createTree('0x9d7362'); tree1.position.set(-30, -27, 0); tree1.rotateY(Math.PI/180 * 100);
    const tree2 = procTree.createTree('0xDF1019'); tree2.position.set(-15, -27, 0); tree2.rotateY(Math.PI/180 * 80);
    const tree3 = procTree.createTree('0x1D903F'); tree3.position.set(10, -27, 0);  tree3.rotateY(Math.PI/180 * 60);
    const tree4 = procTree.createTree('0x0000B3'); tree4.position.set(20, -27, 0);  tree4.rotateY(Math.PI/180 * 40);

    scene.add(tree1, tree2, tree3, tree4);
    loop.updatables.push(tree1, tree2, tree3, tree4);

    // TODO: create new branch for Tree
    setInterval(() => {
      // procTree.createNewBranch(tree);
    }, 5000)

    // Suzanne model
    // loadSuzanne().then(_model => {
    //   scene.add(_model);
    //   loop.updatables.push(_model);
    // });

    // Sakura model
    // loadSakura().then(_model => {
    //   scene.add(_model);
    // })

    console.error(scene)

    // Set background for scene as image
    let pmremGenerator = new PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
    .setDataType( UnsignedByteType )
    .setPath( './assets/' )
    .load( 'royal_esplanade_1k.hdr', function ( texture ) {

      let envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      // scene.background = envMap;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });

    // control
    controls = createControl(camera, renderer);
    controls.addEventListener('change', this.render);

    // ray
    new Ray(scene, camera);

    // resize
    new Resizer(camera, renderer, composer);
  }

  // autoRandom() {
  //   setTimeout(() => {
  //     scene.add(randomCube)
  //     loop.updatables.push(randomCube);
  //     console.error('random cube');
  //   }, 1000);
  // }

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

export { World }
