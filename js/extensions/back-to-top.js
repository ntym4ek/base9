/**
 * @file
 * Кнопка возврата к началу страницы
 */

(($, Drupal, once) => {
  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   При скролле страницы вниз показать кнопку.
   *   При нажатии на кнопку убрать её и выполнить скролл к началу страницы.
   */
  Drupal.behaviors.backToTop = {
    attach(context) {
      once('back-to-top-once', '[data-drupal-selector="back-to-top"]', context).forEach(
        (element) => {
          $(window).on('scroll', function () {
            if ($(this).scrollTop() > 400) {
              $(element).addClass('is-visible');
            } else {
              $(element).removeClass('is-visible');
            }
          });
          $(element).click(function() {
            $("html, body").animate({ scrollTop: 0 }, 500);
          });
        }
      );
    },
  };

})(jQuery, Drupal, once);
