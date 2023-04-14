<?php

/**
 * Plugin Name:       Web Component Block Demo
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Austin J. Mayer
 * License:           MIT
 * Text Domain:       todo-api-block
 */

namespace WcDemo;

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_init()
{
	$dir = __DIR__;

	$index_js = 'build/main.js';
	wp_register_script(
		'create-block-ajm-wc-demo',
		plugins_url($index_js, __FILE__),
		[
			'wp-block-editor',
			'wp-blocks',
			'wp-element',
		],
		filemtime("$dir/$index_js"),
		true
	);

	register_block_type(
		$dir,
		[
			'script' => 'create-block-ajm-wc-demo',
		]
	);
}
add_action('init', __NAMESPACE__ . '\create_block_init');
