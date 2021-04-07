const THREE = require(`three`);

const loadTextures = (paths) => {
  return new Promise((resolve) => {
    const textureLoader = new THREE.TextureLoader();
    const map = {};

    Promise.all(paths.map((path) => new Promise((resolve) => {
      textureLoader.load(
        path,
        (texture) => {
          map[path] = texture;

          resolve(texture);
        }
      );
    })))
      .then(() => { 
        resolve(map);
      });
  });
};

export default loadTextures;
