import 'picturefill/dist/picturefill.min';

import {Menu, Slider, ModalTriggers, TicketsSlider, Scrollers} from './modules/page-parts';
import FullPageScroll  from './modules/full-page-scroll';
import Poster          from './modules/poster-canvas-animation';
import WhaleScene      from './modules/whale-canvas-animation';
import ThreeBackground from './modules/3d';
import AnimatedCart    from './modules/animated-cart';


class App {
  constructor() {
    this.menu          = new Menu();
    this.slider        = new Slider();
    this.modalTriggers = new ModalTriggers();
    this.ticketsSlider = new TicketsSlider();
    this.scrollers     = new Scrollers();

    this.poster = new Poster({
      canvas:   `#poster-canvas`,
      bgCanvas: `#poster-bg-canvas`
    });

    this.poster.drawBg();

    this.fullPageScroll = new FullPageScroll(this);

    this.view3d = new ThreeBackground();
    this.view3d.load().then(() => {
      this.view3d.start();
    });

    this.whaleScene = new WhaleScene({
      canvas: `#whale-canvas`
    });

    this.cart = new AnimatedCart({
      cart:             `.page-header__cart`,
      currentContainer: `.swiper-slide-active`,
      ticketsBlock:     `.tickets-block`,
      ticket:           `.tickets-form__ticket`,
      form:             `.tickets-block__form`,
      number:           `.page-header__cart-number`
    });

    this.initEventListeners();
  }


  initEventListeners() {
    window.addEventListener(`resize`, () => {
      this.poster.updateSize();
      this.whaleScene.updateSceneSizing();

      this.poster.drawBg();
      this.poster.draw();
      this.whaleScene.drawScene();
    });
  }
}


const APP = new App();

window.APP = APP;
// console.log(APP);
