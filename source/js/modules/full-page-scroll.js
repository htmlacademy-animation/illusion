import PageSwitchHandler from './page-switch-handler';

export default class FullPageScroll {
  constructor(app) {
    this.THROTTLE_TIMEOUT = 1500;
    this.scrollFlag = true;
    this.timeout = null;
    this.swipeStartY = 0;

    this.screenElements = document.querySelectorAll(`.screen`);
    this.menuElements = document.querySelectorAll(`.main-menu__list .main-menu__link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChangedHandler = this.onUrlHashChanged.bind(this);
    this.wheelEvents = [];

    this.headerColorSwitcher = new PageSwitchHandler(app);

    document.addEventListener(`wheel`, this.onScrollHandler, { passive: false, useCapture: true });
    window.addEventListener(`popstate`, this.onUrlHashChangedHandler);
    document.body.addEventListener(`slideChanged`, (evt) => {
      this.emitChangeDisplayEvent(evt.detail.slideId);
    });

    const main = document.querySelector(`.page-content`);

    main.addEventListener('touchstart', this.onSwipeStart.bind(this));
    main.addEventListener('touchend',   this.onSwipeEnd.bind(this));

    this.menuElements.forEach((element, index) => {
      element.addEventListener(`click`, (e) => {
        e.preventDefault();

        const currentScreen = this.activeScreen;

        this.activeScreen = (index < 2) ? index : index + 1;

        this.transitionToActiveScreen(currentScreen);
      });
    });

    this.emitChangeDisplayEvent(0);

    this.init();
  }


  init() {
    this.onUrlHashChanged();
    this.changePageDisplay();
  }


  transitionToActiveScreen(currentScreen) {
    if (currentScreen !== this.activeScreen) {
      this.clearDeactivatedClass();
      this.screenElements[currentScreen].classList.add(`screen--hidden`);
      this.screenElements[currentScreen].classList.add(`screen--deactivated`);
      this.headerColorSwitcher.resetScheme();
      this.emitChangeDisplayEvent();

      setTimeout(this.clearDeactivatedClass.bind(this), this.THROTTLE_TIMEOUT);
      setTimeout(this.changePageDisplay.bind(this), this.THROTTLE_TIMEOUT / 2);

      this.updateBodyClass(this.activeScreen);
    }
  }


  updateBodyClass(activeScreen) {
    if (activeScreen > 0) {
      document.querySelector(`body`).classList.add(`second-section`);
    } else {
      document.querySelector(`body`).classList.remove(`second-section`);
    }
  }


  onScroll(evt) {
    evt.preventDefault();

    const eventDetails = {
      timestamp: Date.now(),
      direction: Math.sign(evt.deltaY),
      value: Math.abs(evt.deltaY)
    };
    let prevEvent = null;

    if (this.wheelEvents.length > 0) prevEvent = this.wheelEvents[this.wheelEvents.length - 1];

    this.wheelEvents.push(eventDetails);
    if (this.wheelEvents.length > 2) this.wheelEvents.shift();

    if (prevEvent) {
      if (prevEvent.direction === eventDetails.direction
        && prevEvent.value >= eventDetails.value
        && eventDetails.timestamp < prevEvent.timestamp + 150) return;
    }

    if (!this.scrollFlag) return;

    this.scrollFlag = false;
    const currentScreen = this.activeScreen;

    this.reCalculateActiveScreenPosition(evt.deltaY);
    this.transitionToActiveScreen(currentScreen);

    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }


  onUrlHashChanged() {
    const currentScreen = this.activeScreen;
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);

    this.activeScreen = (newIndex < 0) ? 0 : newIndex;

    this.transitionToActiveScreen(currentScreen);
  }


  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.headerColorSwitcher.setColorScheme(this.screenElements[this.activeScreen].id);
    this.emitChangeDisplayEvent();
    this.clearDeactivatedClass();

    location.hash = this.screenElements[this.activeScreen].id;
  }


  clearDeactivatedClass() {
    this.screenElements.forEach((el) => {
      if (el.classList.contains(`screen--deactivated`)) {
        el.classList.remove(`screen--deactivated`);
      }
    });
  }


  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });

    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);

    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }


  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => {
      return item.dataset.href === this.screenElements[this.activeScreen].id
    });

    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }


  emitChangeDisplayEvent(slideId = -1) {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'slideId': slideId,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }


  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      if (this.activeScreen !== this.screenElements.length - 1) {
        this.activeScreen++;
      }
    } else {
      if (this.activeScreen > 0) {
        this.activeScreen--;
      }
    }
  }


  onSwipeStart(e) {
    if (e.changedTouches) {
      e = e.changedTouches[0];
    }

    this.swipeStartY = e.clientY;
  }


  onSwipeEnd(e) {
    if (e.changedTouches) {
      e = e.changedTouches[0];
    }

    const dY = e.clientY - this.swipeStartY;

    if (Math.abs(dY) > 300) {
      const currentScreen = this.activeScreen;

      this.reCalculateActiveScreenPosition(-dY);
      this.transitionToActiveScreen(currentScreen);
    }
  }
}

