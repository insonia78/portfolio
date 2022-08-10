<?php

namespace App\Services;

use App\Annotations\Access;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Models\Entities\Primary\Administrator;
use App\Transformers\UserTransformer;

/**
 * Class AdministratorService
 * @package App\Services
 */
class AdministratorService extends UserService
{
    /**
     * Retrieve all administrators
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="administrator-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Administrator::class,
                $inputs['queryOptions'] ?? []
            ),
            new UserTransformer(),
            ['addresses', 'contacts']
        );
    }
}
