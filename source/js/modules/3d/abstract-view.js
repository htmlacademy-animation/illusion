class AbstractView {
  constructor(params = null) {
    this.setupParameters(params);
    this.construct();
    this.setDefaultRender();
  }

  setupParameters() {
    // Флаги состояний
    this.started = false;
    this.playing = false;
    this.resizeInProgress = false;

    // Размеры вьюпорта
    // Устанавливаем стартовые значения
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Параметр для хранения выбранной функции рендера
    this.renderFunc = null;
  }

  construct() {
    console.warn(`Класс AbstractView требует расширения. 
      Метод construct необходимо переопределить в дочернем классе.`);
  }

  setDefaultRender() {
    this.renderFunc = () => {
      this.renderer.render(this.scene, this.camera);
    };
  }

  setRenderFunction(func) {
    if (typeof func !== `function`) return;
    this.renderFunc = func;
  }

  render() {
    if (this.renderFunc !== null) {
      this.renderFunc.call(this);
    }
  }

  start() {
    if (this.started) return this;

    this.started = true;

    // Сначла запускаем ресайз, чтобы получить актуальные размеры
    this.startResize();
    
    // Запускаем проигрываение сцены
    this.play();

    return this;
  }

  stop() {
    if (!this.started)  return this;

    this.pause();
    this.stopResize();
    this.started = false;

    return this;
  }

  startResize() {
    // Так как рендер происходит в каждом фрейме, 
    // мы будем только сообщать объекту, что при следующем рендере нужно обновить размеры.
    // И не производим лишних промежуточных действий по событию resize
    this.onResize = () => {
      if (this.resizeInProgress) {
        return;
      }
      this.resizeInProgress = true;
    };

    // Обновляем размер принудительно, чтобы получить актуальную картинку
    // Перед запуском слушателя
    this.resize();

    window.addEventListener(`resize`, this.onResize);
  }

  stopResize() {
    if (!this.onResize) return;

    window.removeEventListener(`resize`, this.onResize);
    this.onResize = null;

    // Сбрасываем флаг в начальное состояние
    this.resizeInProgress = false;
  }

  play() {
    if (this.playing) return this;

    const onAnimationFrame = (target) => {
      // Если за прошедшее время размеры изменились, обновляем размеры
      if (target.resizeInProgress) target.resize();
      // Рендерим
      target.render();
  
      // Срасываем флаг, чтобы в следующем фрейме не выполнять лишних действий
      target.resizeInProgress = false;
  
      // Проверяем, нужно ли продолжать перезапускать requestAnimationFrame
      if (!target.started || !target.playing) return;

      // Перезапускаем ожидание фрейма
      requestAnimationFrame(() => {
        onAnimationFrame(target);
      });
    };

    // Сообщаем функции рендера, что нужно продолжать 
    // перезапускать requestAnimationFrame
    // и обрабатывать состояние resizeInProgress
    this.playing = true;

    // Обновляем и рендерим сразу при запуске, чтобы получить первый кадр, 
    // не дожидаясь следующего фрейма
    this.render();
    
    // Запускаем счетчик фреймов для рендера
    requestAnimationFrame(() => {
      onAnimationFrame(this);
    });

    return this;
  }

  pause() {
    if (!this.playing) return this;

    // Сбрасываем флаг - сообщаем, что пока что рендерить не нужно
    this.playing = false;

    return this;
  }

  resize() {
    console.warn(`Класс AbstractView требует расширения. 
      Метод resize необходимо переопределить в дочернем классе.`);
  }
}

export default AbstractView;
