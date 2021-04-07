import StageGroup from './stage-group';
import loadObjectModel from './load-object-model';
import {degToRadians} from '../utils/math';

const THREE = require(`three`);

class RabbitStage extends StageGroup {
  setupParams() {
    super.setupParams();

    this.hasLoad = true;
  }

  async loadWithMaterials(config) {
    // Кролик
    const mesh = await loadObjectModel(`rabbit`, config);

    this.mainObject = mesh;
    mesh.position.copy(new THREE.Vector3(0, -275, -55));
    mesh.rotation.copy(new THREE.Euler(0, degToRadians(145), 0, `YXZ`));
    this.stagePoleG.add(mesh);
  }
}

export default RabbitStage;
