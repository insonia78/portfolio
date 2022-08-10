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
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Level;
use App\Transformers\LevelTransformer;
use Symfony;

/**
 * Class LevelService
 * @package App\Services
 */
class LevelService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'required|string',
        'description' => 'string|nullable',
        'rule' => 'string',
        'vocabLines' => 'integer|gt:0',
        'shortAnswerLines' => 'integer|gt:0',
        'essayLines' => 'integer|gt:0'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'subject' => \App\Services\SubjectService::class,
        'books' => \App\Services\BookService::class
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'files' => \App\Services\LevelFileService::class
    ];

    /**
     * Retrieve a level from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="level-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of level
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }
        $identifier = (isset($inputs['id'])) ? new RepositoryIdentifier($inputs['id']) : new RepositoryIdentifier($inputs['name'], 'name', FILTER_SANITIZE_STRING);

        return $this->transform(
            $this->retrieveEntity(
                Level::class,
                $identifier
            ),
            new LevelTransformer(),
            ['subject', 'books', 'files']
        );
    }

    /**
     * Retrieve all levels
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="level-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Level::class,
                $inputs['queryOptions'] ?? []
            ),
            new LevelTransformer(),
            ['subject']
        );
    }

    /**
     * Create a new level
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="level-create")
     */
    public function create(array $inputs): array
    {
        // check for uploaded files and process if they exist
        if (array_key_exists('files', $inputs) && is_array($inputs['files'])) {
            $inputs['files'] = $this->uploadAndFormatFileList($inputs['files'], 'levels');
        }

        return $this->transform(
            $this->insert($inputs, new Level()),
            new LevelTransformer()
        );
    }

    /**
     * Update a level with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="level-update")
     */
    public function update(array $inputs): array
    {
        // check for uploaded files and process if they exist
        if (array_key_exists('files', $inputs) && is_array($inputs['files'])) {
            $inputs['files'] = $this->uploadAndFormatFileList($inputs['files'], 'levels');
        }

        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Level::class, new RepositoryIdentifier($inputs['id']))),
            new LevelTransformer()
        );
    }

    /**
     * Deletes a given level
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="level-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Level::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
