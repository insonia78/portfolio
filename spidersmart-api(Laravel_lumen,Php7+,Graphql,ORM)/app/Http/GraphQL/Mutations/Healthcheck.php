<?php

namespace App\Http\GraphQL\Mutations;

use Nuwave\Lighthouse\Schema\Context;
use GraphQL\Type\Definition\ResolveInfo;

class Healthcheck
{
    /**
     * Return a value for the field.
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     *
     * @param null $rootValue Usually contains the result returned from the parent field. In this case, it is always `null`.
     * @param array $args The arguments that were passed into the field.
     * @param Context $context Arbitrary data that is shared between all fields of a single query.
     * @param ResolveInfo $resolveInfo Information about the query itself, such as the execution state, the field name, path to the field from the root, and more.
     *
     * @return mixed
     */
    public function resolve($rootValue, array $args, Context $context, ResolveInfo $resolveInfo)
    {
        return true;
    }
}
