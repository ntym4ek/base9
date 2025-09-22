/**
 * @file
 * todo Скрипт плавающего блока
 *      пример http://shpargalkablog.ru/2013/09/scroll-block.html
 */

(($, Drupal, once) => {
  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   */
  Drupal.behaviors.floatingBlock = {
    attach(context) {
      once('floating-block-once', '', context).forEach(
        (element) => {
        }
      );
    },
  };

})(jQuery, Drupal, once);
