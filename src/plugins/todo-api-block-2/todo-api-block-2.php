<?php
/**
 * Plugin Name:       Todo Api Block 2
 * Description:       Example block scaffolded with Create Block tool – no build step required.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       todo-api-block-2
 *
 * @package           create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_todo_api_block_2_block_init() {
	$dir = __DIR__;

	$index_js = 'index.js';
	wp_register_script(
		'create-block-todo-api-block-2-block-editor',
		plugins_url( $index_js, __FILE__ ),
		array(
			'wp-block-editor',
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir/$index_js" )
	);
	wp_set_script_translations( 'create-block-todo-api-block-2-block-editor', 'todo-api-block-2' );

	$editor_css = 'editor.css';
	wp_register_style(
		'create-block-todo-api-block-2-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'style.css';
	wp_register_style(
		'create-block-todo-api-block-2-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type(
		$dir,
		array(
			'editor_script' => 'create-block-todo-api-block-2-block-editor',
			'editor_style'  => 'create-block-todo-api-block-2-block-editor',
			'style'         => 'create-block-todo-api-block-2-block',
		)
	);
}
add_action( 'init', 'create_block_todo_api_block_2_block_init' );
