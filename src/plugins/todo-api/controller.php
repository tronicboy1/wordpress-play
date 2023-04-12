<?php

namespace Todo;

use WP_REST_Request;
use WP_REST_Response;

class TodoController
{
  static function init()
  {
    register_rest_route('todo/v1', '/todos', [
      'methods' => 'GET',
      'callback' => 'Todo\TodoController::get',
      'permission_callback' => function () {
        return true;
      }
    ]);
    register_rest_route('todo/v1', '/todos', [
      'methods' => 'POST',
      'callback' => 'Todo\TodoController::post',
      'permission_callback' => function () {
        return true;
      }
    ]);
  }

  static function get(WP_REST_Request $request)
  {
    $qp = $request->get_query_params();
    $page = array_key_exists('page', $qp) ? intval($qp['page']) : 1;
    if ($page < 1) {
      return TodoController::make400Response('InvalidPage');
    }

    $worker = new TodoDbWorker();
    $data = $worker->all($page);

    $response = new WP_REST_Response($data);
    $response->set_status(200);
    return $response;
  }

  static function post(WP_REST_Request $request)
  {
    $body = $request->get_json_params();
    $text = $body['text'];
    if (!$text) {
      return TodoController::make400Response('InvalidBody');
    }

    $worker = new TodoDbWorker();
    $worker->create(['text' => $text]);

    $response = new WP_REST_Response();
    $response->set_status(200);
    return $response;
  }

  static private function make400Response($message = '')
  {
    $response = new WP_REST_Response($message);
    $response->set_status(400);
    return $response;
  }
}
