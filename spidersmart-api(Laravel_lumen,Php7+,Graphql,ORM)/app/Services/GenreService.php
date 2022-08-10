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
use App\Models\Entities\Primary\Genre;
use App\Transformers\GenreTransformer;
use Symfony;

/**
 * Class GenreService
 * @package App\Services
 */
class GenreService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'required|string',
        'active' => 'boolean'
    ];

    /**
     * Retrieve an genre from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="genre-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of genre
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        return $this->transform(
            $this->retrieveEntity(
                Genre::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new GenreTransformer(),
            ['books']
        );
    }

    /**
     * Retrieve all genres
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="genre-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Genre::class,
                $inputs['queryOptions'] ?? []
            ),
            new GenreTransformer()
        );
    }

    /**
     * Create a new genre
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="genre-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new Genre()),
            new GenreTransformer()
        );
    }

    /**
     * Update an genre with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="genre-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Genre::class, new RepositoryIdentifier($inputs['id']))),
            new GenreTransformer()
        );
    }

    /**
     * Deletes a given genre
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="genre-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Genre::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
