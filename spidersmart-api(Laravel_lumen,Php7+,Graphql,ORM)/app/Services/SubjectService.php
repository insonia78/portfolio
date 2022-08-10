<?php

namespace App\Services;

use App\Annotations\Access;
use App\Contracts\BusinessModelService;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Level;
use App\Models\Entities\Primary\Subject;
use App\Transformers\LevelTransformer;
use App\Transformers\SubjectTransformer;
use Symfony;

class SubjectService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'required|string',
        'displayName' => 'string|nullable',
        'displayIcon' => 'string|nullable',
        'description' => 'string'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'level' => \App\Services\LevelService::class
    ];

    /**
     * Retrieve a subject from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="subject-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of subject
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // $this->validateIdentifier($identifier);
        return $this->transform(
            $this->retrieveEntity(
                Subject::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new SubjectTransformer(),
            ['levels', 'centers']
        );
    }

    /**
     * Retrieve all subjects
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="subject-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Subject::class,
                $inputs['queryOptions'] ?? []
            ),
            new SubjectTransformer(),
            ['levels']
        );
    }

    /**
     * Retrieve levels from the given subject
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="subject-view")
     */
    public function getLevels(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject center restriction as filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 's.id', 'value' => $inputs['id'] ]
        ]);

        return $this->transform(
            $this->retrieveCollection(
                Level::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('subject', 's')
                ]
            ),
            new LevelTransformer(),
            ['subject']
        );
    }

    /**
     * Create a new subject
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="subject-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new Subject()),
            new SubjectTransformer()
        );
    }

    /**
     * Updates a subject with given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="subject-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Subject::class, new RepositoryIdentifier($inputs['id']))),
            new SubjectTransformer()
        );
    }

    /**
     * Deletes a given subject
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="subject-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Subject::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
