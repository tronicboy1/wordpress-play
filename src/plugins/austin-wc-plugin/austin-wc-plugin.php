<?php

/**
 * Plugin Name: Austin Web Component Plugin
 * Description: A set of web components that can be used in any template.
 */

function register_wc_scripts()
{
  $url = plugin_dir_url(__FILE__) . '/public/js/';
  wp_register_script('hello-world-wc', $url . 'hello-word.wc.js', array(), '1.3', true);
  wp_register_script('ngwc-hello-world', $url . 'ngwc-hello-world/main.js', [], '0.0.7', true);
  wp_register_script('ngwc-routing', $url . 'ngwc-routing/main.js', [], '0.0.0', true);
  wp_register_script('litwc-hello-world', $url . 'litwc-todo-lookup.js', ['rxjs'], '0.0.0', true);
  wp_register_script('wc-svelte', $url . 'wc-svelte.js', [], '0.0.0', true);
  wp_register_script('wc-svelte-todo', $url . 'wc-svelte-todo.js', ['rxjs'], '0.0.0', true);
  wp_register_script('rxjs', 'https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js', []);
  wp_register_script('wc-svelte-posts', $url . 'wc-svelte-posts.js', ['rxjs'], '0.0.0', true);
  wp_register_script('wc-lit-todos', $url . 'wc-lit-todos.js', ['rxjs'], '0.0.0', true);
}
add_action('init', 'register_wc_scripts');

function render_wc_scripts(string $name)
{
  wp_enqueue_script($name);
}
add_action('render_wc_scripts', 'render_wc_scripts');

function add_type_module_tag(string $tag, string $handle, string $src): string
{
  if (str_contains($handle, 'lit') || str_contains($handle, 'svelte')) {
    return "<script type=\"module\" src=\"$src\"></script>";
  }
  return $tag;
}
add_filter('script_loader_tag', 'add_type_module_tag', 10, 3);

function add_importmap_script()
{
?>
  <script type="importmap">
    {
			"imports": {
				"lit": "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js",
				"lit/": "https://cdn.jsdelivr.net/npm/lit@2.7.0/",
				"@lit/reactive-element/decorators/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@1.6.1/decorators/",
        "lit-html/": "https://unpkg.com/lit-html@2.7.2/",
				"rxjs": "https://unpkg.com/rxjs@7.8.0/dist/bundles/rxjs.umd.min.js"
			}
		}
	</script>
<?php
}
add_action('wp_head', 'add_importmap_script');
