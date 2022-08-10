<?php

namespace App\Annotations;

use App\Exceptions\AuthorizationException;
use App\Helpers\UserContext;
use Doctrine\Common\Annotations\Annotation;

/**
 * Class Access
 * @package App\Annotations
 *
 * @Annotation
 * @Target("METHOD")
 */
class Access
{
    /**
     * Initialize annotation actions.
     *
     * @param array $values The annotation arguments
     * @throws AuthorizationException
     */
    public function __construct(array $values)
    {
        $permissions = app(UserContext::class)->getPermissions();
        if (env('DISABLE_AUTHORIZATION') !== true && (!is_array($permissions) || sizeof(array_intersect($permissions, explode(',', $values['permission']))) < 1)) {
            throw new AuthorizationException('You do not have permissions to perform this action.');
        }
    }
}
