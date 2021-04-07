import StageGroup from './stage-group';
import loadObjectModel from './load-object-model';
import ObjectMaterialType from '../materials/object-material-type';
import {
  getCones,
  getMagicWand,
  getSpheres,
  getTori
} from './parametric-objects';
import {addWithWrapperGroup} from '../utils/object3d';
import {degToRadians} from '../utils/math';

const THREE = require(`three`);

class HatIntroStage extends StageGroup {
  setupParams() {
    super.setupParams();

    this.hasLoad = true;
  }

  constructParametric(config) {
    // Добавляем объекты с параметрическими геометриями

    const {stagePoleG} = this;
    const {defaultMaterial, materialsMap} = config;
    const versicolorMeterial = materialsMap[ObjectMaterialType.VERSICOLOR];

    // - Сферы
    let meshes = getSpheres(defaultMaterial, 3, 65);
    let j = 0;
    let mesh = meshes[j];
    let g = addWithWrapperGroup(mesh, stagePoleG);

    this.addFluctuationConfig(g, 5, 8);
    mesh.position.set(-210, -30, 415);
    this.invisibleOnPortrait.push(g);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.7, 0.7, 0.7);
    mesh.position.set(155, -145, 270);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.54, 0.54, 0.54);
    mesh.position.set(395, 190, -90);
    this.invisibleOnPortrait.push(g);

    // - Конусы
    meshes = getCones(versicolorMeterial, 2);
    j = 0;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g);
    mesh.position.set(290, -117, 345);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-20), 0, degToRadians(-30), `XZY`));
    this.invisibleOnPortrait.push(g);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g);
    mesh.scale.set(1, 1.26, 1);
    mesh.position.set(-260, 165, -70);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-150), 0, degToRadians(45), `XZY`));

    // - Кольца
    meshes = getTori(versicolorMeterial, 2);
    j = 0;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g);
    mesh.position.set(235, -175, -10);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-40), degToRadians(-55), 0, `YXZ`));
    this.invisibleOnPortrait.push(g);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g);
    mesh.position.set(-320, 120, -215);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-20), degToRadians(55), 0, `YXZ`));
    this.invisibleOnPortrait.push(g);

    // - Волшебкая палочка
    mesh = getMagicWand(versicolorMeterial);
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g);
    mesh.position.set(130, -55, 520);
    mesh.rotation.copy(new THREE.Euler(degToRadians(25), 0, degToRadians(75), `ZXY`));
  }

  async loadWithMaterials(config) {
    const {stagePoleG} = this;

    // ПИКИ
    // - Сразу исключаем пики из портретной версии обернув в группу
    const peaksOuterWrapper = new THREE.Group();

    stagePoleG.add(peaksOuterWrapper);
    this.invisibleOnPortrait.push(peaksOuterWrapper);

    let mesh = await loadObjectModel(`peaks`, config);
    let g = addWithWrapperGroup(mesh, peaksOuterWrapper);

    g.name = `peaks`;
    this.addFluctuationConfig(g);
    mesh.scale.set(0.58, 0.58, 0.58);
    mesh.position.set(315, 375, -221);
    mesh.rotation.copy(new THREE.Euler(degToRadians(25), degToRadians(26), degToRadians(40), `XZY`));

    // ШЛЯПА
    mesh = await loadObjectModel(`hat`, config);
    g = addWithWrapperGroup(mesh, stagePoleG);

    mesh.position.copy(new THREE.Vector3(-13, -17, -55));
    mesh.rotation.copy(new THREE.Euler(degToRadians(20), degToRadians(-20), degToRadians(4.5), `YXZ`));

    // Сохраняем ссылку на главный объект сцены
    this.mainObject = g;

    // КРЕСТИ
    mesh = await loadObjectModel(`clubs`, config);
    g = addWithWrapperGroup(mesh, stagePoleG);

    this.addFluctuationConfig(g);
    mesh.position.set(164, 95, 294);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-15), degToRadians(6), degToRadians(20), `XYZ`));

    // ЗВЕЗДА
    mesh = await loadObjectModel(`star`, config);
    g = addWithWrapperGroup(mesh, stagePoleG);

    this.addFluctuationConfig(g);
    mesh.scale.set(0.83, 0.83, 0.83);
    mesh.position.set(-102, -200, 255);
    mesh.rotation.copy(new THREE.Euler(degToRadians(-30), degToRadians(36), degToRadians(35), `YXZ`));
  }
}

export default HatIntroStage;
