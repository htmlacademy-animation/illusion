// whale canvas animation
import {bezierEasing} from '../helpers/cubic-bezier';
import {animateDuration, animateEasing} from '../helpers/animate';
import {runSerial, runSerialLoop} from '../helpers/promise';


let winW;
let winH;
let wFactor;
let hFactor;


const STARS_OPTIONS = [
  // b 6
  { t: `b`, x: 1150, y: 273, s: 4.15, h: 4.15 + 0.4, },
  // b 5
  { t: `b`, x: 1090, y: 525, s: 5.17, h: 5.17 + 0.4, },
  // b 3
  { t: `b`, x: 324,  y: 329, s: 4.52, h: 4.52 + 0.4, },
  // b 2
  { t: `b`, x: 962,  y: 543, s: 3.39, h: 3.39 + 0.4, },
  // b 0
  { t: `b`, x: 466,  y: 253, s: 3.28, h: 3.28 + 0.4, },
  // s 16
  { t: `s`, x: 1079, y: 240, s: 5.41, h: 6.23, },
  // s 15
  { t: `s`, x: 1203, y: 275, s: 5.08, h: 5.54, },
  // s 19
  { t: `s`, x: 350,  y: 368, s: 3.27, h: 4.07, },
  // s 14
  { t: `s`, x: 350,  y: 368, s: 6.02, h: 6.23, },
  // s 13
  { t: `s`, x: 496,  y: 344, s: 5.23, h: 6.21, },
  // s 12
  { t: `s`, x: 1043, y: 170, s: 4.56, h: 5.57, },
  // s 11
  { t: `s`, x: 1071, y: 495, s: 4.28, h: 5.02, },
  // s 10
  { t: `s`, x: 382,  y: 272, s: 4.40, h: 5.41, },
  // s 9
  { t: `s`, x: 462,  y: 372, s: 4.22, h: 5.16, },
  // s 4
  { t: `s`, x: 925,  y: 526, s: 3.49, h: 4.31, },
  // s 3
  { t: `s`, x: 1123, y: 249, s: 3.27, h: 4.21, },
  // s 2
  { t: `s`, x: 494,  y: 284, s: 3.40, h: 4.19, },
  // s 0
  { t: `s`, x: 426,  y: 232, s: 3.33, h: 4.14, },
];


export default class WhaleScene {
  constructor(options) {
    this.canvas = document.querySelector(options.canvas);
    this.ctx = this.canvas.getContext(`2d`);

    this.bodyImg         = new Image();
    this.finImg          = new Image();
    this.tailImg         = new Image();
    this.cloudLeftImg    = new Image();
    this.cloudRightImg   = new Image();
    this.balloonLeftImg  = new Image();
    this.balloonRightImg = new Image();

    this.loadingCounter = 0;

    this.isMobile = false;
    this.isAnimated = false;

    this.startAnimations = [];

    this.posterT = 0;
    this.posterL = 0;
    this.posterHeight = 0;
    this.posterWidth = 0;

    this.bodyWidth;
    this.bodyHeight;
    this.bodyL; // Left
    this.bodyT; // Top

    this.finWidth;
    this.finHeight;
    this.finL;
    this.finT;
    this.finAngle = 0;

    this.tailWidth;
    this.tailHeight;
    this.tailL;
    this.tailT;
    this.tailAngle = 0;

    this.cloudLeftWidth;
    this.cloudLeftHeight;
    this.cloudLeftL;
    this.cloudLeftT;

    this.cloudRightWidth;
    this.cloudRightHeight;
    this.cloudRightL;
    this.cloudRightT;

    this.balloonLeftWidth;
    this.balloonLeftHeight;
    this.balloonLeftL;
    this.balloonLeftT;

    this.balloonRightWidth;
    this.balloonRightHeight;
    this.balloonRightL;
    this.balloonRightT;

    this.cloudsOpacity = 0;

    this.sceneX = 0;
    this.sceneY = 0;
    this.sceneAngle = 0;

    this.moonRadius = 0;
    this.moonDx = 0;
    this.moonEndX = 0;
    this.moonY = 0;
    this.moonRotateAngle = 0;

    this.starsOptions = STARS_OPTIONS;

    this.initEventListeners();
    this.updateSceneSizing();
    this.loadImages();
  }


  increaseLoadingCounter() {
    this.loadingCounter++;

    if (this.loadingCounter === 7) {
      this.drawScene();
    }
  }


  initEventListeners() {
    this.bodyImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.finImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.tailImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.cloudLeftImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.cloudRightImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.balloonLeftImg.onload = () => {
      this.increaseLoadingCounter();
    };

    this.balloonRightImg.onload = () => {
      this.increaseLoadingCounter();
    };
  }


  loadImages() {
    this.bodyImg.src         = `/img/whaleBody.png`;
    this.finImg.src          = `/img/whaleFin.png`;
    this.tailImg.src         = `/img/whaleTail.png`;
    this.cloudLeftImg.src    = `/img/cloudLeft.png`;
    this.cloudRightImg.src   = `/img/cloudRight.png`;
    this.balloonLeftImg.src  = `/img/balloonLeft.png`;
    this.balloonRightImg.src = `/img/balloonRight.png`;
  }


  updateSceneSizing() {
    winW = window.innerWidth;
    winH = window.innerHeight;
    wFactor = window.innerWidth / 1440;
    hFactor = window.innerHeight / 760;

    this.isMobile = winW <= 600;

    this.updateWhaleSizing();
    this.updateCloudsSizing();
    this.updateBalloonsSizing();
  }


  updateWhaleSizing() {
    let factor = wFactor;

    if (this.isMobile) {
      factor *= 1.5;
    }

    this.bodyWidth = Math.round(880 * factor);
    this.bodyHeight = Math.round(this.bodyWidth * 295 / 783);
    this.bodyL = Math.round((winW - this.bodyWidth) / 2);

    if (this.isMobile) {
      this.bodyT = Math.round((winH - this.bodyHeight) / 2 - 120 * factor);
    } else {
      this.bodyT = Math.round((winH - this.bodyHeight) / 2 + 17 * factor);
    }

    this.finWidth = Math.round(200 * factor);
    this.finHeight = Math.round(this.finWidth * 133 / 216);
    this.finL = Math.round(this.bodyL + 310 * factor);
    this.finT = Math.round(this.bodyT + 200 * factor);

    this.tailWidth = Math.round(119 * factor);
    this.tailHeight = Math.round(this.tailWidth * 79 / 119);
    this.tailL = Math.round(this.bodyL + this.bodyWidth - 145 * factor);
    this.tailT = Math.round(this.bodyT + 35 * factor);
  }


  updateCloudsSizing() {
    if (this.isMobile) {
      this.cloudLeftWidth = Math.round(612 * wFactor * 3);
      this.cloudLeftHeight = Math.round(this.cloudLeftWidth * 344 / 612);
      this.cloudLeftL = Math.round(this.bodyL + 180 * wFactor);
      this.cloudLeftT = Math.round(this.bodyT + 100 * wFactor);

      this.cloudRightWidth = Math.round(644 * wFactor * 3.5);
      this.cloudRightHeight = Math.round(this.cloudRightWidth * 270 / 644);
      this.cloudRightL = Math.round(this.bodyL - this.bodyWidth - 540 * wFactor);
      this.cloudRightT = Math.round(this.bodyT - 10 * wFactor * 55);
    } else {
      this.cloudLeftWidth = Math.round(612 * wFactor);
      this.cloudLeftHeight = Math.round(this.cloudLeftWidth * 344 / 612);
      this.cloudLeftL = Math.round(this.bodyL - 180 * wFactor);
      this.cloudLeftT = Math.round(this.bodyT + 100 * wFactor);

      this.cloudRightWidth = Math.round(644 * wFactor);
      this.cloudRightHeight = Math.round(this.cloudRightWidth * 270 / 644);
      this.cloudRightL = Math.round(this.bodyL + this.bodyWidth - 540 * wFactor);
      this.cloudRightT = Math.round(this.bodyT + 10 * wFactor);
    }
  }


  updateBalloonsSizing() {
    let factor = wFactor;

    if (this.isMobile) {
      factor *= 1.5;
    }

    this.balloonLeftWidth = Math.round(149 * factor);
    this.balloonLeftHeight = Math.round(this.balloonLeftWidth * 162 / 149);
    this.balloonLeftL = Math.round(this.bodyL + 140 * factor);
    this.balloonLeftT = Math.round(this.bodyT - 145 * factor);

    this.balloonRightWidth = Math.round(152 * factor);
    this.balloonRightHeight = Math.round(this.balloonRightWidth * 182 / 152);
    this.balloonRightL = Math.round(this.bodyL + 208 * factor);
    this.balloonRightT = Math.round(this.bodyT - 185 * factor);
  }


  drawStar(type, x, y, scale) {
    x *= wFactor;
    y *= hFactor;

    this.ctx.beginPath();


    switch (type) {
      // small star
      case `s`: {
        const size = 7 * scale;

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.moveTo(x + size, y);
        this.ctx.lineTo(x, y + size);

        break;
      }
      // big star
      case `b`: {
        const sizeX = 20 * scale;
        const sizeY = 28 * scale;
        const lx = x - sizeX / 2;
        const ly = y;
        const tx = lx + sizeX / 2;
        const ty = ly - sizeY / 2;
        const rx = lx + sizeX;
        const ry = ly;
        const bx = lx + sizeX / 2;
        const by = ly + sizeY / 2;
        const cx = lx + sizeX / 2;
        const cy = ly;

        this.ctx.moveTo(lx, ly);
        this.ctx.bezierCurveTo(lx, ly, cx - sizeX * 0.06, cy - sizeY * 0.15, tx, ty);
        this.ctx.bezierCurveTo(tx, ty, cx + sizeX * 0.06, cy - sizeY * 0.15, rx, ry);
        this.ctx.bezierCurveTo(rx, ry, cx + sizeX * 0.06, cy + sizeY * 0.15, bx, by);
        this.ctx.bezierCurveTo(bx, by, cx - sizeX * 0.06, cy + sizeY * 0.15, lx, ly);

        break;
      }
    }

    this.ctx.lineJoin = `round`;
    this.ctx.strokeStyle = `#fff`;
    this.ctx.stroke();
  }


  rotateCtx(angle, cx, cy) {
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-cx, -cy);
  }


  drawMoon(x, y, radius, dx, angle) {
    x *= wFactor;
    y *= hFactor;

    this.ctx.save();
    this.rotateCtx(angle, x, y);

    // outer arc
    this.ctx.beginPath();
    let startAngle = Math.PI / 8;
    this.ctx.arc(x, y, radius, startAngle, 2 * Math.PI - startAngle);
    this.ctx.strokeStyle = `#fff`;
    this.ctx.stroke();
    this.ctx.closePath();

    // inner arc
    this.ctx.beginPath();
    startAngle += Math.PI / 24;
    this.ctx.arc(x + dx + 1, y, radius - dx, startAngle, 2 * Math.PI - startAngle);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }


  drawClouds() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.posterL + this.posterWidth, 0);
    this.ctx.lineTo(this.posterL + this.posterWidth, winH);
    this.ctx.lineTo(0, winH);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(
      this.cloudLeftImg,
      this.cloudLeftL,
      this.cloudLeftT,
      this.cloudLeftWidth,
      this.cloudLeftHeight
    );
    this.ctx.restore();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.posterL, 0);
    this.ctx.lineTo(winW, 0);
    this.ctx.lineTo(winW, winH);
    this.ctx.lineTo(this.posterL, winH);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(
      this.cloudRightImg,
      this.cloudRightL,
      this.cloudRightT,
      this.cloudRightWidth,
      this.cloudRightHeight
    );
    this.ctx.restore();
  }


  drawWhale() {
    this.ctx.globalAlpha = 1;
    this.ctx.translate(this.sceneX * wFactor, this.sceneY * wFactor);
    this.rotateCtx(this.sceneAngle, winW / 2, winH / 2);
    this.ctx.drawImage(this.bodyImg, this.bodyL, this.bodyT, this.bodyWidth, this.bodyHeight);

    this.ctx.save();
    this.rotateCtx(this.finAngle, this.finL + 21 * wFactor, this.finT + 31 * wFactor);
    this.ctx.drawImage(this.finImg, this.finL, this.finT, this.finWidth, this.finHeight);
    this.ctx.restore();

    this.ctx.save();
    this.rotateCtx(this.tailAngle, this.tailL + 10 * wFactor, this.tailT + 12 * wFactor);
    this.ctx.drawImage(this.tailImg, this.tailL, this.tailT, this.tailWidth, this.tailHeight);
    this.ctx.restore();
  }


  drawThreads() {
    let factor = wFactor;

    if (this.isMobile) {
      factor *= 1.5;
    }

    // draw thread left
    this.ctx.strokeStyle = `#fff`;
    this.ctx.beginPath();

    const threadLeftBBX = this.bodyL + 370 * factor;
    const threadLeftBBY = this.bodyT + 222 * factor;
    const threadLeftMX  = threadLeftBBX - 84 * factor;
    const threadLeftMY  = threadLeftBBY - 98 * factor;
    const threadLeftBTX = threadLeftMX + 43 * factor;
    const threadLeftBTY = threadLeftMY + 35 * factor;
    const threadLeftBMX = threadLeftMX + 84 * factor;
    const threadLeftBMY = threadLeftMY + 92 * factor;
    const threadLeftT   = threadLeftMY - 110 * factor;
    const threadLeftL   = threadLeftMX - 68 * factor;
    const threadLeftLTY = threadLeftT + 75 * factor;
    const threadLeftLTX = threadLeftL + 25 * factor;

    this.ctx.moveTo(threadLeftL, threadLeftT);
    this.ctx.bezierCurveTo(
      threadLeftL,
      threadLeftT,
      threadLeftLTX,
      threadLeftLTY,
      threadLeftMX,
      threadLeftMY
    );
    this.ctx.bezierCurveTo(
      threadLeftBTX,
      threadLeftBTY,
      threadLeftBMX,
      threadLeftBMY,
      threadLeftBBX,
      threadLeftBBY
    );
    this.ctx.stroke();
    this.ctx.closePath();

    // draw thread right
    const threadRightBBX = this.bodyL + 312 * factor;
    const threadRightBBY = this.bodyT + 234 * factor;
    const threadRightL   = threadRightBBX - 30 * factor;
    const threadRightT   = threadRightBBY - 262 * factor;
    const threadRightLTX = threadRightL + 16 * factor;
    const threadRightLTY = threadRightT + 39 * factor;
    const threadRightMX  = threadRightL + 11 * factor;
    const threadRightMY  = threadRightT + 117 * factor;
    const threadRightBTX = threadRightL + 6 * factor;
    const threadRightBTY = threadRightT + 190 * factor;
    const threadRightBMX = threadRightL + 25 * factor;
    const threadRightBMY = threadRightT + 256 * factor;

    this.ctx.beginPath();
    this.ctx.moveTo(threadRightL, threadRightT);
    this.ctx.bezierCurveTo(
      threadRightL,
      threadRightT,
      threadRightLTX,
      threadRightLTY,
      threadRightMX,
      threadRightMY
    );
    this.ctx.bezierCurveTo(
      threadRightBTX,
      threadRightBTY,
      threadRightBMX,
      threadRightBMY,
      threadRightBBX,
      threadRightBBY
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }


  drawBaloons() {
    this.ctx.drawImage(
      this.balloonLeftImg,
      this.balloonLeftL,
      this.balloonLeftT,
      this.balloonLeftWidth,
      this.balloonLeftHeight
    );

    this.ctx.drawImage(
      this.balloonRightImg,
      this.balloonRightL,
      this.balloonRightT,
      this.balloonRightWidth,
      this.balloonRightHeight
    );
  }


  drawScene() {
    this.canvas.width = winW;
    this.canvas.height = winH;

    this.ctx.clearRect(0, 0, winW, winH);

    if (this.isAnimated) {
      const factor = wFactor < 1 ? wFactor : 1;

      const moonX = this.moonEndX - this.moonRadius * ((-this.moonRotateAngle - 32) * Math.PI / 180) / factor;

      this.drawMoon(moonX, this.moonY, this.moonRadius, this.moonDx, this.moonRotateAngle);

      // Mask for moon
      this.ctx.clearRect(0, 0, this.posterL, winH);

      this.starsOptions.forEach((starOption) => {
        this.drawStar(
          starOption.t,
          starOption.x,
          starOption.y,
          starOption.sc || 0
        );
      });

      this.ctx.globalAlpha = this.cloudsOpacity;

      this.drawClouds();
      this.drawWhale();
      this.drawThreads();
      this.drawBaloons();
    }
  }


  getStarsAnimationTick() {
    return (progress) => {
      this.starsOptions = this.starsOptions.map((starOption) => {
        const showAt = (starOption.s - 3.27) * 1000 || 0;
        const hideAt = (starOption.h - 3.27) * 1000 || 0;

        // set star scale
        switch (starOption.t) {
          // big star
          case `b`: {
            const showEasing = bezierEasing(0.33, 0, 0.06, 1);
            const hideEasing = bezierEasing(0.33, 0, 0.18, 1);
            const showDuration = 200;
            const hideDuration = 650;

            if (progress < hideAt && progress >= showAt) {
              const starScaleProgress = (progress - showAt >= showDuration) ? 1 : (progress - showAt) / showDuration;

              starOption.sc = showEasing(starScaleProgress);
            } else if (progress > hideAt && progress - hideAt < hideDuration) {
              const starScaleProgress = (progress - hideAt >= hideDuration) ? 0 : (progress - hideAt) / hideDuration;

              starOption.sc = 1 - hideEasing(starScaleProgress);
            } else {
              starOption.sc = 0;
            }

            break;
          }
          // small star
          case `s`: {
            starOption.sc = (progress < hideAt && progress >= showAt) ? 1 : 0;
            break;
          }
          // big star
          default: {
            starOption.sc = 0;
          }
        }

        return starOption;
      });
    };
  }


  animateStarsInfinite() {
    const starsAnimations = [
      () => animateDuration(this.getStarsAnimationTick(), 2960),
      () => animateDuration(this.getStarsAnimationTick(), 2960),
      () => animateDuration(this.getStarsAnimationTick(), 2960),
    ];

    runSerial(starsAnimations);
  }


  startStarsAnimationInfinite() {
    const globalAnimationTick = (globalProgress) => {
      if (globalProgress === 0) {
        this.animateStarsInfinite();
      }
    };

    const animations = [
      () => animateDuration(globalAnimationTick, 6000)
    ];

    runSerial(animations).then(this.startStarsAnimationInfinite.bind(this));
  }


  animateClouds() {
    const cloudLeftXTick = (from, to) => (progress) => {
      this.cloudLeftL = from + progress * (to - from);
    };
    const cloudRightXTick = (from, to) => (progress) => {
      this.cloudRightL = from + progress * (to - from);
    };

    let cloudLeftXFrom = (1113 - 612 / 2) * wFactor;

    if (this.isMobile) {
      cloudLeftXFrom = (1113 + 612 / 2) * wFactor;
    }

    const cloudLeftXTo = cloudLeftXFrom - 660 * wFactor;
    const cloudLeftAnimations = [
      () => animateEasing(cloudLeftXTick(cloudLeftXFrom, cloudLeftXTo), 2467, bezierEasing(0.11, 0, 0, 1)),
    ];

    let cloudRightXFrom = (463 - 644 / 2) * wFactor;

    if (this.isMobile) {
      cloudRightXFrom = (463 - 8 * 644 / 2) * wFactor;
    }

    const cloudRightXTo = cloudRightXFrom + 660 * wFactor;
    const cloudRightAnimations = [
      () => animateEasing(cloudRightXTick(cloudRightXFrom, cloudRightXTo), 2467, bezierEasing(0.11, 0, 0, 1)),
    ];

    runSerial(cloudLeftAnimations);
    runSerial(cloudRightAnimations);

    const cloudsOpacityTick = (progress) => {
      this.cloudsOpacity = progress;
    };

    animateEasing(cloudsOpacityTick, 850, bezierEasing(0, 0, 1, 1));
  }


  animateCloudsInfinite() {
    const cloudLeftYTick = (from, to) => (progress) => {
      this.cloudLeftT = from + progress * (to - from);
    };
    const cloudRightYTick = (from, to) => (progress) => {
      this.cloudRightT = from + progress * (to - from);
    };
    const symmetricalEase = bezierEasing(0.33, 0, 0.67, 1);

    const cloudLeftYFrom = this.cloudLeftT;
    const cloudLeftYTo = cloudLeftYFrom - 20 * wFactor;
    const cloudLeftAnimations = [
      () => animateEasing(cloudLeftYTick(cloudLeftYFrom, cloudLeftYTo), 4883, symmetricalEase),
      () => animateEasing(cloudLeftYTick(cloudLeftYTo, cloudLeftYFrom), 4317, symmetricalEase),
    ];

    const cloudRightYFrom = this.cloudRightT;
    const cloudRightYTo = cloudRightYFrom + 20 * wFactor;
    const cloudRightAnimations = [
      () => animateEasing(cloudRightYTick(cloudRightYFrom, cloudRightYTo), 4883, symmetricalEase),
      () => animateEasing(cloudRightYTick(cloudRightYTo, cloudRightYFrom), 4317, symmetricalEase),
    ];

    runSerial(cloudLeftAnimations);
    runSerial(cloudRightAnimations);
  }


  startAnimateClouds() {
    const globalAnimationTick = (globalProgress) => {
      if (globalProgress === 0) {
        this.animateClouds();
      }
    }

    const animations = [
      () => animateDuration(globalAnimationTick, 2467)
    ];

    runSerial(animations).then(this.startAnimateCloudsInfinite.bind(this));
  }


  startAnimateCloudsInfinite() {
    const globalAnimationTick = (globalProgress) => {
      if (globalProgress === 0) {
        this.animateCloudsInfinite();
      }
    };

    const animations = [
      () => animateDuration(globalAnimationTick, 9200)
    ];

    runSerial(animations).then(this.startAnimateCloudsInfinite.bind(this));
  }


  animateMoon() {
    const moonRotateTick = (from, to) => (progress) => {
      this.moonRotateAngle = from + progress * (to - from);
    };

    const moonAnimations = [
      () => animateEasing(moonRotateTick(-550 / wFactor, -20), 2033, bezierEasing(0.55, 0, 0.12, 1)),
      () => animateEasing(moonRotateTick(-20, -37), 683, bezierEasing(0.31, 0, 0.69, 1)),
      () => animateEasing(moonRotateTick(-37, -32), 717, bezierEasing(0.17, 0, 0.69, 1)),
    ];

    runSerial(moonAnimations);
  }


  resetWhale() {
    // Чтобы избежать мелькания картинки в самом первом рендере,
    // сразу перемещает кита за край экрана
    this.sceneX = 1180;
  }


  animateWhaleShow() {
    const whaleXAnimationTick = (progress) => {
      const from = 1180;
      const to = 50;

      this.sceneX = from + progress * (to - from);
    };

    animateEasing(whaleXAnimationTick, 3900, bezierEasing(0.11, 0.26, 0, 1));
  }


  animateWhaleInfinite() {
    const whaleYAnimationTick = (from, to) => (progress) => {
      this.sceneY = from + progress * (to - from);
    };

    const whalePeriod = 6000;
    const symmetricalEase = bezierEasing(0.33, 0, 0.67, 1);

    const whaleYFrom = 80;
    const whaleYTo = 0;
    const whaleYAnimations = [
      () => animateEasing(whaleYAnimationTick(whaleYFrom, whaleYTo), whalePeriod * 0.52, symmetricalEase),
      () => animateEasing(whaleYAnimationTick(whaleYTo, whaleYFrom), whalePeriod * 0.48, symmetricalEase),
    ];

    runSerialLoop(whaleYAnimations);

    const whaleAngleAnimationTick = (from, to) => (progress) => {
      this.sceneAngle = from + progress * (to - from);
    };

    const whaleAnglePhase = whalePeriod * 0.25;
    const whaleAngleStart = 0;
    const whaleAngleFrom = 5;
    const whaleAngleTo = -3;
    const whaleAngleAnimations = [
      () => animateEasing(whaleAngleAnimationTick(whaleAngleFrom, whaleAngleTo), whalePeriod * 0.5, symmetricalEase),
      () => animateEasing(whaleAngleAnimationTick(whaleAngleTo, whaleAngleFrom), whalePeriod * 0.5, symmetricalEase),
    ];

    // Создаёт разницу фаз между колебаниями вверх-вниз и колебаниями угла наклона корпуса кита
    animateEasing(whaleAngleAnimationTick(whaleAngleStart, whaleAngleFrom), whaleAnglePhase, symmetricalEase)
      .then(() => {
        runSerialLoop(whaleAngleAnimations);
      });

    const whaleFinAnimationTick = (from, to) => (progress) => {
      this.finAngle = from + progress * (to - from);
    };

    const whaleFinAnimations = [
      () => animateEasing(whaleFinAnimationTick(26, 3), whalePeriod * 0.39, bezierEasing(0.33, 0, 0.33, 1)),
      () => animateEasing(whaleFinAnimationTick(3, 26), whalePeriod * 0.61, bezierEasing(0.46, 0, 0.67, 1)),
    ];

    runSerialLoop(whaleFinAnimations);

    // Все движения второстепенных частей кроме плавника сдвигаем на одну небольшую величину.
    // Так словно эти части увлекаются движением корпуса и немного от него отстают.
    const whaleSecondaryPartsPhase = whalePeriod * 0.06;

    const whaleTailAnimationTick = (from, to) => (progress) => {
      this.tailAngle = from + progress * (to - from);
    };

    const whaleTailAnimations = [
      () => animateEasing(whaleTailAnimationTick(-20, 7), whalePeriod * 0.54, symmetricalEase),
      () => animateEasing(whaleTailAnimationTick(7, -20), whalePeriod * 0.46, symmetricalEase),
    ];

    animateEasing(whaleTailAnimationTick(-19, -20), whaleSecondaryPartsPhase, symmetricalEase)
      .then(() => {
        runSerialLoop(whaleTailAnimations)
      });

    const balloonLeftYAnimationTick = (from, to) => (progress) => {
      this.balloonLeftT = from + progress * (to - from);
    };

    const balloonLeftYFrom = this.balloonLeftT;
    const balloonLeftYTo = balloonLeftYFrom + 20 * wFactor;
    const balloonLeftYStart = balloonLeftYFrom + 2 * wFactor;
    const balloonLeftYAnimations = [
      () => animateEasing(balloonLeftYAnimationTick(balloonLeftYFrom, balloonLeftYTo), whalePeriod * 0.54, symmetricalEase),
      () => animateEasing(balloonLeftYAnimationTick(balloonLeftYTo, balloonLeftYFrom), whalePeriod * 0.46, symmetricalEase),
    ];

    animateEasing(balloonLeftYAnimationTick(balloonLeftYStart, balloonLeftYFrom), whaleSecondaryPartsPhase, symmetricalEase)
      .then(() => {
        runSerialLoop(balloonLeftYAnimations)
      });

    const balloonLeftXAnimationTick = (from, to) => (progress) => {
      this.balloonLeftL = from + progress * (to - from);
    };

    const balloonLeftXFrom = this.balloonLeftL;
    const balloonLeftXTo = balloonLeftXFrom + 8 * wFactor;
    const balloonLeftXStart = balloonLeftXFrom + 1 * wFactor;
    const balloonLeftXAnimations = [
      () => animateEasing(balloonLeftXAnimationTick(balloonLeftXFrom, balloonLeftXTo), whalePeriod * 0.54, symmetricalEase),
      () => animateEasing(balloonLeftXAnimationTick(balloonLeftXTo, balloonLeftXFrom), whalePeriod * 0.46, symmetricalEase),
    ];

    animateEasing(balloonLeftXAnimationTick(balloonLeftXStart, balloonLeftXFrom), whaleSecondaryPartsPhase, symmetricalEase)
      .then(() => {
        runSerialLoop(balloonLeftXAnimations)
      });

    const balloonRightYAnimationTick = (from, to) => (progress) => {
      this.balloonRightT = from + progress * (to - from);
    };

    const balloonRightYFrom = this.balloonRightT;
    const balloonRightYTo = balloonRightYFrom + 20 * wFactor;
    const balloonRightYStart = balloonRightYFrom + 2 * wFactor;
    const balloonRightYAnimations = [
      () => animateEasing(balloonRightYAnimationTick(balloonRightYFrom, balloonRightYTo), whalePeriod * 0.42, symmetricalEase),
      () => animateEasing(balloonRightYAnimationTick(balloonRightYTo, balloonRightYFrom), whalePeriod * 0.58, symmetricalEase),
    ];

    animateEasing(balloonRightYAnimationTick(balloonRightYStart, balloonRightYFrom), whaleSecondaryPartsPhase, symmetricalEase)
      .then(() => {
        runSerialLoop(balloonRightYAnimations)
      });

    const balloonRightXAnimationTick = (from, to) => (progress) => {
      this.balloonRightL = from + progress * (to - from);
    };

    const balloonRightXFrom = this.balloonRightL;
    const balloonRightXTo = balloonRightXFrom + 5 * wFactor;
    const balloonRightXStart = balloonRightXFrom + 0.5 * wFactor;
    const balloonRightXAnimations = [
      () => animateEasing(balloonRightXAnimationTick(balloonRightXFrom, balloonRightXTo), whalePeriod * 0.42, symmetricalEase),
      () => animateEasing(balloonRightXAnimationTick(balloonRightXTo, balloonRightXFrom), whalePeriod * 0.58, symmetricalEase),
    ];

    animateEasing(balloonRightXAnimationTick(balloonRightXStart, balloonRightXFrom), whaleSecondaryPartsPhase, symmetricalEase)
      .then(() => {
        runSerialLoop(balloonRightXAnimations)
      });
  }


  startAnimationInfinite() {
    const globalAnimationTick = () => {
      this.drawScene();
    };

    const animations = [
      () => animateDuration(globalAnimationTick, 6000)
    ];

    runSerial(animations).then(this.startAnimationInfinite.bind(this));
  }


  reset() {
    this.resetWhale();
  }


  startAnimation(options) {
    this.posterT = options.posterT;
    this.posterL = options.posterL;
    this.posterHeight = options.posterHeight;
    this.posterWidth = options.posterWidth;

    this.moonRadius = (this.posterHeight / 8.7);
    this.moonDx = (this.posterWidth / 20);
    this.moonEndX = (this.posterL + this.posterWidth + 1.2 * this.moonRadius) / wFactor;
    this.moonY = (this.posterT + this.posterHeight / 6) / hFactor;
    this.moonRotateAngle = -550 / wFactor;

    this.reset();

    if (!this.isAnimated) {
      this.isAnimated = true;

      const globalAnimationTick = (globalProgress) => {
        const showWhaleAnimationDelay = 0;
        const cloudsAnimationDelay = 233;
        const starsAndMoonAnimationDelay = 350;

        if (globalProgress >= showWhaleAnimationDelay && this.startAnimations.indexOf(showWhaleAnimationDelay) < 0) {
          this.startAnimations.push(showWhaleAnimationDelay);

          this.animateWhaleShow();
          this.animateWhaleInfinite();
          this.startAnimationInfinite();
        }

        if (globalProgress >= starsAndMoonAnimationDelay && this.startAnimations.indexOf(starsAndMoonAnimationDelay) < 0) {
          this.startAnimations.push(starsAndMoonAnimationDelay);

          if (!this.isMobile) {
            this.startStarsAnimationInfinite();
            this.animateMoon();
          }
        }

        if (globalProgress >= cloudsAnimationDelay && this.startAnimations.indexOf(cloudsAnimationDelay) < 0) {
          this.startAnimations.push(cloudsAnimationDelay);

          this.startAnimateClouds();
        }
      };

      animateDuration(globalAnimationTick, 3900);
    }
  }
}
