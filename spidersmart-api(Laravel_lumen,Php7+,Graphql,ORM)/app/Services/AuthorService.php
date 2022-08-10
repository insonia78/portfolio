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
use App\Models\Entities\Primary\Author;
use App\Transformers\AuthorTransformer;
use Symfony;

/**
 * Class AuthorService
 * @package App\Services
 */
class AuthorService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'required|string',
        'active' => 'boolean'
    ];

    /**
     * Retrieve an author from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="author-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of author
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // ensure there is an id
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        return $this->transform(
            $this->retrieveEntity(
                Author::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new AuthorTransformer(),
            ['books']
        );
    }

    /**
     * Retrieve all authors
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="author-view")
     */
    public function getAll(array $inputs = []): array
    {

        return $this->transform(
            $this->retrieveCollection(
                Author::class,
                $inputs['queryOptions'] ?? []
            ),
            new AuthorTransformer()
        );
    }

    /**
     * Create a new author
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="author-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new Author()),
            new AuthorTransformer()
        );
    }

    /**
     * Update an author with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="author-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Author::class, new RepositoryIdentifier($inputs['id']))),
            new AuthorTransformer()
        );
    }

    /**
     * Deletes a given author
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="author-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Author::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
