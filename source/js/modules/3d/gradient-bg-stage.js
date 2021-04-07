import AbstractView from './abstract-view';
import {setup3d} from "./utils/setup3d";
import ViewportRadialGradientMaterial from './materials/viewport-radial-gradient-material';

const THREE = require(`three`);

class GradientBgStage extends AbstractView {
  setupParameters() {
    super.setupParameters();

    // Расстояние с которого камера будет смотреть на фон
    // Подбираем значение, чтобы скрыть края плоского Mesh
    this.zDepth = 150;
  }

  construct() {
    const {
      renderer,
      scene,
      camera
    } = setup3d(100, 100, this.zDepth * 1.1);

    camera.position.z = this.zDepth;
    scene.add(camera);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera; 

    this.addMesh();
  }

  addMesh() {
    const basicBackgroundColor = 0x060506;
    const centerBackgroundColor = 0x333130;
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100), 
      new ViewportRadialGradientMaterial(basicBackgroundColor, centerBackgroundColor)
    );
    this.bgMesh = bgMesh;
    this.scene.add(bgMesh);
  }
}

export default GradientBgStage;
