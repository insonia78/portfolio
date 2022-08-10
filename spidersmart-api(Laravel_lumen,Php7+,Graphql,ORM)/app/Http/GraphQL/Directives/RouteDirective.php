<?php

namespace App\Http\GraphQL\Directives;

use FastRoute\BadRouteException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Nuwave\Lighthouse\Exceptions\DirectiveException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use ReflectionClass;

/**
 * Class RouteDirective
 * @package App\Http\GraphQL\Directives
 */
class RouteDirective extends BaseDirective implements FieldResolver
{

    /**
     * @var string The controller used to pass through service requests
     */
    private const CONTROLLER = '\\App\\Http\\Controllers\\GraphQLController';
    /**
     * @var string The field resolver
     */
    protected $resolver;
    /**
     * @var string The field resolver method
     */
    protected $method;

    /**
     * Name of the directive.
     *
     * @return string
     */
    public function name()
    {
        return 'route';
    }

    /**
     * Resolve the field directive.
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     *
     * @param \Nuwave\Lighthouse\Schema\Values\FieldValue $value The field to which this route directive refers
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException If the requested controller does not exist
     * @throws \Nuwave\Lighthouse\Exceptions\DirectiveException If the resolver or operation are invalid
     * @return \Nuwave\Lighthouse\Schema\Values\FieldValue Updated field value with resolver set by given parameters
     */
    public function resolveField(FieldValue $value)
    {
        // get the resolver and operation
        $resolver = $this->getResolver();
        $operation = $this->getOperation();

        return $value->setResolver(
            // note: although root and context are not referenced here, they are NECESSARY for lighthouses internal routing
            function ($root, array $args, $context = null, $info = null) use ($resolver, $operation) {
                // set the resolver to context information and verify the controller route is valid
                $info->serviceResolver = $resolver;
                $reflect = new ReflectionClass($this::CONTROLLER);
                if (!$reflect->isInstantiable()) {
                    // this is a config error in the code rather than a schema issue so throw a http internal 500 error
                    throw new HttpException('GraphQL Controller does not exist.');
                }
                if (!$reflect->hasMethod($operation)) {
                    throw new DirectiveException('Directive `route`: `operation` argument is invalid. Method does not exist in controller.');
                }

                // instantiate the controller and call the routed operation
                try {
                    $controller = $reflect->newInstance($resolver, $args, $info);
                    return $controller->$operation();
                } catch (BadRouteException $e) {
                    throw new DirectiveException('Directive `route`: `resolver` argument is invalid. ' . $e->getMessage());
                }
            }
        );
    }

    /**
     * Get resolver for route.
     *
     * @throws \Nuwave\Lighthouse\Exceptions\DirectiveException If the resolver doesn't exist in the directive
     * @return string
     */
    protected function getResolver()
    {
        $resolver = $this->directiveArgValue('resolver');

        if (!$resolver) {
            throw new DirectiveException('Directive `route` must have a `resolver` argument.');
        }

        return $resolver;
    }

    /**
     * Get operation for route.
     *
     * @throws \Nuwave\Lighthouse\Exceptions\DirectiveException If the operation doesn't exist in the directive
     * @return string
     */
    protected function getOperation()
    {
        $operation = $this->directiveArgValue('operation');

        if (!$operation) {
            throw new DirectiveException('Directive `route` must have an `operation` argument.');
        }

        return $operation;
    }
}
