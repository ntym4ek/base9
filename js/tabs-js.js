/**
 * @file
 * Скрипт переключения закладок с классом .tabs-js
 */

(($, Drupal, once) => {

  // Установить высоту элемента так, чтобы из-за близости конца страницы
  // элемент не смещался по высоте.
  function heightAdjust(element) {
      let wrOffset = $(element).offset();
      let wrHeight = $(element).height();
      let docScroll = $(document).scrollTop();
      let wrBottom = wrOffset.top + wrHeight - docScroll;
      let brBottom = $(window).height();
      // подвал пусть будет виден
      let docHeight = $(document).height();
      let wrPosBottom = docHeight - wrOffset.top - wrHeight;
      $(element).css("min-height", wrHeight + brBottom - wrBottom - wrPosBottom+14);
  }

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   * Повесить обработчики клика на элементы с классом tabs-js__links
   */
  Drupal.behaviors.tabsJs = {
    attach(context) {
      once('tabs-js-once', '.tabs-js', context).forEach(
        (element) => {

          // повесить обработчики
          element.querySelectorAll(".tabs-js__link").forEach((tabLink) => {
            let id = tabLink.dataset.targetId;

            tabLink.addEventListener("click", function() {
              // убрать классы с кнопок и закладок
              element.querySelectorAll(".tabs-js__link").forEach((tabLink) => {
                tabLink.classList.remove("tabs-js__link--active");
              });
              element.querySelectorAll(".tabs-js__content").forEach((tabContent) => {
                tabContent.classList.remove("tabs-js__content--visible");
              });

              tabLink.classList.add("tabs-js__link--active");
              element.querySelector('[data-id="' + id + '"]').classList.add("tabs-js__content--visible");

              heightAdjust(element);
            }, false);
          });

          heightAdjust(element);
        }
      );
    },
  };

})(jQuery, Drupal, once);
