// Чтобы уменьшить вес bundle, пишем собственный Tween под наши конкретные нужды

class Tween {
  constructor(targetObject, newParameters, duration, onComplete) {
    this.targetObject = targetObject;
    this.duration = duration;

    // Проверяем, меняются ли какие-либо параметры объека
    const params = Object.keys(newParameters)
      .filter((param) => targetObject[param] !== newParameters[param]);
    this.params = params.map((paramName) => ({
      paramName,
      from: targetObject[paramName],
      to: newParameters[paramName]
    }));

    // Начальное состояние
    this.startTime = -1;
    this.progress = 0;
    this.isComplete = false;

    // Callback
    this.hasOnComplete = typeof onComplete === `function`;
    this.onComplete = this.hasOnComplete ? onComplete : null;
  }

  invalidate(dt, t) {
    if (Number.isNaN(t) || typeof t === 'undefined') return;
    if (this.isComplete) return;

    if (this.params.length < 1) {
      this.progress = 1;

      return;
    }

    if (this.progress >= 1) {
      if (!this.isComplete) {
        this.stop();
      }

      return;
    }

    if (this.startTime < 0) {
      if (t) {
        this.startTime = t;
      }

      return;
    }

    let progress = ((t - this.startTime) * 0.001) / this.duration;
    let easeProgress = progress;

    if (progress > 1) {
      progress = 1;
    }

    this.progress = progress;

    //  Smoother end:
    const pseudoHalf1 = 1 / 5;
    const pseudoHalf2 = 4 / 5;

    if (easeProgress < pseudoHalf1) {
      easeProgress = pseudoHalf1 * (1 - Math.cos((progress * Math.PI) / (2 * pseudoHalf1)));
    } else {
      easeProgress = pseudoHalf1 + pseudoHalf2 * Math.sin(((progress - pseudoHalf1) * Math.PI) / (2 * pseudoHalf2));
    }

    this.params.forEach(({paramName, from, to}) => {
      this.targetObject[paramName] = from + (to - from) * easeProgress;
    });
  }

  stop() {
    if (this.hasOnComplete) {
      this.onComplete.call(null);
    }
    this.isComplete = true;
  }

  kill() {
    this.isComplete = true;
  }
}

export default Tween;

