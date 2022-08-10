<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () {
    return view('login');
});
$router->get('logout', 'TokenController@logoutFromCookie');
$router->get('oauth/logout', 'TokenController@logoutFromHeader');
$router->get('account/{id}', 'AccountController@get');
$router->post('account', 'AccountController@create');
$router->put('account/{id}', 'AccountController@update');
$router->post('impersonate', 'ImpersonateController@impersonate');
$router->post('stop-impersonation', 'ImpersonateController@stopImpersonation');
