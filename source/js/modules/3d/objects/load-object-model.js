import {OBJLoader2} from 'three/examples/jsm/loaders/OBJLoader2';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { objectsConfig } from "./objects-config";
import ObjectMaterialType from '../materials/object-material-type';

const loaderGltf = new GLTFLoader();

const loadGltf = (params, onComplete) => {
  loaderGltf.load(params.path, onComplete);
};

const loadObj = (params, onComplete) => {
  // В отличие от лоэдера GLTFLoader OBJLoader2 сам является объектом, в котором будет размещена геометрия Mesh.
  // Поэтому OBJLoader2 нужно инстанциировать при каждой новой загрузке.

  const loaderObj = new OBJLoader2();

  loaderObj.load(params.path, onComplete);
};

export const loadObjectModel = (key, config) => {
  const {defaultMaterial, materialsMap} = config;

  return new Promise((resolve) => {
    const params = objectsConfig[key];

    if (!params) {
      resolve(null);

      return;
    }

    const onComplete = (obj3d) => {
      if (!obj3d) {
        resolve(null);

        return;
      }

      const material = params.material === ObjectMaterialType.PARSE 
        ? null
        : materialsMap[params.material || ObjectMaterialType.DEFAULT] 
          || defaultMaterial;

      obj3d.traverse((child) => {
        if (child.isMesh) {
          // Если material отсутствует, парсим имена материалов в загруженных моделях
          // Делаем fallback - материал по умолчанию
          const childMaterial = material 
            || materialsMap[child.material.name || ObjectMaterialType.DEFAULT] 
            || defaultMaterial;

          if (childMaterial) {
            child.material = childMaterial;
          }
        }
      });

      resolve(obj3d);
    };

    const onGltfComplete = (gltf) => {
      onComplete(gltf ? gltf.scene || null : null);
    };

    switch (params.type) {
      case `gltf`:
        loadGltf(params, onGltfComplete);
  
        break;
      default:
        loadObj(params, onComplete);
  
        break;
    }
  });
};

export default loadObjectModel;
