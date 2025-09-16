/**
 * @file
 * Добавляет фильтр для текстового поля с предварительно загруженными опциями выбора.
 * У поля нужно заменить тему оформления на input_dropdown_filter и добавить опции в параметр '#dropdown_options'
 */

(($, Drupal) => {

  $.fn.bsDropDownFilter = function() {

      var $wrapper, $menu, $input, $droplist, $diacritics;
      $wrapper = $(this).parent();
      $input = $(this).parent().find('.input-dropdown-input');
      $menu = $(this).parent().find('.input-dropdown-menu');
      $diacritics = $input.data('diacritics') !== 'off';

      $wrapper.off('focusin.inputDropdownFilter');
      $wrapper.on('focusin.inputDropdownFilter', function() {
          $menu.show();
        })
      $wrapper.off('focusout.inputDropdownFilter');
      $wrapper.on('focusout.inputDropdownFilter', function() {
          setTimeout(() => $menu.hide(), 100)
        })

      $menu
        .find('li').each((key, item) => {
          $(item).off('mouseup.inputDropdownFilter');
          $(item).on('mouseup.inputDropdownFilter', function() {
            // создать и вызвать событие, на которое сторонние обработчики подвесят свою логику
            const event = new CustomEvent('inputDropdownFilterSelected', {
              detail: {
                dest: $input,
                source: $(this),
              }
            });
            document.dispatchEvent(event);

            $menu.hide();
          })
        });

      $input.data('dropdownList', $menu);
      $input.off('click.inputDropdownFilter');
      $input.on('click.inputDropdownFilter', function() {
          $menu.show();
        });
      $input.off('keyup.inputDropdownFilter');
      $input.on('keyup.inputDropdownFilter', function() {
        const event = new CustomEvent('inputDropdownFilterKeyUp', {
          detail: {
            dest: $input,
            source: $(this),
          }
        });
        document.dispatchEvent(event);

        $droplist = $(this).data('dropdownList');
        $droplist.find('li').show();
        if ($diacritics) $droplist.find('li:not(:filter("' + this.value + '"))').hide();
      });
  };

  // Create a FILTER pseudo class. Like CONTAINS, but case insensitive
  // Текст в теге SPAN исключается из поиска,
  // например, в span добавляется регион в фильтре выбора города.
  $.expr.pseudos.filter = $.expr.createPseudo(function(arg) {
    return function(elem) {
      /*global Diacritics*/
      return Diacritics.clean($(elem).html().replace(/<span>.*<\/span>/, '')).toUpperCase().indexOf(Diacritics.clean(arg).toUpperCase()) >= 0;
    };
  });

  /**
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   * Навесить обработчики на input с классом input-dropdown-filter
   */
  Drupal.behaviors.inputDropdownFilter = {
    attach(context) {
      $(context).find('.input-dropdown-menu', ).addBack('.input-dropdown-menu').each(
        (key, element) => {
          $(element).bsDropDownFilter();
        }
      );
    },
  };

})(jQuery, Drupal);
