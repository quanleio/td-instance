import {Raycaster, Vector2, Color} from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import {createCamera} from './components/camera.js';
import {createScene} from './components/scene.js';
import {addModel} from './components/model.js';
import {createDirLight, createHemiLight} from './components/lights.js';
import {createRenderer} from './systems/renderer.js';
import {createControl} from './systems/controls.js';
import {Loop} from './systems/Loop.js';
import {Resizer} from './systems/Resizer.js';
import {Ray} from './systems/Ray.js';
import {createCube} from './components/cube.js';

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
    scene.add(hemiLight);

    const dirLight = createDirLight();
    scene.add(dirLight);

    // cube
    const cube = createCube();
    scene.add(cube);
    loop.updatables.push(cube);

    // model
    addModel().then(_model => {
      scene.add(_model);
      loop.updatables.push(_model);
    });

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