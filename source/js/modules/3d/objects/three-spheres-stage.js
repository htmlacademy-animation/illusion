import StageGroup from './stage-group';
import ObjectMaterialType from '../materials/object-material-type';
import {
  getSpheres
} from './parametric-objects';
import {addWithWrapperGroup} from '../utils/object3d';

const THREE = require(`three`);

class ThreeSpheresStage extends StageGroup {
  setupParams() {
    super.setupParams();

    // Чтобы при ресайзе размещать сферы по оси х в зависимости от пропорций экрана,
    // Созраняем положения для размера макета
    this.sphereXPositions = [155, -370, 495, 770, -1495];
  }

  constructParametric(config) {
    // Добавляем объекты с параметрическими геометриями

    const {stagePoleG, sphereXPositions} = this;
    const {defaultMaterial} = config;

    const meshes = getSpheres(defaultMaterial, 5, 65);
    let j = 0;
    let mesh = meshes[j];
    let g = addWithWrapperGroup(mesh, stagePoleG);

    this.addFluctuationConfig(g, 5, 8);
    mesh.position.set(sphereXPositions[j], -145, 370);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.9, 0.9, 0.9);
    mesh.position.set(sphereXPositions[j], 30, 115);

    j += 1;
    mesh = meshes[j];
    g = addWithWrapperGroup(mesh, stagePoleG);
    this.addFluctuationConfig(g, 5, 8);
    mesh.scale.set(0.9, 0.9, 0.9);
    mesh.position.set(sphereXPositions[j], 190, -690);

    // Дополнительные сферы, чтобы заполнить пространство, 
    // которое видно при переходе между сценами
    j += 1;
    mesh = meshes[j];
    mesh.scale.set(0.55, 0.55, 0.55);
    mesh.position.set(sphereXPositions[j], 30, 1015);
    stagePoleG.add(mesh);

    j += 1;
    mesh = meshes[j];
    mesh.scale.set(0.7, 0.7, 0.7);
    mesh.position.set(sphereXPositions[j], -690, -1090);
    stagePoleG.add(mesh);

    // Сохраняем ссылки на сферы для ремайза
    this.spheres = meshes;
  }

  updateSizeMode(isLandscape) {
    super.updateSizeMode(isLandscape);

    if (!this.sphere) return;

    const xs = this.sphereXPositions;

    this.spheres.forEach((mesh, j) => {
      mesh.position.x = xs[j] * (isLandscape ? 1 : 0.6);
    });
  }
}

export default ThreeSpheresStage;
