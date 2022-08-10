<?php

namespace App\Services;

use App\Annotations\Access;
use App\Contracts\BusinessModelService;
use App\Contracts\CrudService;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Publisher;
use App\Transformers\PublisherTransformer;
use Symfony;

/**
 * Class PublisherService
 * @package App\Services
 */
class PublisherService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'required|string',
        'active' => 'boolean'
    ];

    /**
     * Retrieve an publisher from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="publisher-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of publisher
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        return $this->transform(
            $this->retrieveEntity(
                Publisher::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new PublisherTransformer(),
            ['books']
        );
    }

    /**
     * Retrieve all publishers
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="publisher-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Publisher::class,
                $inputs['queryOptions'] ?? []
            ),
            new PublisherTransformer()
        );
    }

    /**
     * Create a new publisher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="publisher-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new Publisher()),
            new PublisherTransformer()
        );
    }

    /**
     * Update an publisher with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="publisher-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Publisher::class, new RepositoryIdentifier($inputs['id']))),
            new PublisherTransformer()
        );
    }

    /**
     * Deletes a given publisher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="publisher-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Publisher::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
