<?php

/**
 * Plugin Name: Austin Web Component Plugin
 * Description: A set of web components that can be used in any template.
 */

function register_wc_scripts()
{
  $url = plugin_dir_url(__FILE__) . '/public/js/hello-word.wc.js';
  wp_register_script('hello-world-wc', $url, array(), '1.3', true);
}
add_action('init', 'register_wc_scripts');
