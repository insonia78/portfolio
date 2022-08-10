<?php

namespace App\Services;

use App\Annotations\Access;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Models\Entities\Primary\Guardian;
use App\Transformers\UserTransformer;

/**
 * Class GuardianService
 * @package App\Services
 */
class GuardianService extends UserService
{
    /**
     * Retrieve all guardians
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="guardian-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Guardian::class,
                $inputs['queryOptions'] ?? []
            ),
            new UserTransformer(),
            ['addresses', 'contacts']
        );
    }
}
