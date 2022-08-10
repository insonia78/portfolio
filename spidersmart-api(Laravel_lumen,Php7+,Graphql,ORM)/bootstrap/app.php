<?php

require_once __DIR__ . '/../vendor/autoload.php';

try {
    (new Laravel\Lumen\Bootstrap\LoadEnvironmentVariables(
        dirname(__DIR__)
    ))->bootstrap();
} catch (Dotenv\Exception\InvalidPathException $e) {
    //
}

/*
|--------------------------------------------------------------------------
| Create The Application
|--------------------------------------------------------------------------
|
| Here we will load the environment and create the application instance
| that serves as the central piece of this framework. We'll use this
| application as an "IoC" container and router for this framework.
|
*/

$app = new Laravel\Lumen\Application(
    realpath(__DIR__ . '/../')
);

$app->withFacades();

if (!class_exists('EntityManager')) {
    class_alias('LaravelDoctrine\ORM\Facades\EntityManager', 'EntityManager');
}
if (!class_exists('Registry')) {
    class_alias('LaravelDoctrine\ORM\Facades\Registry', 'Registry');
}
if (!class_exists('Doctrine')) {
    class_alias('LaravelDoctrine\ORM\Facades\Doctrine', 'Doctrine');
}
if (!class_exists('API')) {
    class_alias('Dingo\Api\Facade\API', 'API');
}
//class_alias('Dingo\Api\Facade\Route', 'Route');
//class_alias('Nuwave\Lighthouse\Support\Facades\GraphQLFacade::class', 'GraphQL');


// Register Config Files
$app->configure('cache');
$app->configure('auth');
$app->configure('cors');
$app->configure('database');
$app->configure('doctrine');
$app->configure('lighthouse');
$app->configure('filesystems');

/*
|--------------------------------------------------------------------------
| Register Container Bindings
|--------------------------------------------------------------------------
|
| Now we will register a few bindings in the service container. We will
| register the exception handler and the console kernel. You may add
| your own bindings here if you like or you can make another file.
|
*/

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->instance('path.config', app()->basePath() . DIRECTORY_SEPARATOR . 'config');
$app->instance('path.storage', app()->basePath() . DIRECTORY_SEPARATOR . 'storage');

/*
|--------------------------------------------------------------------------
| Register Middleware
|--------------------------------------------------------------------------
|
| Next, we will register the middleware with the application. These can
| be global middleware that run before and after each request into a
| route or middleware that'll be assigned to some specific routes.
|
*/
$app->middleware([
    // ...
    Fruitcake\Cors\HandleCors::class,
]);
$app->middleware([
//    Nord\Lumen\Cors\CorsMiddleware::class
]);

$app->routeMiddleware([
    'auth' => App\Http\Middleware\Authenticate::class
]);

if (!function_exists('config_path')) {
    function config_path($path = '')
    {
        return app()->basePath() . '/config' . ($path ? '/' . $path : $path);
    }
}
if (!function_exists('app_path')) {
    function app_path($path = '')
    {
        return app()->basePath() . '/app' . ($path ? '/' . $path : $path);
    }
}


/*
|--------------------------------------------------------------------------
| Register Service Providers
|--------------------------------------------------------------------------
|
| Here we will register all of the application's service providers which
| are used to bind services into the container. Service providers are
| totally optional, so you are not required to uncomment this line.
|git
*/

$app->register(App\Providers\AppServiceProvider::class);
$app->register(App\Providers\AccessServiceProvider::class);
$app->register(App\Providers\AuthServiceProvider::class);
$app->register(App\Providers\EventServiceProvider::class);
//$app->register('Nord\Lumen\Cors\CorsServiceProvider');
$app->register(Fruitcake\Cors\CorsServiceProvider::class);

$app->register(LaravelDoctrine\ORM\DoctrineServiceProvider::class);
$app->register(LaravelDoctrine\Extensions\GedmoExtensionsServiceProvider::class);
$app->register(App\Providers\BeberleiExtensionsServiceProvider::class);
$app->register(Dingo\Api\Provider\LumenServiceProvider::class);
$app->register(Nuwave\Lighthouse\LighthouseServiceProvider::class);

/*
|--------------------------------------------------------------------------
| Load The Application Routes
|--------------------------------------------------------------------------
|
| Next we will include the routes file so that they can all be added to
| the application. This will provide all of the URLs the application
| can respond to, as well as the controllers that may handle them.
|

*/
$app->router->group(['namespace' => 'App\Http\Controllers'], function ($app) {
    require __DIR__ . '/../routes/rest.php';
});
// $app->router->group([
//     'namespace' => 'App\Http\Controllers',
// ], function ($router) {
//     require __DIR__.'/../routes/web.php';
// });
return $app;
