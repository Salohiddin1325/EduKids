/**
 * EduKids - Environment Configuration
 * Automatically loaded by Hub and all subject modules.
 */
(function() {
  'use strict';

  window.ENV_CONFIG = Object.assign({
    API_KEY_GEMINI: '',
    DEFAULT_GEMINI_MODEL: 'gemini-3.5-flash',
    FALLBACK_MODELS: ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
  }, window.ENV_CONFIG || {});
})();
