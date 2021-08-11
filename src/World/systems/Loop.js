const clock = new THREE.Clock();

class Loop {
  constructor(camera, scene, renderer, sceneComposer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.sceneComposer = sceneComposer;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);

      // render bloom
      this.sceneComposer.renderBloom(true);

      // render the entire scene, then render bloom scene on top
      this.sceneComposer.render();
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
}

export { Loop };
