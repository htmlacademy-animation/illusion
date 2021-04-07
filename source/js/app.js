import 'picturefill/dist/picturefill.min';

import {Menu, Slider, ModalTriggers, TicketsSlider} from './modules/page-parts';
import FullPageScroll  from './modules/full-page-scroll';


class App {
  constructor() {
    this.menu          = new Menu();
    this.slider        = new Slider();
    this.modalTriggers = new ModalTriggers();
    this.ticketsSlider = new TicketsSlider();

    this.fullPageScroll = new FullPageScroll(this);
  }
}


const APP = new App();

window.APP = APP;
// console.log(APP);
