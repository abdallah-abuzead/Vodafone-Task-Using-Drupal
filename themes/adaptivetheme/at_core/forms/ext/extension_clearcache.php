<?php

/**
 * Form submit handler for the theme settings form.
 */

function at_core_submit_extension_clearcache() {
  drupal_flush_all_caches();
  drupal_set_message(t('Cache cleared.'), 'status');
}
