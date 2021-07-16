import {createCamera} from './components/camera.js';
import {createScene} from './components/scene.js';
import {loadSakura, loadSuzanne} from './components/model.js';
import {createDirLight, createHemiLight} from './components/lights.js';
import {createRenderer} from './systems/renderer.js';
import {createControl} from './systems/controls.js';
import {Loop} from './systems/Loop.js';
import {Resizer} from './systems/Resizer.js';
import {Ray} from './systems/Ray.js';
import { Geometries } from './components/Geometries.js';
// import {makeLineBetweenPoints} from './components/line.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera, scene, renderer, controls, loop;

class World {
  constructor() {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();

    // loop
    loop = new Loop(camera, scene, renderer);

    const hemiLight = createHemiLight();
    const dirLight = createDirLight();
    scene.add(dirLight, hemiLight);

    // 3d geometries
    const geometryShape = new Geometries();

    /*const shape = geometryShape.generateShapes();
    scene.add(shape);
    loop.updatables.push(shape);*/

    /*const cubes = geometryShape.randomCube();
    cubes.forEach(cube => {
      scene.add(cube);
      loop.updatables.push(cube);
    })*/

    /*const particles = geometryShape.createParticles();
    scene.add(particles);
    loop.updatables.push(particles);*/

    const instancedShapes = geometryShape.instanceShapes();
    scene.add(instancedShapes);
    loop.updatables.push(instancedShapes);

    const line = geometryShape.makeLineBetweenPoints();
    scene.add(line);
    loop.updatables.push(line);

    // Suzanne model
   /* loadSuzanne().then(_model => {
      scene.add(_model);
      loop.updatables.push(_model);
    });*/

    // Sakura model
    /*loadSakura().then(_model => {
      scene.add(_model);
    })*/

    // control
    controls = createControl(camera, renderer);
    controls.addEventListener('change', this.render);

    // ray
    new Ray(scene, camera);

    // resize
    new Resizer(camera, renderer);
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

export { World }