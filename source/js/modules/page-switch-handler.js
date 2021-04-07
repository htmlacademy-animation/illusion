export default class PageSwitchHandler {
  constructor(app) {
    this.colorScheme = {
      tickets: {
        'body': `last-section`
      },
      top: {
        '.intro__title-line': `active`,
        'body': `logo-hidden`
      },
      about: {
        '.slogan__col--2': `active`
      },
      numbers: {
        '.features-list': `active`
      },
      mc: {
        '.swiper-wrapper': `active`
      }
    };

    this.scriptRunSchema = {};

    this.scriptDestroySchema = {};
  }


  setColorScheme(sectionId) {
    this.resetScheme();

    if (this.colorScheme[sectionId]) {
      for (const schema in this.colorScheme[sectionId]) {
        if (this.colorScheme[sectionId].hasOwnProperty(schema)) {
          const position = document.querySelector(schema);

          if (position) {
            setTimeout(() => {
              position.classList.add(this.colorScheme[sectionId][schema]);
            }, 100);
          }
        }
      }
    }

    if (this.scriptRunSchema[sectionId]) {
      [...this.scriptRunSchema[sectionId]].forEach((funct) => setTimeout(() => funct(), 100));
    }
  }


  resetScheme() {
    for (const screenSchema in this.colorScheme) {
      if (this.colorScheme.hasOwnProperty(screenSchema)) {
        for (const schema in this.colorScheme[screenSchema]) {
          if (this.colorScheme[screenSchema].hasOwnProperty(schema)) {
            const position = document.querySelector(schema);

            if (position) {
              position.classList.remove(this.colorScheme[screenSchema][schema]);
            }
          }
        }
      }
    }

    for (const destroySchema in this.scriptDestroySchema) {
      if (this.scriptDestroySchema.hasOwnProperty(destroySchema)) {
        this.scriptDestroySchema[destroySchema].forEach((funct) => funct());
      }
    }
  }
}
