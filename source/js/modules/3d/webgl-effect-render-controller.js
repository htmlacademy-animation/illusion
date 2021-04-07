import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass';
import ViewportRadialGradientMaterial from './materials/viewport-radial-gradient-material';
import NoiseEffectMaterial from './materials/noise-effect-material';

const THREE = require(`three`);

const constructComposer = (renderer, scene, camera, backMatrial, effectMaterial) => {
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);

  composer.setPixelRatio(window.devicePixelRatio);

  // Отключает очистку экрана перед рендером
  // Таким образом после рендера фона сцена рендерится поверх градиента
  renderer.autoClearColor = false;

  // Сначала рендер фона
  composer.addPass(new ShaderPass(backMatrial, `tDiffuse`));
  // Далее рендер сцены
  composer.addPass(renderPass);
  // Добавление шума к результирущей картинке
  composer.addPass(new ShaderPass(effectMaterial, `tDiffuse`));

  return composer;
};

class WebglEffectRenderController {
  constructor(renderer, scene, camera) {
    this.setupParameters();
    this.construct(renderer, scene, camera);
  }

  setupParameters() {
    // Настройки
    this.maxNoiseAmplitude = 0.6;
    this.transitionDuration = 1;

    // Управление дискретными именованными состояниями
    this.states = [`default`, `off`];
    this.stateName = null;
    
    // Время для отрисовки эффекта
    this.timeStart = -1;

    // Таймстепм начала перехода ON/OFF эффекта
    this.transitionStart = -1;
    // -1 означает неинициализированное численное значение
  }

  construct(renderer, scene, camera) {
    const basicBackgroundColor = 0x060506;
    const centerBackgroundColor = 0x333130;
    const effectMaterial = new NoiseEffectMaterial(this.maxNoiseAmplitude);

    this.composer = constructComposer(
      renderer, 
      scene, 
      camera, 
      new ViewportRadialGradientMaterial(basicBackgroundColor, centerBackgroundColor), 
      effectMaterial
      );
    this.effectMaterial = effectMaterial;
  }

  render() {
    const t = Date.now();
    const material = this.effectMaterial;

    // 1. Если время не инициализировано, запоминаем начальный таймстемп
    // Иначе устанавливаем новое значение uniform времени
    if (this.timeStart < 0) {
      this.timeStart = t;
    } else {
      material.uniforms.time.value = (t - this.timeStart) * 0.001;
    }

    // 2. Если таймстемп перехода ON/OFF установлен, значит переход находится в процессе
    // В этом случае производим расчёт и устанавливаем новое значение uniform прогресса
    if (this.transitionStart > 0) {
      const time = (t - this.transitionStart) * 0.001;

      // Если переход закончился, сбрасываем таймстемп
      if (time > this.transitionDuration) {
        this.transitionStart = -1;
      }

      material.uniforms.transitionProgress.value = time / this.transitionDuration;
    }

    // 3. Рендерим
    this.composer.render();
  }

  isStateValid(stateName) {
    return this.states.includes(stateName);
  }

  setState(stateName) {
    if (!this.isStateValid(stateName) || this.stateName === stateName) {
      return;
    }
    
    const material = this.effectMaterial;

    this.stateName = stateName;

    // Сохраняем значение для предыдущего состояния, 
    // чтобы в шейдере расчитать промежуточное значение во время перехода
    material.uniforms.prevNoiseAmplitude.value = material.uniforms.noiseAmplitude.value;
    material.uniforms.noiseAmplitude.value = stateName === `off` ? 0 : this.maxNoiseAmplitude;

    // Запускаем переход, записав таймстемп
    this.transitionStart = Date.now();
  }
}

export default WebglEffectRenderController;
