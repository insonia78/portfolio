<?php

namespace App\Http\Controllers;

use App\Annotations\Access;
use Doctrine\Common\Annotations\AnnotationReader;
use FastRoute\BadRouteException;
use Laravel\Lumen\Routing\Controller;
use ReflectionClass;

/**
 * Class BaseController
 * @package App\Http\Controllers
 */
class BaseController extends Controller
{
    /**
     * @const string The namespace in which invoked services are contained
     */
    protected const SERVICE_NAMESPACE = '\\App\\Services\\';
    /**
     * @var null|object The service being invoked by the request
     */
    protected $service = null;
    /**
     * @var string|null The name of the service which is being invoked by the current mutation
     */
    protected $serviceName = null;
    /**
     * @var string|null The name of the method which is being invoked by the current mutation
     */
    protected $methodName = null;

    /**
     * Prepares necessary service properties from the given resolver
     *
     * @param string $resolver The resolver to process
     * @throws \FastRoute\BadRouteException If the resolver cannot be parsed or points to invalid service/method
     * @throws \ReflectionException If the resolved method fails to reflect
     *
     * @return void
     */
    protected function prepareServiceFromResolver($resolver)
    {
        // ensure that there is a resolver set in the route and that it is valid
        if (!$resolver) {
            throw new BadRouteException('Missing resolver in route.');
        }
        if (strpos($resolver, '@') === false) {
            throw new BadRouteException('Malformed resolver in route.');
        }

        // set model and method from resolver and verify that they are valid
        list($this->serviceName, $this->methodName) = explode('@', $resolver);
        $this->serviceName .= 'Service';

        // valid resolvers point to services which are instantiable subclasses of BaseService in the Services namespace
        $reflect = new ReflectionClass($this::SERVICE_NAMESPACE . $this->serviceName);
        if (
            !$reflect->isInstantiable()
            || !$reflect->isSubclassOf($this::SERVICE_NAMESPACE . 'BaseService')
            || !$reflect->inNamespace()
            || '\\' . $reflect->getNamespaceName() . '\\' != $this::SERVICE_NAMESPACE
        ) {
            throw new BadRouteException('Resolver points to invalid service.');
        }
        if (!$reflect->hasMethod($this->methodName)) {
            throw new BadRouteException('Resolver points to method which does not exist.');
        }
        $this->service = $reflect->newInstance();

        // ensure that the given user has permission to access the requested action
        $reader = new AnnotationReader();
        $reader->getMethodAnnotation($reflect->getMethod($this->methodName), Access::class);
    }
}
