import StageGroup from './stage-group';
import loadObjectModel from './load-object-model';
import ObjectMaterialType from '../materials/object-material-type';
import {
  getMagicWand,
  getSpheres
} from './parametric-objects';
import {addWithWrapperGroup} from '../utils/object3d';
import {degToRadians} from '../utils/math';

const THREE = require(`three`);

class StarAndWandStage extends StageGroup {
  setupParams() {
    super.setupParams();

    this.hasLoad = true;
  }

  constructParametric(config) {
    // Добавляем объекты с параметрическими геометриями

    const {stagePoleG} = this;
    const {defaultMaterial, materialsMap} = config;
    const versicolorMeterial = materialsMap[ObjectMaterialType.VERSICOLOR];

    // Сферы
    const meshes = getSpheres(defaultMaterial, 4, 65);
    let j = 0;
    let mesh = meshes[j];
    let g = addWithWrapperGroup(mesh, stagePoleG);

    this.addFluctuationConfig(g, 5, 8);
    mesh.position.set(-210, -60, 415);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.6, 0.6, 0.6);
    mesh.position.set(255, -145, 600);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.8, 0.8, 0.8);
    mesh.position.set(495, 190, -800);

    j += 1;
    mesh = meshes[j];
    mesh.scale.set(0.6, 0.6, 0.6);
    mesh.position.set(870, -130, 1015);
    stagePoleG.add(mesh);

    // - Волшебная палочка
    mesh = getMagicWand(versicolorMeterial);
    mesh.position.set(-180, -15, 520);
    mesh.rotation.copy(new THREE.Euler(degToRadians(60), 0, degToRadians(120), `ZXY`));
    stagePoleG.add(mesh);

    this.magicWand = mesh;
  }

  async loadWithMaterials(config) {
    const {stagePoleG} = this;
    
    // ЗВЕЗДА
    const mesh = await loadObjectModel(`star`, config);
    const g = addWithWrapperGroup(mesh, stagePoleG);

    this.star = mesh;
    this.addFluctuationConfig(g);
    mesh.position.set(-402, 100, 255);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-20), degToRadians(36), degToRadians(25), `YXZ`));
  }
}

export default StarAndWandStage;
