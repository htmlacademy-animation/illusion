const THREE = require(`three`);

export const addWithWrapperGroup = (object, parent) => {
  const g = new THREE.Group();

  g.add(object);
  parent.add(g);

  return g;
};
