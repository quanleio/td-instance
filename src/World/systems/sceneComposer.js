import { Vector2, ShaderMaterial } from 'https://unpkg.com/three@0.130.0/build/three.module.js';
import { RenderPass } from '../../../vendor2/RenderPass.js';
import { UnrealBloomPass } from '../../../vendor2/UnrealBloomPass.js';
import { EffectComposer} from '../../../vendor2/EffectComposer.js';
import { ShaderPass } from '../../../vendor2/ShaderPass.js';

function createComposer(_scene, _camera, _renderer) {

  const params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0,
  };

  const renderScene = new RenderPass(_scene, _camera);
  const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  let bloomComposer = new EffectComposer(_renderer);
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

  let sceneComposer = new EffectComposer(_renderer);
  sceneComposer.addPass(renderScene);
  sceneComposer.addPass(finalPass);

  return { sceneComposer, bloomComposer }
}

export { createComposer };