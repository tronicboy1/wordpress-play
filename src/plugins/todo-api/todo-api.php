<?php
/*
 * Plugin Name:       Todo API
 * Plugin URI:        NA
 * Description:       A RESTful API endpoint for adding todos
 * Version:           0.0.0
 * Author:            Austin Mayer
 * Author URI:        https://author.example.com/
 * License:           MIT
 */
include('worker.php');
include('controller.php');

use Todo\TodoDbWorker;

function setup_todo_table()
{
  $worker = new TodoDbWorker();
  $worker->setup_table();
}
register_activation_hook(__FILE__, 'setup_todo_table');

function destroy_todo_table()
{
  $worker = new TodoDbWorker();
  $worker->destroy_table();
}
register_deactivation_hook(__FILE__, 'destroy_todo_table');
add_action('rest_api_init', 'Todo\TodoController::init');
