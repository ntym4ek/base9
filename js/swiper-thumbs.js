/**
 * @file
 * Добавить модулю swiper_formatter возможность вывода пагинатора в виде thumbs
 */

((Drupal, settings, once) => {
  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   * Инициализировать свайперы с классом swiper-thumbs
   * и задать их в свойстве thumbs для родительских свайперов с id,
   * указанном в атрибуте data-parent-swiper-id
   */
  Drupal.behaviors.swiperThumbs = {
    attach(context) {
      once('swiper-thumbs-once', '.swiper-thumbs', context).forEach(
        (element) => {
          let parentId = element.dataset.parentSwiperId;

          if (parentId) {
            const swiper = typeof Swiper !== 'undefined' ? Swiper : (window.SwiperFormatter ?? null);
            if (swiper) {
              let sw = new swiper(element, {
                direction: 'vertical',
                spaceBetween: 20,
                slidesPerView: 'auto',
                watchSlidesProgress: true,
                mousewheel: true,
              });

              let parentElem = document.getElementById(parentId);
              let parentSwiper = (typeof drupalSettings !== 'undefined' && drupalSettings.swipers && drupalSettings.swipers[parentId])
                ? drupalSettings.swipers[parentId]
                : (parentElem ? parentElem.swiper : null);

              if (parentSwiper && parentSwiper.thumbs) {
                parentSwiper.thumbs.swiper = sw;
                if (typeof parentSwiper.thumbs.init === 'function') {
                  parentSwiper.thumbs.init();
                }
                if (typeof parentSwiper.update === 'function') {
                  parentSwiper.update();
                }
              }
            }
          }
        }
      );
    },
  };

})(Drupal, drupalSettings, once);
