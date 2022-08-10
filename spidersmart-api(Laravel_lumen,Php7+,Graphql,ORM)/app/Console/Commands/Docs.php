<?php

namespace App\Console\Command;

use ReflectionClass;
use Dingo\Blueprint\Writer;
use Illuminate\Support\Arr;
use Dingo\Api\Routing\Router;
use Dingo\Blueprint\Blueprint;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class Docs extends Command
{
    /**
     * Router instance.
     *
     * @var \Dingo\Api\Routing\Router
     */
    protected $router;

    /**
     * The blueprint instance.
     *
     * @var \Dingo\Blueprint\Blueprint
     */
    protected $blueprint;

    /**
     * Blueprint instance.
     *
     * @var \Dingo\Blueprint\Blueprint
     */
    protected $docs;

    /**
     * Writer instance.
     *
     * @var \Dingo\Blueprint\Writer
     */
    protected $writer;

    /**
     * Default documentation name.
     *
     * @var string
     */
    protected $name;

    /**
     * Default documentation version.
     *
     * @var string
     */
    protected $version;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:docs {--name= : Name of the generated documentation}
                                     {--use-version= : Version of the documentation to be generated}
                                     {--output-file= : Output the generated documentation to a file}
                                     {--include-path= : Path where included documentation files are located}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate API documentation from annotated controllers';

    /**
     * Create a new docs command instance.
     *
     * @param \Dingo\Api\Routing\Router  $router
     * @param \Dingo\Blueprint\Blueprint $blueprint
     * @param \Dingo\Blueprint\Writer    $writer
     * @param string                     $name
     * @param string                     $version
     *
     * @return void
     */
    public function __construct(Router $router, Blueprint $blueprint, Writer $writer, $name, $version)
    {
        parent::__construct();

        $this->router = $router;
        $this->blueprint = $blueprint;
        $this->writer = $writer;
        $this->name = $name;
        $this->version = $version;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // TODO: here we need to follow getControllers() and create a list of the Services instead
        // still follow the routes as defined in web except ignore the graphql route and reference the resolver attribute
        // in routes instead of uses (manipulated to directly reference the services of course)


        $contents = $this->blueprint->generate($this->getControllers(), $this->getDocName(), $this->getVersion(), $this->getIncludePath());

        $file = $this->option('output-file');
        if ($file) {
            $this->writer->write($contents, $file);

            $this->info('Documentation was generated successfully.');
        }

        $this->line($contents);
    }

    /**
     * Get the documentation name.
     * @SuppressWarnings(PHPMD.ExitExpression)
     *
     * @return string
     */
    protected function getDocName()
    {
        $name = $this->option('name') ?: $this->name;

        if (! $name) {
            $this->comment('A name for the documentation was not supplied. Use the --name option or set a default in the configuration.');

            exit;
        }

        return $name;
    }

    /**
     * Get the include path for documentation files.
     *
     * @return string
     */
    protected function getIncludePath()
    {
        return base_path($this->option('include-path'));
    }

    /**
     * Get the documentation version.
     * @SuppressWarnings(PHPMD.ExitExpression)
     *
     * @return string
     */
    protected function getVersion()
    {
        $version = $this->option('use-version') ?: $this->version;

        if (! $version) {
            $this->comment('A version for the documentation was not supplied. Use the --use-version option or set a default in the configuration.');

            exit;
        }

        return $version;
    }

    /**
     * Get all the controller instances.
     *
     * @return Collection
     */
    protected function getControllers()
    {
        $controllers = new Collection();

        $ref = new ReflectionClass(\App\Services\CenterService::class);
        $refInstance = $ref->newInstance();

        $this->addControllerIfNotExists($controllers, $refInstance);

        return $controllers;
    }

    /**
     * Add a controller to the collection if it does not exist. If the
     * controller implements an interface suffixed with "Docs" it
     * will be used instead of the controller.
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param Collection $controllers
     * @param object $controller
     *
     * @return void
     */
    protected function addControllerIfNotExists(Collection $controllers, $controller)
    {
        $class = get_class($controller);

        if ($controllers->has($class)) {
            return;
        }

        $reflection = new ReflectionClass($controller);

        $interface = Arr::first($reflection->getInterfaces(), function ($key) {
            return substr($key, -strlen('Docs')) === 'Docs';
        });

        if ($interface) {
            $controller = $interface;
        }

        $controllers->put($class, $controller);
    }
}
