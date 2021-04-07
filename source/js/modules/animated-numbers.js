import {animateProgress} from '../helpers/animate';


export default class AnimatedNumbers {
  constructor(options) {
    this.animations = [];
    this.elements = document.querySelectorAll(options.elements);
    this.delay = options.delay || 0;
    this.duration = options.duration || 1000;
    this.durationAttenuation = options.durationAttenuation || 0;
  }


  animate() {
    this.clear();
    this.stopAllAnimations();

    this.timeout = setTimeout(() => {
      this.startAllAnimtions();
    }, this.delay);
  }


  clear() {
    this.elements.forEach((number) => {
      number.innerHTML = `0`;
    });
  }


  startAllAnimtions() {
    this.stopAllAnimations();

    this.elements.forEach((number, index) => {
      const numberStopCount = parseInt(number.dataset.animateCount, 10) || 0;

      this.startAnimationForNumber(
        number, 
        numberStopCount, 
        this.duration + index * this.durationAttenuation, 
        parseInt(number.dataset.animateFps, 10) || 12);
    });
  }


  startAnimationForNumber(element, stopCount, duration, fps) {
    const fpsInterval = 1000 / fps;
    let currentCount = 0;
    let now;
    let then = Date.now();
    let elapsed;

    const animation = animateProgress((progress) => {
      now = Date.now();
      elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        element.innerHTML = currentCount.toString();

        currentCount = Math.ceil(progress * stopCount);
      }
    }, duration);

    animation.then(() => {
      element.innerHTML = stopCount;
    });
  }


  stopAllAnimations() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.animations.length) {
      this.animations.forEach((raf) => cancelAnimationFrame(raf));
    }

    this.animations = [];
  }
}
