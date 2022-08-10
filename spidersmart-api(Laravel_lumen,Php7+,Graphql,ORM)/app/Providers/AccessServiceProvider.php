<?php

namespace App\Providers;

use App\Annotations\Access;
use App\Helpers\UserContext;
use Doctrine\Common\Annotations\AnnotationReader;
use Illuminate\Support\ServiceProvider;
use ReflectionException;
use Symfony\Component\Finder\Finder;
use ReflectionClass;

class AccessServiceProvider extends ServiceProvider
{
    /**
     * @var array The annotations which should be supported
     */
    private $annotations = [
        \App\Annotations\Access::class
    ];
    /**
     * @var array The namespaces which will be scanned for occurrence of supported annotations
     */
    private $scanNamespaces = [
        '\\App\\Services\\'
    ];
    /**
     * @var array The interfaces which can support these annotations (only classes that extend one or more of these interfaces will be scanned)
     */
    private $scanInterfaces = [
        \App\Contracts\CrudService::class
    ];
    /**
     * @var ReflectionClass[] The reflected objects of the classes to scan (populated automatically)
     */
    private $scanObjects = [];

    /**
     * Derives list of classes which should be scanned for supported annotations.
     *
     * @throws ReflectionException
     * @return void
     */
    public function register()
    {
        // registers the user permissions object as a singleton
        $this->app->singleton(UserContext::class);

        // derive a list of directories to scan from given namespaces
        $scanDirectories = [];
        foreach ($this->scanNamespaces as $namespace) {
            $scanDirectories[$namespace] = app()->basePath() . str_replace('\\', DIRECTORY_SEPARATOR, str_replace('App', 'app', $namespace));
        }

        // go through directories and find all classes which match given interfaces to derive a list of class instantiations for which the annotations will scan
        $finder = new Finder();
        foreach ($scanDirectories as $namespace => $directory) {
            $finder->files()->in($directory);
            foreach ($finder as $file) {
                $entity = new ReflectionClass($namespace . str_replace('.php', '', $file->getRelativePathname()));
                if (sizeof(array_intersect($entity->getInterfaceNames(), $this->scanInterfaces)) > 0) {
                    $this->scanObjects[] = $entity;
                }
            }
        }
    }

    /**
     * Initializes, scans for, and acts upon any supported annotations found in scan classes
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     *
     * @return void
     */
    public function boot()
    {
        // add blueprint (REST API documentation) annotations to ignore (these run only during an artisan cli command, so should not be interpreted during api execution)
        foreach (['Get', 'Post', 'Put', 'Batch', 'Delete', 'Transaction', 'Versions', 'Request', 'Response', 'Parameters', 'Parameter'] as $ignoreAnnot) {
            AnnotationReader::addGlobalIgnoredName($ignoreAnnot);
        }

        // since doctrine checks for annotation class existence without running autoload (for obvious reasons), it will
        // not find the annotation classes unless we load it here first
        $this->annotations = array_filter($this->annotations, function ($annotation) {
            return class_exists($annotation);
        });
    }
}
