import AccentTypographyBuild from './accent-typography-builder';
import AnimatedNumbers from './animated-numbers';


export default class PageSwitchHandler {
  constructor(app) {
    const animationTopScreenTextLine1 = new AccentTypographyBuild(`.slogan__col--1`, 500, `accent-typography--active`, `transform`);
    const animationTopScreenTextLine2 = new AccentTypographyBuild(`.slogan__col--2`, 500, `accent-typography--active`, `transform`);
    const animationTopScreenTextLine3 = new AccentTypographyBuild(`.slogan__col--3`, 500, `accent-typography--active`, `transform`);
    const introText = new AccentTypographyBuild(`.intro__text`, 500, `accent-typography--active`, `transform`);
    const showTitle = new AccentTypographyBuild(`.show__title`, 500, `accent-typography--active`, `transform`);
    const showText = new AccentTypographyBuild(`.show__text`, 500, `accent-typography--active`, `transform`);
    const showText2 = new AccentTypographyBuild(`.show__text-2`, 500, `accent-typography--active`, `transform`);
    const sliderTitle = new AccentTypographyBuild(`.slider__title`, 500, `accent-typography--active`, `transform`);
    const mapTitle = new AccentTypographyBuild(`.map__title`, 500, `accent-typography--active`, `transform`);
    const ticketsBlockTitle = new AccentTypographyBuild(`.tickets-block__title`, 500, `accent-typography--active`, `transform`);

    const numbers = new AnimatedNumbers({
      elements: `#js-features-list .features-list__item-value`,
      duration: 800,
      durationAttenuation: 150,
      delay: 200
    });


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

    this.scriptRunSchema = {
      top: [
        introText.runAnimation.bind(introText),
      ],
      about: [
        animationTopScreenTextLine1.runAnimation.bind(animationTopScreenTextLine1),
        animationTopScreenTextLine2.runAnimation.bind(animationTopScreenTextLine2),
        animationTopScreenTextLine3.runAnimation.bind(animationTopScreenTextLine3),
      ],
      numbers: [
        numbers.animate.bind(numbers)
      ],
      show: [
        app.poster.startAnimation.bind(app.poster, app),
        showTitle.runAnimation.bind(showTitle),
        () => {
          setTimeout(showText.runAnimation.bind(showText), 200);
          setTimeout(showText.runAnimation.bind(showText2), 200);
        }
      ],
      mc: [
        sliderTitle.runAnimation.bind(sliderTitle),
      ],
      map: [
        mapTitle.runAnimation.bind(mapTitle),
      ],
      tickets: [
        ticketsBlockTitle.runAnimation.bind(ticketsBlockTitle)
      ]
    };

    this.scriptDestroySchema = {
      top: [
        introText.destroyAnimation.bind(introText),
      ],
      about: [
        animationTopScreenTextLine1.destroyAnimation.bind(animationTopScreenTextLine1),
        animationTopScreenTextLine2.destroyAnimation.bind(animationTopScreenTextLine2),
        animationTopScreenTextLine3.destroyAnimation.bind(animationTopScreenTextLine3),
      ],
      numbers: [
        numbers.stopAllAnimations.bind(numbers)
      ],
      show: [
        showTitle.destroyAnimation.bind(showTitle),
        showText.destroyAnimation.bind(showText),
        showText.destroyAnimation.bind(showText2),
      ],
      mc: [
        sliderTitle.destroyAnimation.bind(sliderTitle),
      ],
      map: [
        mapTitle.destroyAnimation.bind(mapTitle),
      ],
      tickets: [
        ticketsBlockTitle.destroyAnimation.bind(ticketsBlockTitle),
      ]
    };

    this.setMasterClassAccentTypography();
    this.setTicketAccentTypography();
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


  setMasterClassAccentTypography() {
    document.querySelectorAll(`.slider__subtitle`).forEach((title) => {
      const text = new AccentTypographyBuild(title, 500, `accent-typography--active`, `transform`);

      document.body.addEventListener(`screenChanged`, () => {
        text.destroyAnimation();
        setTimeout(() => {
          text.runAnimation();
        }, 500);
      });
    });
  }


  setTicketAccentTypography() {
    document.querySelectorAll(`.tickets-form__row .tickets-form__label span:not(.js-total):nth-child(1)`).forEach((title) => {
      const text = new AccentTypographyBuild(title, 500, `accent-typography--active`, `transform`, 100);

      document.body.addEventListener(`screenChanged`, () => {
        text.destroyAnimation();

        setTimeout(() => {
          text.runAnimation();
        }, 500);
      });
    });
  }
}
