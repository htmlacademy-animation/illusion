import AbstractView from "./abstract-view";
import {setup3d} from "./utils/setup3d";
import NoiseEffectMaterial from "./materials/noise-effect-material";

const THREE = require(`three`);

const createPlaneLayer = () => {
  // Так как плоскость со скетчом нам нужна временно, текстуру заранее не грузим и процесс загрузки не отслеживаем
  const texture = new THREE.TextureLoader().load(`/img/3dPreviews/scene_1_hat_3.png`);
  // Также жестко прописываем размеры текстуры в геометрии
  const geometry = new THREE.PlaneBufferGeometry(1024, 512);
  const material = new NoiseEffectMaterial(2);

  material.uniforms.tDiffuse.value = texture;

  const plane = new THREE.Mesh(geometry, material);

  function update() {
    requestAnimationFrame(update);
    material.uniforms.time.value = performance.now();
    material.needsUpdate = true;
  };

  requestAnimationFrame(update);

  return plane;
};


class PlaneView extends AbstractView {
  setupParameters() {
    super.setupParameters();

    // Расстояние с которого камера будет смотреть на скетч
    // Подбираем вручную, когда сцена готова и рендерится
    this.zDepth = 1100;
  }

  construct() {
    const {
      renderer,
      scene,
      camera
    } = setup3d(this.width, this.height, this.zDepth + 50);
    const plane = createPlaneLayer();

    camera.position.z = this.zDepth;

    scene.add(plane);
    scene.add(camera);

    this.plane = plane;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Если размеры вьюпорта не инициализировались, ничего не делаем
    if (height < 1 || width < 1) {
      return this;
    }

    // 3.1. Настройка Camera
    if (this.width > this.height) {
      // При горизонтальных пропорциях оставляем '35мм'
      this.camera.fov = 35;
    } else {
      // При вертикальной ориентации приближаем сцену в зависимости от пропорций экрана вьюпорта
      this.camera.fov = (32 * this.height) / Math.min(this.width * 1.3, this.height);
    }
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // 3.3. Настройка renderer
    this.renderer.setSize(this.width, this.height);

    return this;
  }
}

export default PlaneView;
