import Tween from './utils/Tween';
import AbstractView from './abstract-view';
import ObjectMaterialType from './materials/object-material-type';
import loadTextures from './materials/load-textures';
import {setup3d} from "./utils/setup3d";
import { constructMaterialsMap, getMatcapTexturesPaths } from './materials/project-materials';
import StageGroup from './objects/stage-group';
import HatIntroStage from './objects/hat-intro-stage';
import ThreeSpheresStage from './objects/three-spheres-stage';
import StarAndWandStage from './objects/star-and-wand-stage';
import KeyStage from './objects/key-stage';
import RabbitStage from './objects/rabbit-stage';
import UnicornsStage from './objects/unicorns-stage';

const THREE = require(`three`);

const createLightSources = () => {
  const lightRoot = new THREE.Group();
    const lights = [];

    const sphere = new THREE.SphereBufferGeometry(5, 16, 8);

    // Сначала ставим 1-2 источника, чтобы осветить объекты и работать с ними: расставить в пространстве
    // После того как поставили 1-2 сцены, подбираем интенсивности источников и их положение так,
    // чтобы получить похожую на скетч картинку
    // Показываем дизайнеру или арт-директору. Если необходимо, попрваляем параметры

    // - Light 0
    let lightUnit = new THREE.PointLight(0xfff5e8, 0.98);

    let mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xff0000}));

    lightUnit.add(mesh);

    lightUnit.position.set(-1225, 20, -820);

    lights.push(lightUnit);
    lightRoot.add(lightUnit);

    // - Light 1
    lightUnit = new THREE.PointLight(0xf6ebff, 0.95);
    mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x0000ff}));
    lightUnit.add(mesh);

    lightUnit.position.set(940, 960, -628);

    lights.push(lightUnit);
    lightRoot.add(lightUnit);

    // - Light 2
    lightUnit = new THREE.PointLight(0xf2e0ff, 0.7);
    mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x00ff00}));
    lightUnit.add(mesh);

    lightUnit.position.set(1400, -962, -1610);

    lights.push(lightUnit);
    lightRoot.add(lightUnit);

    return {
      lights,
      lightRoot
    };
};

const addCameraRigToViewObject = (viewObject, rig) => {
  const {camera, scene} = viewObject;

  // Сбрасываем коортинаты камеры,
  // чтобы положение камеры полностью определялось ригом
  camera.position.set(0, 0, 0);

  scene.add(rig.root);
  rig.cameraNull.add(camera);

  viewObject.cameraRig = rig;

  return rig;
};

class Stages3DView extends AbstractView {
  setupParameters(params) {
    super.setupParameters(params);

    this.isLightMode = params.isLightMode;

    // Наличие ключа означает, что такое состояние существует
    // А Boolean значение определяет, есть ли в этом состоянии какие-либо объекты на сцене
    this.statesMap = {
      stage1: true,
      stage2: true,
      stage3: true,
      stage4: false,
      stage5: true,
      stage6: false
    };
    this.statesForceRenderMap = {
      stage4: true
    };

    this.stateName = null;
    this.prevStateName = null;

    // Флаг, сообщающий о необходимости обновить аниацию принудительно
    this.forceInvalidate = false;

    // ВременнЫе параметры
    this.initiationTime = Date.now();
    this.startTime = 0;
    this.time = 0;

    // Расстояние с которого камера будет смотреть на скетч
    // Подбираем вручную, когда сцена готова и рендерится
    this.zDepth = 1500;

    this.addOn = null;
  }

  construct() {
    const {
      renderer,
      scene,
      camera
    } = setup3d(this.width, this.height, 5500);

    camera.position.z = this.zDepth;
    scene.add(camera);

    if (!this.isLiteMode) {
      const {lightRoot} = createLightSources();

      // Добавляем источники света к камере,
      // чтобы они двигались вместе с ней
      // и освещали группы объектов, которые видны на экране
      camera.add(lightRoot);
    }

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.add3dStages();
    this.resize();
  }

  installAddOn(config) {
    this.addOn = config;

    if (config.rig) addCameraRigToViewObject(this, config.rig);
  }

  async load() {
    const config = await this.loadMaterials();

    this.stages.forEach((stage) => { if (stage) stage.constructParametric(config) });

    await Promise.all(this.stagesToLoad.map((stage) => stage.loadWithMaterials(config)));
  }

  add3dStages() {
    const stages = [];
    const stagesToLoad = [];

    const addStage = (name, stage, map, storeArr, parent) => {
      // По умолчанию скрываем группу
      // stage.visible = false;

      // Добавляем везде:
      // - на сцену с помощью родителя
      parent = parent || this.scene;
      parent.add(stage);

      // - в массиве
      storeArr = storeArr || stages;
      storeArr.push(stage);

      // - в массиве для загрузки моделей
      if (stage.hasLoad) stagesToLoad.push(stage);

      // - в объект по ключу
      if (map) {
        map[name] = stage;
      }
    };

    addStage(`stage1`, new HatIntroStage(), this);
    addStage(`stage2`, new ThreeSpheresStage, this);
    addStage(`stage3`, new StarAndWandStage(), this);

    // Добавляем пробел между stage3 и stage5
    stages.push(null);
    this.stage4 = null;

    // Добавляем контейнер для подразделов на странице Мастер-классов
    const stage = new StageGroup();

    addStage(`stage5`, stage, this);

    addStage(`sub5-1`, new KeyStage(), null, stage.substages, stage.stagePoleG);
    addStage(`sub5-2`, new RabbitStage(), null, stage.substages, stage.stagePoleG);
    addStage(`sub5-3`, new UnicornsStage(), null, stage.substages, stage.stagePoleG);

    const distance = 1500;
    const deltaAngle = (2 * Math.PI) / stage.substages.length;

    stage.substages.forEach((substage, i) => {
      const {stagePoleG} = substage;

      stagePoleG.position.z = -distance;
      substage.rotation.y = Math.PI * 2 - i * deltaAngle;
    });
    stage.hasSubstages = true;

    // Добавляем пробел под последний раздел
    stages.push(null);
    this.stage6 = null;

    this.stages = stages;
    this.stagesToLoad = stagesToLoad;
  }

  async loadMaterials() {
    const textures = await loadTextures(getMatcapTexturesPaths());

    const config = {
      materialsMap: constructMaterialsMap(textures, this.isLightMode)
    };

    config.defaultMaterial = config.materialsMap[ObjectMaterialType.DEFAULT];

    return config;
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.width = width;
    this.height = height;

    if (height < 1 || width < 1) {
      return this;
    }

    this.updateCamera(width, height);

    // Меняем композиции сцен в зависимости от ориентации
    const isLandscape = width / height > 1.3 && width > 768;

    if (this.forceInvalidate) {
      // Обновляем принудительно
      this.updateSizeMode(isLandscape);
    } else {
      // Ожидаем, когда пользователь завершит изменение размера окна
      if (this.resizeTimeout)  clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.updateSizeMode(isLandscape);
      }, 1000);
    }

    // Передаем размеры в renderer
    this.renderer.setSize(width, height);

    return this;
  }

  updateCamera(width, height) {
    const {camera} = this;

    // Меняем настройки камеры,
    // чтобы в портретной ориентации уменьшить обзор и показать объекты крупнее
    if (width > height) {
      camera.fov = 35;
    } else {
      camera.fov = (32 * height) / Math.min(width * 1.3, height);
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  updateSizeMode(isLandscape) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }

    // Передаем данные об ориентации
    this.stages.forEach((stage) => {
      if (!stage) return;

      stage.updateSizeMode(isLandscape);
    });
  }

  render() {
    // Перед рендером нужно обновить состояния анимации
    const t = Date.now();

    this.invalidate(t - this.time, t - this.startTime);

    this.time = t;

    super.render();
  }

  play() {
    if (!this.stateName || !(this.hasStateObjects(this.stateName) || this.hasForceRender(this.stateName))) return;

    this.startTime = Date.now();
    this.forceInvalidate = true;

    this.invalidate(0);
    super.play();
  }

  invalidate(dt, time) {
    if (!this.started && !this.forceInvalidate) {
      return this;
    }

    // Stages invalidation
    this.stages.forEach((stage) => {
      if (!stage || !stage.visible) {
        return;
      }

      stage.invalidate(dt, time);

      if (stage.hasSubstages) {
        stage.substages.forEach((sub) => {
          sub.invalidate(dt, time);
        });
      }
    });

    // Tween invalidation
    const {tweens} = this;

    if (tweens && tweens.length > 0) {
      let i = tweens.length - 1;

      while (tweens.length > 0 && i > -1) {
        const tween = tweens[i];

        tween.invalidate(dt, time);
        if (tween.isComplete) {
          tweens.splice(i, 1);
        }
        i -= 1;
      }
      if (tweens.length < 1) this.tweens = null;
    }

    // AddOn invalidation
    if (this.addOn && typeof this.addOn.invalidate === `function`) {
      this.addOn.invalidate(dt, time);
    }

    // Сброс
    this.forceInvalidate = false;

    return this;
  }

  // STATES
  isStateValid(stateName) {
    return Object.keys(this.statesMap).includes(stateName);
  }

  hasStateObjects(stateName) {
    return this.isStateValid(stateName) && this.statesMap[stateName];
  }

  hasForceRender(stateName) {
    return this.isStateValid(stateName) && this.statesForceRenderMap[stateName];
  }

  setState(stateName, substage) {
    let stage;
    let prevStateName = null;

    if (!this.isStateValid(stateName)) {
      return;
    }

    if (this.stateName === stateName) {
      stage = this[stateName];
      if (stage && (!stage.hasSubstages || stage.currentSubstage === substage)) {
        return;
      }
    } else {
      this.prevStateName = this.stateName;
      prevStateName = this.stateName;
    }

    this.stateName = stateName;

    // Clear Tweens
    this.killTweens();

    let doPause = true;

    if (stateName && this.hasStateObjects(stateName)) {
      stage = this[stateName];
      stage.visible = true;

      if (stage.hasSubstages && substage > -1 && substage < stage.substages.length) {
        // Скрываем предыдущий подраздел
        if (stage.currentSubstage > -1 && stage.currentSubstage !== substage) {
          stage.prevSubstage = stage.currentSubstage;
        }
        // Показываем новый
        stage.substages[substage].visible = true;
        // Сохраняем текущий индекс
        stage.currentSubstage = substage;
      } else {
        // Если подразделов нет, ставим значение по умолчанию
        stage.currentSubstage = -1;
      }

      // Начинаем проигрывать анимацию и рендерить,
      // если в новом разделе есть объекты
      doPause = false;
    }

    // Начинаем проигрывать анимацию и рендерить,
    // если в разделе есть принудительный рендер, например, для эффекта
    if (this.hasForceRender(stateName)) doPause = false;

    if (!doPause && this.started) {
      this.play();
    }

    this.changeStateTo(
      stateName,
      stage ? stage.currentSubstage : -1,
      () => {
        // On complete:

        // 1) Скрываем предыдущую сцену
        if (prevStateName && this.hasStateObjects(prevStateName)) {
          const prevStage = this[prevStateName];

          // prevStage.visible = false;
          this.prevStateName = null;
        }
        if (stage && stage.hasSubstages && stage.prevSubstage) {
          // stage.substages[stage.prevSubstage].visible = false;
          stage.prevSubstage = null;
        }

        // 2) Останавливаем анимацию и рендер,
        // если в текущем разделе нет объектов
        if (doPause) {
          this.pause();
        }

        // 3) Очищаем массив Tween
        this.mainTween = null;
      },
      (Date.now() - this.initiationTime) * 0.001 < 1.5
    );
  }

  changeStateTo(stateName, substage, onComplete, enforce = false) {
    this.killTweens();

    let currentIndex = parseInt(stateName.substring(5), 10) - 1;

    if (Number.isNaN(currentIndex)) {
      currentIndex = 0;
    }

    // 1) Вращаем сцену в подразделами, чтобы вывести на экран нужный объект
    const {stage5} =this;
    let newRotationY = stage5.rotationY;
    let hasTweenCallback = false;
    let tweens = [];

    // Подразделы имеются только в мастер-классах,
    // поэтому связываем параметр substage напрямую с вращением stage5
    if (stage5.substages.length > 0) {
      newRotationY = Math.PI * 2 * (1 - (substage < 0 ? 0 : substage) / stage5.substages.length);

      // Normalize current angle
      if (stage5.rotationY < 0) {
        stage5.rotationY += Math.PI * 2;
      }
      if (stage5.rotationY > Math.PI * 2) {
        stage5.rotationY -= Math.PI * 2;
      }

      const sign = newRotationY > stage5.rotationY ? 1 : -1;

      if (Math.abs(newRotationY - stage5.rotationY) > Math.abs(newRotationY - sign * Math.PI * 2 - stage5.rotationY)) {
        newRotationY -= sign * Math.PI * 2;
      }

      // Если значение вращения поменялось, создаем Tween
      if (newRotationY !== stage5.rotationY) {
        tweens.push(new Tween(
          stage5,
          { rotationY: newRotationY },
          // Если состояние обновить нужно немедленно, передаем длительность 0
          enforce ? 0 : 1,
          // Чтобы избежать дублирования callback при использовании addOn,
          // вызываем callback, если его нет. Если addOn имеется, callback вызодвется после него
          this.addOn ? null : onComplete
        ));
        hasTweenCallback = true;
      }
    }

    if (this.addOn && typeof this.addOn.changeState === `function`) {
      //
      // 2) Меняем состояние addOn камеры
      this.mainTween = this.addOn.changeState(stateName, substage, onComplete, enforce);

      // 3) Добавляем дополнительно движение скольжения
      // Чтобы больше скрыть сцену на переднем плане и усилить динамику анимации камеры

      tweens = tweens.concat(
        this.stages.map(
          (stage, i) => (stage
            ? new Tween(
              stage.stagePoleG.position,
              {
                x: -Math.max(0, i - currentIndex) * 3000
              },
              enforce ? 0 : 1.5)
            : null)
        )
        .filter((tw) => (tw && tw.params.length > 0))
      );

      hasTweenCallback = true;
    }

    this.tweens = tweens;

    if (hasTweenCallback) {
      return;
    }

    // Вызываем callback сразу, если нет Tween
    if (typeof onComplete === `function`) {
      onComplete.call(null);
    }
  }

  killTweens() {
    if (this.mainTween) {
      this.mainTween.stop();
      this.mainTween = null;
    }

    if (this.tweens) {
      this.tweens.forEach((tween) => tween.stop());
      this.tweens.splice(0, this.tweens.length);
    }
  }
}

export default Stages3DView;
