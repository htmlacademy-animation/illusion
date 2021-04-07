import {bezierEasing} from '../helpers/cubic-bezier';
import {animateDuration, animateEasing} from '../helpers/animate';
import {runSerial} from '../helpers/promise';
import {startWhaleAnimation} from './whale-canvas-animation';


let ww = window.innerWidth;
let wh = window.innerHeight;
let wd = window.innerWidth / 1440;


export default class Poster {
  constructor(options) {
    this.canvas   = document.querySelector(options.canvas);
    this.ctx      = this.canvas.getContext(`2d`);
    this.bgCanvas = document.querySelector(options.bgCanvas);
    this.bgCtx    = this.bgCanvas.getContext(`2d`);

    this.width  = 0;
    this.height = 0;
    this.L = 0; // Left
    this.T = 0; // Top
    this.R = 0; // Right
    this.B = 0; // Bottom

    this.cornerAlpha = 0;
    this.cornerWidth = 150;
    this.scaleY      = 1;
    this.skewX       = 0;
    this.translateX  = 0;
    this.rotateAngle = 0;

    this.startAnimations = [];

    this.isAnimated = false;

    this.updateSize();

    this.img = new Image();

    this.img.onload = () => {
      this.draw();
    };

    this.img.src = `/img/pic1.jpg`;
  }


  updateWindowSize() {
    ww = window.innerWidth;
    wh = window.innerHeight;
    wd = window.innerWidth / 1440;
  }


  updateSize() {
    this.updateWindowSize();

    const posterRatio = 1.45; // 494 / 340
    const isMobile = window.innerWidth <= 600;

    if (isMobile) {
      const windowRatio = ww / wh;

      if (posterRatio < windowRatio) {
        this.width = ww;
        this.height = Math.round(this.width * posterRatio) + 2;
      } else {
        this.height = wh;
        this.width = Math.round(this.height / posterRatio) + 2;
      }

      this.L = Math.round((ww - this.width) / 2);
      this.T = Math.round((wh - this.height) / 2);
      this.R = this.L + this.width;
      this.B = this.T + this.height;
    } else {
      this.width = Math.round(340 * wd);
      this.height = Math.round(this.width * posterRatio);
      this.L = Math.round((ww - this.width) / 2);
      this.T = Math.round((wh - this.height) / 2 + 17 * wd);
      this.R = this.L + this.width;
      this.B = this.T + this.height;
    }
  }


  draw() {
    this.canvas.width = ww;
    this.canvas.height = wh;

    this.ctx.clearRect(0, 0, ww, wh);
    this.ctx.transform(1, this.skewX, 0, this.scaleY, this.translateX, 0);

    this.rotate(this.rotateAngle, ww / 2, 0);

    this.ctx.drawImage(this.img, this.L, this.T, this.width, this.height);

    this.drawCorner(this.cornerAlpha, this.cornerWidth);
  }


  drawBg() {
    this.bgCanvas.width = ww;
    this.bgCanvas.height = wh;

    this.bgCtx.clearRect(0, 0, ww, wh);
    this.bgCtx.fillStyle = `#c78fff`;
    this.bgCtx.fillRect(this.L + 1, this.T + 1, this.width - 2, this.height - 2);
  };


  drawCorner(alpha, deltaWidth) {
    const radian = alpha * Math.PI / 180;
    const deltaHeight = deltaWidth * Math.tan(radian);

    this.ctx.beginPath();

    if (deltaWidth <= this.width) {
      // L
      this.ctx.moveTo(this.R - deltaWidth, this.B);
      // R
      this.ctx.lineTo(this.R, this.B - deltaHeight);
      // T
      this.ctx.lineTo(this.R - deltaHeight * Math.sin(2 * radian), this.B - deltaHeight * (Math.cos(2 * radian) + 1));
    } else {
      // outer trapezoid points
      const outerDeltaWidth = deltaWidth - this.width;
      const outerDeltaHeight = outerDeltaWidth * Math.tan(radian);
      // LB
      this.ctx.moveTo(this.L, this.B - outerDeltaWidth * Math.tan(radian));
      // RB
      this.ctx.lineTo(this.R, this.B - deltaHeight);
      // RT
      this.ctx.lineTo(this.R - deltaHeight * Math.sin(2 * radian), this.B - deltaHeight * (1 + Math.cos(2 * radian)));
      // LT
      this.ctx.lineTo(this.L - outerDeltaHeight * Math.sin(2 * radian), this.B - outerDeltaHeight * (1 + Math.cos(2 * radian)));
    }

    this.ctx.closePath();
    this.ctx.fillStyle = `#ccc`;
    this.ctx.fill();

    this.ctx.save();
    // mask poster corner
    this.rotate(-alpha, this.R - deltaWidth, this.B);
    // restore context transform
    this.ctx.clearRect(this.L - this.width / 4, this.B, this.width + this.width / 2, deltaHeight);
    // posterCtx.fillStyle = `#fff`;
    this.ctx.restore();
  }


  rotate(angle, cx, cy) {
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-cx, -cy);
  };


  getCornerAnimationTick(fromAlpha, toAlpha, fromWidth, toWidth) {
    return (progress) => {
      this.cornerAlpha = fromAlpha + progress * (toAlpha - fromAlpha);

      if (fromWidth && toWidth) {
        this.cornerWidth = fromWidth + progress * (toWidth - fromWidth);
      }
    };
  }


  getScaleYAnimationTick(from, to) {
    return (progress) => {
      this.scaleY = from + progress * (to - from);
    };
  }


  getSkewXAnimationTick(from, to) {
    return (progress) => {
      this.skewX = from + progress * (to - from);
    };
  }


  getTranslateXAnimationTick(from, to) {
    return (progress) => {
      this.translateX = from + progress * (to - from);
    };
  }


  getRotateAnimationTick(from, to) {
    return (progress) => {
      this.rotateAngle = from + progress * (to - from);
    };
  }


  animateCornerFluid() {
    const cornerFluidEasing = bezierEasing(0.33, 0, 0.67, 1);
    const cornerWidthTo     = this.cornerWidth - 10;
    const cornerWidthFrom   = this.cornerWidth;

    const cornerAlphaAnimations = [
      () => animateEasing(this.getCornerAnimationTick(0, 7), 500, cornerFluidEasing),
      () => animateEasing(this.getCornerAnimationTick(7, 0), 500, cornerFluidEasing),
      () => animateEasing(this.getCornerAnimationTick(0, 6), 667, cornerFluidEasing),
      () => animateEasing(this.getCornerAnimationTick(6, 2), 367, cornerFluidEasing),
      () => animateEasing(this.getCornerAnimationTick(2, 17, cornerWidthFrom, cornerWidthTo), 617, cornerFluidEasing),
      () => animateEasing(this.getCornerAnimationTick(17, 0, cornerWidthTo, cornerWidthFrom), 417, cornerFluidEasing),
    ];

    runSerial(cornerAlphaAnimations);
  }


  animatePosterTearOff() {
    const cornerEasing = bezierEasing(0.41, 0, 0.05, 1);
    const cornerWidthTo = this.cornerWidth + 250;
    animateEasing(this.getCornerAnimationTick(0, 15, this.cornerWidth, cornerWidthTo), 500, cornerEasing);

    const skewXEasing = bezierEasing(0.33, 0, 0, 1);
    animateEasing(this.getSkewXAnimationTick(0, 15 / wh), 633, skewXEasing);

    const scaleYEasing = bezierEasing(0.33, 0, 0, 1);
    animateEasing(this.getScaleYAnimationTick(1, 0.9), 633, scaleYEasing);

    const rotateEasing = bezierEasing(0.2, 0, 0, 1);
    animateEasing(this.getRotateAnimationTick(0, 35), 1200, rotateEasing);

    const translateXEasing = bezierEasing(0.2, 0, 0, 1);
    animateEasing(this.getTranslateXAnimationTick(0, -976), 1800, translateXEasing);
  }


  startAnimation(app) {
    if (!this.isAnimated) {
      this.isAnimated = true;

      const globalFluidAnimationTick = (globalProgress) => {
        if (globalProgress >= 0 && this.startAnimations.indexOf(`fluid`) === -1) {
          this.startAnimations.push(`fluid`);

          this.animateCornerFluid();
        }

        this.draw();
      };

      const globalTearOffAnimationTick = (globalProgress) => {
        if (globalProgress >= 0 && this.startAnimations.indexOf(`tear-off`) === -1) {
          this.startAnimations.push(`tear-off`);

          this.animatePosterTearOff();

          app.whaleScene.startAnimation({
            posterT: this.T,
            posterL: this.L,
            posterHeight: this.height,
            posterWidth: this.width
          });
        }

        this.draw();
      };

      const posterAnimations = [
        () => animateDuration(globalFluidAnimationTick, 3068),
        () => animateDuration(globalTearOffAnimationTick, 1800),
      ];

      runSerial(posterAnimations);
    }
  };
}
