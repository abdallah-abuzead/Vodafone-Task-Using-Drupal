<?php

/**
 * @file
 * Lists available colors and color schemes for the AT Starterkit.
 * By default the color scheme relies almost entirely on color
 * shift, where the user changes the base color and all other
 * unspecified colors shift relative to the new base.
 */

use Drupal\at_core\Ext\ExtGet;
$theme_name = \Drupal::service('theme.manager')->getActiveTheme()->getName();
$file_path = drupal_get_path('theme', $theme_name) . '/styles/uikit/components/partials/_variables.scss';
$sass_variables = (new ExtGet)->getSassVariables($file_path);

$info = array(
  // Available colors and color labels used in theme.
  'fields' => array(
    'base'        => t('Base'),
    'text'        => t('Text color'),
    'link'        => t('Link color'),
    'headerstart' => t('Header top'),
    'headerstop'  => t('Header bottom'),
    'headercolor' => t('Header text'),
    'navbar'      => t('Navbar'),
    'navbarhover' => t('Navbar hover'),
  ),
  // Pre-defined color schemes.
  'schemes' => array(
    'default' => array(
      'title' => t('Ocean Water'),
      'colors' => array(
        'base'        => $sass_variables['base-color'],
        'text'        => $sass_variables['text-color'],
        'link'        => $sass_variables['link-color'],
        'headerstart' => $sass_variables['page-header-background-color-start'],
        'headerstop'  => $sass_variables['page-header-background-color-stop'],
        'headercolor' => $sass_variables['page-header-color'],
        'navbar'      => $sass_variables['page-navbar-background-color'],
        'navbarhover' => $sass_variables['page-navbar-hover-background-color'],
      ),
    ),
    'forestgreen' => array(
      'title' => t('Forest Green'),
      'colors' => array(
        'base'        => '#1d7e17',
        'text'        => '#404040',
        'link'        => '#186813',
        'headerstart' => '#0e3d0b',
        'headerstop'  => '#1d7e17',
        'headercolor' => '#fcfcfc',
        'navbar'      => '#092707',
        'navbarhover' => '#213c1f',
      ),
    ),
    'redcarpet' => array(
      'title' => t('Red Carpet'),
      'colors' => array(
        'base'        => '#b61c0c',
        'text'        => '#383838',
        'link'        => '#9e190b',
        'headerstart' => '#861509',
        'headerstop'  => '#b61c0c',
        'headercolor' => '#fcfcfc',
        'navbar'      => '#6e1107',
        'navbarhover' => '#7c281f',
      ),
    ),
    'silver' => array(
      'title' => t('Silver'),
      'colors' => array(
        'base'        => '#a7aab3',
        'text'        => '#a9a9a9',
        'link'        => '#666a75',
        'headerstart' => '#8c909b',
        'headerstop'  => '#a7aab3',
        'headercolor' => '#fcfcfc',
        'navbar'      => '#717683',
        'navbarhover' => '#7f838f',
      ),
    ),
  ),

  // CSS files (excluding @import) to rewrite with new color scheme.
  'css' => array(
    'styles/css/components/color.css',
    'styles/css/components/tabs.css',
  ),

  // Files to copy.
  'copy' => array(
    'logo.svg',
    'logo.png',
  ),

  // Gradient definitions.
  'gradients' => array(),
);
