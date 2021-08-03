class Resizer {
  constructor(camera, renderer, composer) {
    // set initial size
    setSize(camera, renderer, composer);

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(camera, renderer, composer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}
}

const setSize = (camera, renderer, composer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  composer.bloomComposer.setSize(window.innerWidth, window.innerHeight);
  composer.sceneComposer.setSize(window.innerWidth, window.innerHeight);
};

export { Resizer };
