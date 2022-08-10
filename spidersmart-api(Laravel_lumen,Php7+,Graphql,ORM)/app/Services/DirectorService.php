<?php

namespace App\Services;

use App\Annotations\Access;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Models\Entities\Primary\Director;
use App\Transformers\UserTransformer;

/**
 * Class DirectorService
 * @package App\Services
 */
class DirectorService extends UserService
{
    /**
     * Retrieve all directors
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="user-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Director::class,
                $inputs['queryOptions'] ?? []
            ),
            new UserTransformer(),
            ['addresses', 'contacts']
        );
    }
}
