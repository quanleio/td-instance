import {Clock, Layers, MeshBasicMaterial} from 'https://unpkg.com/three@0.130.0/build/three.module.js';

const clock = new Clock();
const darkMaterial = new MeshBasicMaterial({ color: "black" });
const materials = {};
const bloomLayer = new Layers();
bloomLayer.set( 1 );

class Loop {
  constructor(camera, scene, renderer, composer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.composer = composer;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);

      // render bloom
      this.renderBloom(true);

      // render the entire scene, then render bloom scene on top
      this.composer.sceneComposer.render();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    // console.log(`The last frame rendered in ${delta * 1000} milliseconds`,);

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }

  renderBloom(mask) {
    if (mask === true) {
      this.scene.traverse( this.darkenNonBloomed );
      this.composer.bloomComposer.render();
      this.scene.traverse( this.restoreMaterial );
    }
  }

  darkenNonBloomed(obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      materials[obj.uuid] = obj.material;
      obj.material = darkMaterial;
    }
  }

  restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

}

export {Loop};