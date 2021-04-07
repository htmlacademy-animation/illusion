import * as scrollSpy from 'simple-scrollspy/dist/simple-scrollspy.min';
import AccentTypographyBuild from './accent-typography-builder';

import Swiper from 'swiper';


class Menu {
  constructor() {
    this.header      = document.querySelector(`.js-header`);
    this.menu        = document.querySelector(`.js-menu`);
    this.menuToggler = document.querySelector(`.js-menu-toggler`);
    this.menuOverlay = document.querySelector(`.js-overlay`);
    this.menuLinks   = [...document.querySelectorAll(`.js-menu-link`)];

    this.vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty(`--vh`, `${this.vh}px`);

    scrollSpy(`#menu`, {
      sectionClass: `.js-scrollspy`,
      menuActiveTarget: `.js-menu-link`,
      offset: 100
    });

    // SPLIT TEXT
    const prepareLinksText = (root, selector) => {
      return [...root.querySelectorAll(selector)].map((el) => {
        const accentObject = new AccentTypographyBuild(el, 300, null, 'transform');
        accentObject.clearStyle();
        return accentObject;
      });
    };

    this.accentLinkTextObjects = prepareLinksText(this.menu, '.main-menu__link-text');

    this.initEventListeners();
  }


  initEventListeners() {
    window.addEventListener(`resize`, () => {
      this.vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(`--vh`, `${this.vh}px`);
    });

    if (this.menuToggler) {
      this.menuToggler.addEventListener(`click`, () => {
        if (this.menu.classList.contains(`main-menu--opened`)) {
          this.header.classList.remove(`page-header--menu-opened`);
          this.menu.classList.remove(`main-menu--active`);
          this.menu.classList.remove(`main-menu--opened-in`);
          this.menu.classList.add(`main-menu--opened-out`);
          this.accentLinkTextObjects.forEach((accentObject) => {
            accentObject.clearStyle();
          });
          setTimeout(() => {
            this.menu.classList.remove(`main-menu--opened`);
            this.menu.classList.remove(`main-menu--opened-out`);
          }, 350);
        } else {
          this.menu.classList.add(`main-menu--opened`);
          this.menu.classList.add(`main-menu--opened-in`);
          this.menu.classList.remove(`main-menu--opened-out`);
          this.header.classList.add(`page-header--menu-opened`);

          setTimeout(() => {
            this.accentLinkTextObjects.forEach((accentObject) => {
              accentObject.addStyle();
            });
            this.menu.classList.add(`main-menu--active`);
          }, 100);
        }
      });

      document.addEventListener(`keyup`, (evt) => {
        if (evt.key === `Escape`) {
          this.menu.classList.remove(`main-menu--opened`);
          this.header.classList.remove(`page-header--menu-opened`);
        }
      });

      this.menuOverlay.addEventListener(`click`, function () {
        this.menu.classList.remove(`main-menu--opened`);
        this.header.classList.remove(`page-header--menu-opened`);
      });
    }

    for (let i = 0; i < this.menuLinks.length; i++) {
      this.menuLinks[i].addEventListener(`click`, () => {
        if (this.menu.classList.contains(`main-menu--opened`)) {
          this.menu.classList.remove(`main-menu--opened`);
          this.header.classList.remove(`page-header--menu-opened`);
        }
      });
    }
  }
}



class Slider {
  constructor() {
    // eslint-disable-next-line no-new
    new Swiper(`.js-slider`, {
      loop: true,
      navigation: {
        nextEl: `.slider__control--next`,
        prevEl: `.slider__control--prev`,
      },
      pagination: {
        el: `.swiper-pagination`,
        type: `fraction`,
      },
      observer: true,
      observeParents: true,
      on: {
        slideChange() {
          const event = new CustomEvent(`slideChanged`, {
            detail: {
              'slideId': (this.activeIndex + 2) % 3
            }
          });

          document.body.dispatchEvent(event);
        }
      },
    });
  }
}



class ModalTriggers {
  constructor() {
    this.modalTriggers = document.querySelectorAll(`.js-modal-trigger`);

    this.initEventListeners();
  }


  initEventListeners() {
    if (this.modalTriggers.length) {
      const modals = document.querySelectorAll(`.js-modal`);

      for (let i = 0; i < this.modalTriggers.length; i++) {
        this.modalTriggers[i].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          Array.from(this.modalTriggers).forEach((el) => {
            el.classList.remove(`map__event--active`);
          });

          if (evt.currentTarget.classList.contains(`map__event`)) {
            evt.currentTarget.classList.add(`map__event--active`);
          }

          const target = evt.currentTarget.getAttribute(`data-target`);

          if (modals.length) {
            Array.from(modals).forEach((modalEl) => {
              const identifyer = modalEl.getAttribute(`id`);

              if (!(identifyer === target) && modalEl.classList.contains(`modal--show`)) {
                modalEl.classList.remove(`modal--show`);
                document.querySelector(`body`).classList.remove(`modal-opened`);
              } else if (identifyer === target) {
                modalEl.classList.add(`modal--show`);
                document.querySelector(`body`).classList.add(`modal-opened`);
              }
            });
          }
        });
      }

      const overlays = document.querySelectorAll(`.modal__overlay`);

      Array.from(overlays).forEach((element) => {
        element.addEventListener(`click`, () => {
          element.parentNode.classList.remove(`modal--show`);
          document.querySelector(`body`).classList.remove(`modal-opened`);

          Array.from(this.modalTriggers).forEach((el) => {
            el.classList.remove(`map__event--active`);
          });
        });
      });

      const closeEls = document.querySelectorAll(`.js-modal-close`);

      Array.from(closeEls).forEach((element) => {
        element.addEventListener(`click`, () => {
          const targetId = element.getAttribute(`data-target`);

          document.getElementById(targetId).classList.remove(`modal--show`);
          document.querySelector(`body`).classList.remove(`modal-opened`);

          Array.from(this.modalTriggers).forEach((el) => {
            el.classList.remove(`map__event--active`);
          });
        });
      });
    }
  }
}



class TicketsSlider {
  constructor() {
    this.ticketsSlider = new Swiper(`.js-tickets-slider`, {
      speed: 500,
      navigation: {
        nextEl: `.tickets-block__control--next`,
        prevEl: `.tickets-block__control--prev`,
      },
    });

    this.datePickers = document.querySelectorAll(`.js-date-picker`);
    this.pickerBtn = document.querySelector(`.js-pick`);
    this.counters = document.querySelectorAll(`.js-counter`);
    this.numberFields = document.querySelectorAll(`input[type="number"]`);

    this.initEventListeners();
  }


  initEventListeners() {
    for (let i = 0; i < this.datePickers.length; i++) {
      this.datePickers[i].addEventListener(`click`, (evt) => {
        Array.from(this.datePickers).forEach((el) => {
          el.classList.remove(`tickets-block__button--chosen`);
        });

        evt.currentTarget.classList.add(`tickets-block__button--chosen`);
        this.pickerBtn.removeAttribute(`disabled`);

        const targetNum = parseInt(evt.currentTarget.getAttribute(`data-number`), 10);

        this.ticketsSlider.update();
        this.ticketsSlider.slideTo(targetNum);
      });
    }

    this.pickerBtn.addEventListener(`click`, () => {
      document.querySelector(`.js-tickets-block`).classList.add(`tickets-block--form-opened`);
    });

    for (let i = 0; i < this.counters.length; i++) {
      this.counters[i].addEventListener(`click`, (evt) => {
        const field = evt.currentTarget.parentNode.querySelector(`input`);

        if (evt.currentTarget.classList.contains(`js-increase`)) {
          field.value = parseInt(field.value, 10) + 1;
          evt.currentTarget.parentNode.querySelector(`.js-decrease`).removeAttribute(`disabled`);
        } else if (evt.currentTarget.classList.contains(`js-decrease`) && field.value === 1) {
          field.value = Math.max(parseInt(field.value, 10) - 1, 0);
          evt.currentTarget.setAttribute(`disabled`, true);
        } else {
          field.value = Math.max(parseInt(field.value, 10) - 1, 0);
        }

        const fields = evt.currentTarget.closest(`.tickets-form`).querySelectorAll(`input`);
        const total = Array.from(fields).reduce((sum, current) => {
          current = parseInt(current.value, 10) * parseInt(current.getAttribute(`data-sum`), 10);
          return sum + current;
        }, 0);

        const sumEl = evt.currentTarget.closest(`.tickets-form`).querySelector(`.js-total`);
        sumEl.innerText = total;

        if (total > 0) {
          evt.currentTarget.closest(`.tickets-form`).querySelector(`.js-total-row`).classList.remove(`tickets-form__row--disabled`);
        } else {
          evt.currentTarget.closest(`.tickets-form`).querySelector(`.js-total-row`).classList.add(`tickets-form__row--disabled`);
        }
      });
    }

    for (let i = 0; i < this.numberFields.length; i++) {
      this.numberFields[i].addEventListener(`keydown`, (evt) => {
        if (!((evt.key >= `0` && event.key <= `9`) || evt.key === `Backspace`)) {
          event.preventDefault();
        }

        if (event.key === `Backspace` && evt.currentTarget.value.length < 2) {
          event.preventDefault();
          evt.currentTarget.value = 0;
        }
      });

      this.numberFields[i].addEventListener(`input`, (evt) => {
        if (evt.currentTarget.value.indexOf(`0`) === 0 && evt.currentTarget.value.length > 1) {
          evt.currentTarget.value = evt.currentTarget.value.slice(1);
        }
      });
    }
  }
}


class Scrollers {
  constructor() {
    this.map = document.getElementById(`map`);
    this.scrollers = document.querySelectorAll(`.js-map-scroller`);

    this.reverseNames = {
      touchstart: `touchend`,
      mousedown: `mouseup`
    };

    const scrollDeltaX = this.map.scrollWidth - this.map.clientWidth;
    this.map.scrollLeft = scrollDeltaX / 10;

    const scrollDeltaY = this.map.scrollHeight - this.map.clientHeight;

    if (scrollDeltaY > 0) {
      document.querySelector(`.screen__scroller--up`).classList.remove(`screen__scroller--hidden`);
      document.querySelector(`.screen__scroller--down`).classList.remove(`screen__scroller--hidden`);

      this.map.scrollTop = scrollDeltaY / 10;
    }

    this.initEventListeners();
  }

  initEventListeners() {
    for (let i = 0; i < this.scrollers.length; i++) {
      `touchstart,mousedown`.split(`,`).forEach((name) => {
        this.scrollers[i].addEventListener(name, (evt) => {
          let time = +new Date();
          let mouseDowned = true;
          let upFn;

          window.addEventListener(this.reverseNames[name], upFn = () => {
            window.removeEventListener(this.reverseNames[name], upFn);
            mouseDowned = false;
          });

          const direction = evt.currentTarget.getAttribute('data-direction');

          const ticker = () => {
            const currentTime = +new Date();
            let dt = (currentTime - time) / 1000;
            time = currentTime;

            if (dt > 0.5) {
              dt = 0.5;
            }

            switch (direction) {
              case 'up': {
                this.map.scrollTop -= dt * 300;
                break;
              }
              case 'down': {
                this.map.scrollTop += dt * 300;
                break;
              }
              case 'left': {
                this.map.scrollLeft -= dt * 300;
                break;
              }
              case 'right': {
                this.map.scrollLeft += dt * 300;
                break;
              }
            }

            if (mouseDowned) {
              requestAnimationFrame(ticker);
            }
          };

          ticker();
        });
      });
    }
  }
}


export {
  Menu,
  Slider,
  ModalTriggers,
  TicketsSlider,
  Scrollers
};
