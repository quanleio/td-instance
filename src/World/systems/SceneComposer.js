import { Vector2, Layers, ShaderMaterial, MeshBasicMaterial } from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { RenderPass } from '../../../vendor2/RenderPass.js';
import { UnrealBloomPass } from '../../../vendor2/UnrealBloomPass.js';
import { EffectComposer} from '../../../vendor2/EffectComposer.js';
import { ShaderPass } from '../../../vendor2/ShaderPass.js';

const params = {
  exposure:  1,
  bloomStrength: 1.2,
  bloomThreshold: 0,
  bloomRadius: 0,
};
const darkMaterial = new MeshBasicMaterial({ color: "black" });
const materials = {};
const bloomLayer = new Layers();
bloomLayer.set( 1 );
let sceneComposer, bloomComposer;

class SceneComposer {

  constructor(_scene, _camera, _renderer) {
    this.scene = _scene;
    this.camera = _camera;
    this.renderer = _renderer;

    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength  = params.bloomStrength;
    bloomPass.radius    = params.bloomRadius;

    bloomComposer = new EffectComposer(this.renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new ShaderPass(
        new ShaderMaterial({
          uniforms: {
            baseTexture: {value: null},
            bloomTexture: {value: bloomComposer.renderTarget2.texture},
          },
          vertexShader: document.getElementById('vertexshader-bloom').textContent,
          fragmentShader: document.getElementById('fragmentshader-bloom').textContent,
          defines: {},
        }), 'baseTexture',
    );
    finalPass.needsSwap = true;

    sceneComposer = new EffectComposer(this.renderer);
    sceneComposer.addPass(renderScene);
    sceneComposer.addPass(finalPass);
  }

  getComposers() {
    return { sceneComposer, bloomComposer }
  }

  renderBloom(mask) {
    if (mask === true) {
      this.scene.traverse( this.darkenNonBloomed );
      bloomComposer.render();
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

  render() {
    sceneComposer.render();
  }

}

export { SceneComposer }
