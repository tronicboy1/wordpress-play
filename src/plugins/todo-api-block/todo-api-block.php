<?php

/**
 * Plugin Name:       Todo Api Block
 * Description:       Example block scaffolded with Create Block tool – no build step required.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       todo-api-block
 *
 * @package           create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_todo_api_block_init()
{
	$dir = __DIR__;

	$index_js = 'build/index.js';
	wp_register_script(
		'create-block-todo-api-block-editor-lit',
		plugins_url($index_js, __FILE__),
		array(
			'wp-block-editor',
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime("$dir/$index_js"),
		true
	);
	wp_set_script_translations('create-block-todo-api-block-editor-lit', 'todo-api-block');

	// $editor_css = 'editor.css';
	// wp_register_style(
	// 	'create-block-todo-api-block-editor',
	// 	plugins_url( $editor_css, __FILE__ ),
	// 	array(),
	// 	filemtime( "$dir/$editor_css" )
	// );

	// $style_css = 'style.css';
	// wp_register_style(
	// 	'create-block-todo-api-block-block',
	// 	plugins_url( $style_css, __FILE__ ),
	// 	array(),
	// 	filemtime( "$dir/$style_css" )
	// );

	register_block_type(
		$dir,
		array(
			'editor_script' => 'create-block-todo-api-block-editor-lit',
		)
	);
}
add_action('init', 'create_block_todo_api_block_init');

function add_importmap_script_admin()
{
?>
	<script type="importmap">
		{
			"imports": {
				"lit": "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js",
				"lit/": "https://cdn.jsdelivr.net/npm/lit@2.7.0/",
				"@lit/reactive-element/decorators/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@1.6.1/decorators/",
        "lit-html/": "https://unpkg.com/lit-html@2.7.2/",
				"rxjs": "https://cdn.jsdelivr.net/npm/rxjs@7.8.0/+esm"
			}
		}
	</script>
<?php
}
add_action('admin_head', 'add_importmap_script_admin', 0);
