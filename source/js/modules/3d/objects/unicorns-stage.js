import StageGroup from './stage-group';
import loadObjectModel from './load-object-model';
import { degToRadians } from '../utils/math';

const THREE = require(`three`);

class UnicornsStage extends StageGroup {
  setupParams() {
    super.setupParams();

    this.hasLoad = true;
  }

  async loadWithMaterials(config) {
    const framePoleG = new THREE.Group();

    this.mainObject = framePoleG;

    // Кролик
    const mesh = await loadObjectModel(`unicornsUnit`, config);

    const unit = mesh.clone();

    unit.position.x = 1;
    unit.rotation.y = Math.PI;
    framePoleG.add(unit);
    framePoleG.add(mesh);

    framePoleG.position.copy(new THREE.Vector3(-80, -300, 0));
    framePoleG.rotation.copy(new THREE.Euler(0, degToRadians(-40), 0, `YXZ`));

    this.stagePoleG.add(framePoleG);
  }
}

export default UnicornsStage;
