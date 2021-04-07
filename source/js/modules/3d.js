import {WEBGL} from 'three/examples/jsm/WebGL';

import PlaneScene from './3d/webgl-plane-view';

const appendRendererToDOMElement = (object, targetNode) => {
  if (!object.renderer) return;
  targetNode.appendChild(object.renderer.domElement);
};

class ThreeBackground {
  constructor() {
    const view3d = new PlaneScene();

    if (WEBGL.isWebGLAvailable()) {
      appendRendererToDOMElement(view3d, document.querySelector(`.animation-screen`));

      this.view3d = view3d;
    }
  }

  start() {
    const {view3d} = this;

    view3d.start();
  }
}

export default ThreeBackground;
