import {WEBGL} from 'three/examples/jsm/WebGL';

import Stages3DView from './3d/stages-3d-view';

// Карты соответствия идентификаторов разделов сайта и состояний сцен 3d-фона
const object3dSchema = {
  'top': `stage1`,
  'about': `stage2`,
  'numbers': `stage3`,
  'show': `stage4`,
  'mc': `stage5`,
  'map': `stage6`,
  'tickets': `stage6`
};

const globalStateStorage = {
  screenName: 'top',
  slideId: -1
};

const updateGlobalState = (evt) => {
  const {screenName, slideId} = evt.detail;

  if (typeof screenName !== `undefined`) {
    globalStateStorage.screenName = screenName;
  }
  if (typeof slideId !== `undefined` && slideId > -1) {
    globalStateStorage.slideId = slideId;
  }
};

document.body.addEventListener(`screenChanged`, updateGlobalState);

const appendRendererToDOMElement = (object, targetNode) => {
  if (!object.renderer) return;
  targetNode.appendChild(object.renderer.domElement);
};

class ThreeBackground {
  constructor() {
    // Флаг, определяющий версию сцен:
    // - с рендерингом материалов на основе данных о свете:
    // isLightMode = false;
    // - с материалами THREE.MeshMatcapMaterial:
    // isLightMode = true;

    const isLightMode = window.innerWidth < 1025 && window.innerHeight < 1025;

    const view3d = new Stages3DView({isLightMode});

    if (WEBGL.isWebGLAvailable()) {
      // Временно размещаем сцены в пространстве, одну над другой.
      // Мы рассчитаем их конечное расположение при настройке траекторий полета камеры.
      view3d.stage1.position.y = 0;
      view3d.stage2.position.y = 2000;
      view3d.stage3.position.y = 4000;
      view3d.stage5.position.y = 8000;

      appendRendererToDOMElement(view3d, document.querySelector(`.animation-screen`));

      this.view3d = view3d;
    }
  }

  async load() {
    await this.view3d.load();
  }

  start() {
    const {view3d} = this;

    this.addListeners();
    document.body.removeEventListener(`screenChanged`, updateGlobalState);

    view3d.start();
  }

  addListeners() {
    const {view3d} = this;

    // Устанавливаем текущее состояние, соотвествующее разделу
    view3d.setState(object3dSchema[globalStateStorage.screenName], globalStateStorage.slideId);

    // Добавляем слушателя кастомного события screenChanged
    document.body.addEventListener(`screenChanged`, (evt) => {
      updateGlobalState(evt);
      view3d.setState(object3dSchema[globalStateStorage.screenName], globalStateStorage.slideId);

      // Временно задаем координаты камеры для каждого экрана, чтобы была возможность
      // проверять расположение объектов в каждой группе.
      const cameraPositionsY = {
        top: 1,
        about: 2000,
        numbers: 4000,
        show: 6000,
        mc: 8000,
      };

      const position = cameraPositionsY[evt.detail.screenName];

      if (position) {
        view3d.camera.position.y = position;
      }
    });
  }
}

export default ThreeBackground;
