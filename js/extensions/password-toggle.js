/**
 * @file
 * Password visibility toggle functionality for password inputs.
 */

((Drupal, once) => {
  'use strict';

  /**
   * Toggles the visibility of a password input.
   *
   * @param {HTMLButtonElement} button
   *   The toggle button.
   * @param {HTMLInputElement} input
   *   The password input element.
   */
  function togglePassword(button, input) {
    const isPassword = input.type === 'password';

    if (isPassword) {
      input.type = 'text';
      button.classList.add('is-active');
      button.setAttribute('aria-label', Drupal.t('Hide password'));
      button.setAttribute('title', Drupal.t('Hide password'));
      button.setAttribute('aria-pressed', 'true');
    } else {
      input.type = 'password';
      button.classList.remove('is-active');
      button.setAttribute('aria-label', Drupal.t('Show password'));
      button.setAttribute('title', Drupal.t('Show password'));
      button.setAttribute('aria-pressed', 'false');
    }

    // Keep cursor at the end or maintain focus if input had focus
    if (document.activeElement === input) {
      const len = input.value.length;
      input.setSelectionRange(len, len);
    }
  }

  /**
   * Creates the toggle button element with SVG icons.
   *
   * @return {HTMLButtonElement}
   */
  function createToggleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'password-toggle js-password-toggle';
    button.setAttribute('aria-label', Drupal.t('Show password'));
    button.setAttribute('title', Drupal.t('Show password'));
    button.setAttribute('aria-pressed', 'false');

    button.innerHTML = `
      <span class="password-toggle__icon password-toggle__icon--show" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </span>
      <span class="password-toggle__icon password-toggle__icon--hide" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
          <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
      </span>
    `;

    return button;
  }

  /**
   * Initializes the password toggle for an input.
   *
   * @param {HTMLInputElement} input
   */
  function initPasswordToggle(input) {
    let wrapper = input.closest('.password-toggle-wrapper');

    // If not wrapped by Twig template, wrap dynamically
    if (!wrapper) {
      wrapper = document.createElement('span');
      wrapper.className = 'password-toggle-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }

    // Look for existing button (from Twig template) or create one
    let button = wrapper.querySelector('.password-toggle');
    if (!button) {
      button = createToggleButton();
      wrapper.appendChild(button);
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePassword(button, input);
    });

    // Reset password visibility when the parent form is reset
    if (input.form) {
      input.form.addEventListener('reset', () => {
        setTimeout(() => {
          if (input.type === 'text') {
            togglePassword(button, input);
          }
        }, 0);
      });
    }

    // Ensure any confirm messages from Drupal user.js are outside wrapper
    const moveConfirmMessage = () => {
      const confirmMsg = wrapper.querySelector('.password-confirm-message, .password-suggestions');
      if (confirmMsg && wrapper.parentNode) {
        wrapper.parentNode.insertBefore(confirmMsg, wrapper.nextSibling);
      }
    };
    moveConfirmMessage();

    if (window.MutationObserver) {
      const observer = new MutationObserver(moveConfirmMessage);
      observer.observe(wrapper, { childList: true });
    }
  }

  /**
   * Behavior to attach password toggle to all password inputs.
   */
  Drupal.behaviors.passwordToggle = {
    attach(context) {
      once('password-toggle', 'input[type="password"]', context).forEach(initPasswordToggle);
    },
  };

})(Drupal, once);
