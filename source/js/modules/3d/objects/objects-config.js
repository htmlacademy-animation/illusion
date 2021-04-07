import ObjectMaterialType from '../materials/object-material-type';

export const objectsConfig = {
  hat: {
    type: `gltf`,
    path: `3d/gltf/hat.gltf`
  },
  rabbit: {
    type: `gltf`,
    path: `3d/gltf/rabbit.gltf`,
    material: ObjectMaterialType.PARSE
  },
  key: {
    type: `gltf`,
    material: ObjectMaterialType.VERSICOLOR,
    path: `3d/gltf/key.gltf`
  },
  unicornsUnit: {
    type: `gltf`,
    material: ObjectMaterialType.VERSICOLOR,
    path: `3d/gltf/unicorns_unit.gltf`
  },
  peaks: {
    type: `obj`,
    path: `3d/obj/peaks.obj`
  },
  clubs: {
    type: `obj`,
    path: `3d/obj/clubs.obj`
  },
  star: {
    type: `obj`,
    path: `3d/obj/star.obj`
  }
};
