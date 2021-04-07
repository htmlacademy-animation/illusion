const THREE = require(`three`);

// - Parametric objects
export const getSpheres = (material, num, r) => {
  const geometry = new THREE.SphereBufferGeometry(r, 32, 32);

  return Array.from({length: num}, () => new THREE.Mesh(geometry, material));
};

export const getCones = (material, num) => {
  const geometry = new THREE.ConeBufferGeometry(42, 140, 40);

  return Array.from({length: num}, () => new THREE.Mesh(geometry, material));
};

export const getTori = (material, num) => {
  const geometry = new THREE.TorusBufferGeometry(150, 8, 10, 60);

  return Array.from({length: num}, () => new THREE.Mesh(geometry, material));
};

export const getMagicWand = (material) => new THREE.Mesh(new THREE.CylinderBufferGeometry(6, 6, 415, 10), material);
