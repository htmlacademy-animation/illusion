import ObjectMaterialType from '../materials/object-material-type';

const THREE = require(`three`);

const versicolorMatcap = `/img/versicolorMatcap.png`;
const darkMatcap = `/img/darkMatcap.png`;

export const getMatcapTexturesPaths = (isLightMode) => {
  const arr = [versicolorMatcap];

  if (isLightMode) arr.push(darkMatcap);

  return arr;
};

export const constructMaterialsMap = (textures, isLightMode) => {
  const map = {};
  const factor = 0.1;
  let texture = textures[darkMatcap];

  map[ObjectMaterialType.DEFAULT] = isLightMode && texture
  ? new THREE.MeshMatcapMaterial({
    transparent: false,
    opacity: 1,
    matcap: textures[darkMatcap],
    side: THREE.FrontSide,
    color: 0xffffff
  })
  : new THREE.MeshPhongMaterial({
    color: 0x080808,
    // Расчитываем цвет исходя из значений RBG: 
    // уменьшаем яркость каждого из каналов с помощью коэффициента
    specular: new THREE.Color(`rgb(
      ${Math.round(242 * factor)}, 
      ${Math.round(244 * factor)}, 
      ${Math.round(250 * factor)})`),
    emissive: 0x0,
    shininess: 61 * 0.65,
    reflectivity: 0.78,
    combine: THREE.MixOperation,
    flatShading: false,
    depthWrite: true
  });

  texture = textures[versicolorMatcap];
  map[ObjectMaterialType.VERSICOLOR] = texture 
  ? new THREE.MeshMatcapMaterial({
    transparent: false,
    opacity: 1,
    matcap: texture,
    side: THREE.FrontSide,
    color: 0xffffff
  }) 
  : map[ObjectMaterialType.DEFAULT];

  return map;
};