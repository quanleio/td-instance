import { World } from './World/World.js';

function main() {

  // Create an instance of the World
  const world = new World();

  // Render the Scene
  // world.render();

  // start the animation loop
  world.start();
}

main();