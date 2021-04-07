import {degToRadians} from './utils/math';

const THREE = require(`three`);

// Camera Rig Settings
export const cameraRigSettings = {
  deltaDepth: 1750,
  distance: 1500,
  startDistance: 1800,
  radius0: 550,
  radius1: 1050,
  deltaHorizonAngle: degToRadians(120),
  aroundAmplitude: degToRadians(6),
  pitchAmplitude: degToRadians(2)
};

class CameraRig {
  constructor() {
    this.setupInternalParameters();
    this.construct();
    this.invalidate();
  }

  setupInternalParameters() {
    this._depth = 0;
    this._dollyLength = cameraRigSettings.startDistance;
    this._polePosition = cameraRigSettings.radius0;
    this._horizonAngle = 0;
    this._aroundAngle = 0;
    this._pitchAngle = 0;
    this._targetAroundAngle = 0;
    this._targetPitchAngle = 0;
    this._depthChanged = true;
    this._dollyLengthChanged = true;
    this._polePositionChanged = true;
    this._horizonAngleChanged = true;
    this._aroundAngleChanged = true;
    this._pitchAngleChanged = true;
  }

  construct() {
    // 1.1. Части
    const root = new THREE.Group();
    const dollyBend = new THREE.Group();
    const poleHand = new THREE.Group();
    const cameraNull = new THREE.Group();

    // 1.2. Соединения
    root.add(dollyBend);
    dollyBend.add(poleHand);
    poleHand.add(cameraNull);

    // Ссылки
    this.root = root;
    this.dollyBend = dollyBend;
    this.poleHand = poleHand;
    this.cameraNull = cameraNull;
  }

  set depth(value) {
    if (value === this._depth) {
      return;
    }
    this._depth = value;
    this._depthChanged = true;
  }

  get depth() {
    return this._depth;
  }

  set dollyLength(value) {
    if (value === this._dollyLength) {
      return;
    }
    // dollyLength must be positive
    if (value < 0) {
      this._dollyLength = 0;
      this._dollyLengthChanged = true;

      return;
    }
    this._dollyLength = value;
    this._dollyLengthChanged = true;
  }

  get dollyLength() {
    return this._dollyLength;
  }

  set polePosition(value) {
    if (value === this._polePosition) {
      return;
    }
    this._polePosition = value;
    this._polePositionChanged = true;
  }

  get polePosition() {
    return this._polePosition;
  }

  set horizonAngle(value) {
    if (value === this._horizonAngle) {
      return;
    }
    this._horizonAngle = value;
    this._horizonAngleChanged = true;
  }

  get horizonAngle() {
    return this._horizonAngle;
  }

  // Параметры для реакции на движение курсора
  set aroundAngle(value) {
    if (value === this._aroundAngle) {
      return;
    }
    this._aroundAngle = value;
    this._aroundAngleChanged = true;
  }

  get aroundAngle() {
    return this._aroundAngle;
  }

  set pitchAngle(value) {
    if (value === this._pitchAngle) {
      return;
    }
    this._pitchAngle = value;
    this._pitchAngleChanged = true;
  }

  get pitchAngle() {
    return this._pitchAngle;
  }

  set targetAroundAngle(value) {
    if (value === this._targetAroundAngle) {
      return;
    }
    this._targetAroundAngle = value;
    this._aroundAngleChanged = true;
  }

  get targetAroundAngle() {
    return this._targetAroundAngle;
  }

  set targetPitchAngle(value) {
    if (value === this._targetPitchAngle) {
      return;
    }
    this._targetPitchAngle = value;
    this._pitchAngleChanged = true;
  }

  get targetPitchAngle() {
    return this._targetPitchAngle;
  }

  invalidate() {
    if (this._depthChanged) {
      this.root.position.z = -this._depth;
      this._depthChanged = false;
    }

    if (this._dollyLengthChanged || this._horizonAngleChanged) {
      // Set new position

      this.dollyBend.position.z = this._dollyLength;
      this.dollyBend.rotation.z = this._horizonAngle;

      this._dollyLengthChanged = false;
      this._horizonAngleChanged = false;
    }

    if (this._polePositionChanged) {
      // Set new position

      this.poleHand.position.y = this._polePosition;

      this._polePositionChanged = false;
    }

    if (this._aroundAngleChanged || this._targetAroundAngle !== this._aroundAngle) {
      if (Math.abs(this._targetAroundAngle - this._aroundAngle) < 0.001) {
        this._aroundAngle = this._targetAroundAngle;
      } else {
        this._aroundAngle += (this._targetAroundAngle - this._aroundAngle) * 0.25;
      }

      this.root.rotation.y = this._aroundAngle;
      this._aroundAngleChanged = false;
    }

    if (this._pitchAngleChanged || this._targetPitchAngle !== this._pitchAngle) {
      if (Math.abs(this._targetPitchAngle - this._pitchAngle) < 0.001) {
        this._pitchAngle = this._targetPitchAngle;
      } else {
        this._pitchAngle += (this._targetPitchAngle - this._pitchAngle) * 0.25;
      }

      this.root.rotation.x = this._pitchAngle;
      this._pitchAngleChanged = false;
    }
  }
}

export default CameraRig;
