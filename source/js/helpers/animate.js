// animation using raf (render function parameter is value from easing function)
const animateEasing = (render, duration, easing) => new Promise((resolve) => {
  const start = Date.now();
  (function loop() {
    const p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      // set that animation end
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(easing(p));
    }
  }());
});

// animation using raf (render function parameter is progress from 0 to 1)
const animateProgress = (render, duration) => new Promise((resolve) => {
  const start = Date.now();
  (function loop() {
    const p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      // set that animation end
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(p);
    }
  }());
});

// animation using raf (render function parameter is progress from 0 to 1)
const animateDuration = (render, duration) => new Promise((resolve) => {
  const start = Date.now();
  (function loop() {
    const p = Date.now() - start;
    if (p > duration) {
      render(duration);
      // set that animation end
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(p);
    }
  }());
});

export {animateEasing, animateProgress, animateDuration};
