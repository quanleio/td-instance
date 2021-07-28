import { PMREMGenerator, UnsignedByteType } from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { RGBELoader } from '../../vendor2/RGBELoader.js';
import {createCamera} from './components/camera.js';
import {createScene} from './components/scene.js';
import {loadSakura, loadSuzanne} from './components/model.js';
import { createDirLight, createHemiLight} from './components/lights.js';
import { Geometries } from './components/Geometries.js';
import { Tree } from './components/Tree.js';
import {createRenderer} from './systems/renderer.js';
import {createControl} from './systems/controls.js';
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

    // tree
    new Tree().makeTree().then( branch => {
      branch.forEach(_branch => {
        scene.add(_branch);
        loop.updatables.push(_branch);
      })
    })

    console.warn(scene)

    // Suzanne model
    // loadSuzanne().then(_model => {
    //   scene.add(_model);
    //   loop.updatables.push(_model);
    // });

    // Sakura model
    // loadSakura().then(_model => {
    //   scene.add(_model);
    // })

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
