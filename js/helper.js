/**
 * Вспомогательные функции для использования в большинстве проектов
 */
(function (Drupal) {
  'use strict';

  // Универсальная функция проверки переменных на наличие значения
  Drupal.isEmpty = function (value) {
    if (value == null) return true;
    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
    if (value instanceof Map || value instanceof Set) return value.size === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };

})(Drupal);
