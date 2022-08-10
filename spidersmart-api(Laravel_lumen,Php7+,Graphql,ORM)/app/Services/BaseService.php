<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Helpers\CollectionResult;
use App\Helpers\RepositoryFilter;
use App\Helpers\RepositoryIdentifier;
use App\Serializers\BaseSerializer;
use Doctrine\Common\Collections\Collection as DoctrineCollection;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Query\QueryException;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use DateTime;
use League\Fractal\TransformerAbstract;
use ReflectionClass;
use ReflectionException;

/**
 * Class BaseService
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @SuppressWarnings(PHPMD.NumberOfChildren)
 * @package App\Services
 */
class BaseService
{
    /**
     * @var array The validation rules for data attributes on related data model
     * @see https://laravel.com/docs/5.6/validation#available-validation-rules
     */
    protected $rules = [];

    /**
     * @var array The validation messages for data attributes on related data model
     * @see https://laravel.com/docs/5.6/validation#available-validation-rules
     */
    protected $messages = [];

    /**
     * @var array The list of services which are related to this service - they will be processed in retrieval and mutations
     *            Relationships cannot be modified by the main service, only associated or removed
     */
    protected $relationships = [];

    /**
     * @var array The list of services which are owned by this service - they will be processed in retrieval and mutations
     *            Owned Associations can be modified and mutation operations will recursively perform update and/or insert operations to
     *            make the structure match what is given
     */
    protected $ownedAssociations = [];

    /**
     * @var array The list of filter criteria which map to special criteria methods in the model
     * This can be useful to make relations filterable, filters that are passed which do not exist in this list will
     * be parsed using the built in Criteria methods which do not support relations (but are preferable for standard data)
     */
    protected $filterCriteria = [];

    /**
     * @var string|null
     */
    protected $model = null;

    /**
     * @var string|null
     */
    protected $modelRelationName = null;

    /**
     * @var string|null
     */
    protected $modelRelationPluralName = null;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var Manager
     */
    protected $transformerManager;

    /**
     * BaseService constructor.
     */
    public function __construct()
    {
        $this->entityManager = app()->make(EntityManager::class);
        $this->transformerManager = app()->make(Manager::class);
        $this->transformerManager->setSerializer(new BaseSerializer());
    }

    /**
     * Gets the validation rules associated with a given entity
     * @return array
     */
    public function getRules(): array
    {
        return $this->rules;
    }

    /**
     * Gets the validation messages associated with a given entity
     * @return array
     */
    public function getMessages(): array
    {
        return $this->messages;
    }

    /**
     * Gets the list of relationships
     * @return array
     */
    public function getRelationships(): array
    {
        return $this->relationships;
    }

    /**
     * Gets the list of owned associations
     * @return array
     */
    public function getOwnedAssociations(): array
    {
        return $this->ownedAssociations;
    }

    /**
     * Returns the fully qualified name of the model which this service manages
     * @throws ReflectionException If reflection of the service fails
     * @return string The name of the model
     */
    public function getModel(): string
    {
        if (is_null($this->model) || !class_exists($this->model)) {
            $serviceIdentifier = str_replace('Service', '', (new ReflectionClass($this))->getShortName());

            // set available namespaces for models
            $modelNamespaces = ['Primary', 'Secondary', 'Relation'];
            // look for the model in each namespace and return when found
            foreach ($modelNamespaces as $modelNamespace) {
                $model = '\\App\\Models\\Entities\\' . $modelNamespace . '\\' . $serviceIdentifier;
                if (class_exists($model)) {
                    $this->model = $model;
                    break;
                }
            }
        }
        return $this->model;
    }

    /**
     * Returns the name of the model as it is referred by relations rather than the formal model name
     * @throws ReflectionException If reflection of the service fails
     * @return string The name of the model for relations
     */
    public function getModelRelationName(): string
    {
        if (!isset($this->modelRelationName)) {
            $this->modelRelationName = (new ReflectionClass($this->getModel()))->getShortName();
        }
        return $this->modelRelationName;
    }

    /**
     * Returns the plural name of the model as it is referred by relations rather than the formal model name
     * @throws ReflectionException If reflection of the service fails
     * @return string The name of the model for relations
     */
    public function getModelRelationPluralName(): string
    {
        if (!isset($this->modelRelationPluralName)) {
            $this->modelRelationPluralName = (new ReflectionClass($this->getModel()))->getShortName() . 's';
        }
        return $this->modelRelationPluralName;
    }

    /**
     * Returns whether the original model has changed based on the given input
     * This can be overridden by child services to provide a comparison check and return false on entities which
     * haven't changed to prevent constant versioning of unchanged relationships when a parent is changed
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     * @param IdentifiableModel $original The original model
     * @param array $inputs The updated data to compare to the original model
     * @return bool True if it should be considered changed and versioned accordingly
     */
    public function isChanged(IdentifiableModel $original, array $inputs): bool
    {
        return true;
    }

    /**
     * This will retrieve an entity from a given repository with a given identifier
     * @param string $repository The repository/model from which to load resources
     * @param RepositoryIdentifier $identifier The identifier to use for retrieval
     * @throws ServiceEntityNotFoundException If the entity cannot be found with the given identifier
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved from the repository
     * @return VersionedModel|null  The instance of the repository entity or null if not found
     */
    protected function retrieveEntity(string $repository, RepositoryIdentifier $identifier): ?VersionedModel
    {
        $entity = null;
        try {
            $this->validateIdentifier($identifier);
            /** @var VersionedModel|null $entity */
            $entity = $this->entityManager->getRepository($repository)->findOneBy(
                [$identifier->getField() => $identifier->getId()]
            );
        } catch (\Exception $e) {
            throw new ServiceRetrieveFailureException('An issue occurred while retrieving the data.', 0, $e);
        }

        if (is_null($entity)) {
            throw new ServiceEntityNotFoundException('The entity could not be found.');
        }
        return $entity;
    }

    /**
     * This will retrieve an entity from a given repository with a given identifier
     * @param string $repository The repository/model from which to load resources
     * @param RepositoryIdentifier $identifier The identifier to use for retrieval
     * @param DateTime $time The time at which the entity should be returned
     * @throws ServiceEntityNotFoundException If the entity cannot be found with the given identifier
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved from the repository
     * @return VersionedModel|null  The instance of the repository entity or null if not found
     */
    protected function retrieveEntityAtTime(string $repository, RepositoryIdentifier $identifier, DateTime $time): ?VersionedModel
    {
        if ($this->entityManager->getFilters()->isEnabled('soft-deleteable')) {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }
        $entity = null;
        try {
            $this->validateIdentifier($identifier);
            $versionId = $this->findModelVersionId($repository, $identifier->getId(), $time);

            /** @var VersionedModel|null $entity */
            $entity = $this->entityManager->getRepository($repository)->findOneBy(
                ['id' => $versionId]
            );

            // if given entity is most recent version use that id
            // if versioned entity is most recent version, use that
            // else find the most recent version



            // when entities version, they don't change ID's - so regardless of which version is returned
            // the version at the point in time when it was active would have had the same ID as the current
            // version does now.  Therefore, the id of the returned version must be reset back to the
            // current ID.
            if (!is_null($entity) && !is_null($entity->getDateTo())) {
                $entityId = $this->findModelNewestId($repository, $identifier->getId());
                $entity->setId($entityId);
            }
        } catch (\Exception $e) {
            throw new ServiceRetrieveFailureException('An issue occurred while retrieving the data.', 0, $e);
        }

        if (is_null($entity)) {
            throw new ServiceEntityNotFoundException('The entity could not be found.');
        }
        return $entity;
    }

    /**
     * Updates an existing entity to the version of itself that existed at a given time
     *
     * @param VersionedModel $entity The entity to update
     * @param DateTime $time The time for which the version should be pulled
     * @throws ServiceEntityNotFoundException If the entity cannot be found with the given identifier
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved from the repository
     * @return VersionedModel|null The version of the entity at the time or null if there was no version at that time
     */
    protected function updateEntityToVersionAtTime(VersionedModel $entity, DateTime $time): ?VersionedModel
    {
        return $this->retrieveEntityAtTime(get_class($entity), new RepositoryIdentifier($entity->getId()), $time);
    }

    /**
     * Retrieves the original version of a given entity
     *
     * @param VersionedModel $entity The entity for which the original version should be retrieved
     * @throws ServiceEntityNotFoundException If the entity cannot be found with the given identifier
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved from the repository
     * @return VersionedModel The original version of the given model
     */
    protected function updateEntityToOriginalVersion(VersionedModel $entity): VersionedModel
    {
        if ($this->entityManager->getFilters()->isEnabled('soft-deleteable')) {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }
        $model = get_class($entity);
        if (!is_null($entity->getPreviousId())) {
            $originalId = $this->findModelOriginalId($model, $entity->getId());
            if (!is_null($originalId)) {
                $originalEntity = $this->retrieveEntity($model, new RepositoryIdentifier($originalId));
                // the id does not change when versioned, so no matter what time it was, the id would have been the same as it is now
                $originalEntity->setId($entity->getId());
                return $originalEntity;
            }
        }
        return $entity;
    }

    /**
     * Return a list of all versions of the given entity
     *
     * @param VersionedModel $entity The entity for which a version list should be retrieved
     * @return array
     */
    protected function getEntityVersions(VersionedModel $entity): array
    {
        // set needed metadata
        $model = get_class($entity);
        $table = $this->entityManager->getClassMetadata($model)->getTableName();
        $versionsList = [];
        $originalId = $entity->getId();

        // first, get the original version of the entity if the given version is not
        try {
            if (!is_null($entity->getPreviousId())) {
                $originalId = $this->findModelOriginalId($model, $originalId);
            }

            // get all versions of the entity
            $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                            SELECT id, date_from, date_to, previous_id FROM ' . $table . ' WHERE id=:id
                            UNION ALL
                            SELECT t.id, t.date_from, t.date_to, t.previous_id
                            FROM cte c
                            inner join ' . $table . ' t on t.previous_id = c.id
                        ) select * from cte');
            $query->bindValue('id', $originalId);
            $query->execute();
            $versions = $query->fetchAll();

            $versionsList = [];
            foreach ($versions as $version) {
                $versionsList[] = $this->retrieveEntity(get_class($entity), new RepositoryIdentifier($version['id']));
            }
        } catch (DBALException $e) {
            return [];
        } catch (ServiceEntityNotFoundException $e) {
            return [];
        } catch (ServiceRetrieveFailureException $e) {
            return [];
        }

        return $versionsList;
    }


    /**
     * This will retrieve a collection of entities from a given repository
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     * @param string $repository The repository/model from which to load resources
     * @param mixed[] $queryOptions Any options related to query retrieval which should be set
     * @param CollectionRelation[] $relations Any relations which should be joined in the collection lookup to be filterable/sortable
     * @return CollectionResult An array of containing a data property with the retrieved data and a count property with the retrieved result number
     * @throws ServiceRetrieveFailureException If some unexpected issue occurred such as a database or connection issue
     */
    protected function retrieveCollection(string $repository, array $queryOptions = [], array $relations = []): CollectionResult
    {
        $primaryTableIdentifier = '_main_';

        try {
            $queryJoins = '';
            foreach ($relations as $relation) {
                $relationName = (strpos($relation->getRelation(), '.') !== false) ? $relation->getRelation() : '_main_.' . $relation->getRelation();
                $queryJoins .= " {$relation->getJoinType()} JOIN {$relationName} {$relation->getIdentifier()}";
            }

            // if there are no filters, just return all results
            if (sizeof($queryOptions) < 1) {
                $results = $this->entityManager->createQuery("SELECT DISTINCT {$primaryTableIdentifier} FROM {$repository} {$primaryTableIdentifier} {$queryJoins}")->getResult();
                return new CollectionResult($results);
            }

            // add any filters to the query
            $queryCriteria = '';
            $filterQueries = [];
            $filterParams = [];
            $filterWeightedOrderClauses = [];
            $filters = $this->prepareFiltersFromInputs($queryOptions);
            if (sizeof($filters) > 0) {
                foreach ($filters as $filter) {
                    $parsedFilter = $this->parseCriteria($filter, $primaryTableIdentifier);
                    if (!empty($parsedFilter['query'])) {
                        $filterQueries[] = $parsedFilter['query'];
                        $filterParams = array_merge($filterParams, $parsedFilter['params']);
                    }
                    if (!is_null($parsedFilter['weightedOrderClause'])) {
                        $filterWeightedOrderClauses[] = $parsedFilter['weightedOrderClause'];
                    }
                }
                $queryCriteria .= (sizeof($filterQueries) > 0) ? ' WHERE ' . implode(' AND ', $filterQueries) : '';
            }

            // get total result count before setting return limitation/manipulation properties
            $count = $this->entityManager->createQuery("SELECT COUNT(DISTINCT {$primaryTableIdentifier}) FROM {$repository} {$primaryTableIdentifier} {$queryJoins} {$queryCriteria}")->setParameters($filterParams)->getSingleScalarResult();

            // handle sorting
            $sortFields = [];
            if (array_key_exists('sort', $queryOptions)) {
                $field = (isset($queryOptions['sort']['field'])) ? $queryOptions['sort']['field'] : null;
                $direction = (array_key_exists('direction', $queryOptions['sort'])) ? $queryOptions['sort']['direction'] : 'ASC';
                if (!is_null($field)) {
                    // inject the direction into the string for every field
                    $fields = explode(',', $field);
                    $sortFields = array_map(function ($fld) use ($direction, $primaryTableIdentifier) {
                        return (strpos($fld, '.') !== false) ? "{$fld} {$direction}" : "{$primaryTableIdentifier}.{$fld} {$direction}";
                    }, $fields);
                }
            }

            // if there is no explicit sort and there is a weighted sort, use that
            $weightedFilterSelect = '';
            if (sizeof($sortFields) < 1 && sizeof($filterWeightedOrderClauses) > 0) {
                $weightedFilterSelect .= ', (';
                foreach ($filterWeightedOrderClauses as $weightedSort) {
                    $weightedFilterSelect .= $weightedSort;
                }
                $weightedFilterSelect .= ') as WEIGHTED_SORT_SCORE';
                $sortFields[] = "WEIGHTED_SORT_SCORE desc";
            }

            // even if there are no sorts defined by the query, results should be in deterministic order to support paging
            // enforcing ordering by id as the final clause will ensure deterministic results
            $sortFields[] = "{$primaryTableIdentifier}.id asc";
            $queryCriteria .= " ORDER BY " . implode(',', $sortFields);
            $query = $this->entityManager->createQuery("SELECT DISTINCT {$primaryTableIdentifier}{$weightedFilterSelect} FROM {$repository} {$primaryTableIdentifier} {$queryJoins} {$queryCriteria}");
//dd($query->getSQL(), $filterParams);
            // handle pagination
            if (array_key_exists('page', $queryOptions)) {
                $start = (array_key_exists('start', $queryOptions['page']) && is_numeric($queryOptions['page']['start'])) ? $queryOptions['page']['start'] : 0;
                $size = (array_key_exists('size', $queryOptions['page']) && is_numeric($queryOptions['page']['size'])) ? $queryOptions['page']['size'] : null;
                $query->setMaxResults($size)->setFirstResult($start);
            }

            $results = $query->setParameters($filterParams)->getResult();
            // if there is a weighted filter select, the weighted score needs to be stripped out
            if (!empty($weightedFilterSelect)) {
                foreach ($results as &$result) {
                    $result = $result[0];
                }
            }

            return new CollectionResult($results, $count);
        } catch (QueryException $e) {
            dd($e);
            Log::error('Failed to retrieve a collection of type ' . $repository . ': ' . $e->getMessage());
            throw new ServiceRetrieveFailureException('An issue occurred while retrieving the data.', 0, $e);
        } catch (\Exception $e) {
            dd($e);
            throw new ServiceRetrieveFailureException('An issue occurred while retrieving the data.', 0, $e);
        }
    }

    /**
     * Parses filters from given request inputs and returns parsed RepositoryFilter objects
     * Supports commas to separate multiple fields that should be grouped together as OR and dots to separate
     * table name.
     *
     * @param array $inputs The inputs to use to prepare the filters
     * @return array The parsed filters
     */
    protected function prepareFiltersFromInputs(array $inputs = []): array
    {
        $filters = [];
        if (array_key_exists('filters', $inputs) && sizeof($inputs['filters']) > 0) {
            foreach ($inputs['filters'] as $filter) {
                if (array_key_exists('field', $filter) && (array_key_exists('value', $filter) xor array_key_exists('values', $filter))) {
                    $filterValue = (array_key_exists('value', $filter)) ? $filter['value'] : $filter['values'];
                    $filterTable = null;

                    // if a weight is defined, but there is only one field, strip the weight since it is irrelevant
                    if (strpos($filter['field'], ',') === false && strpos($filter['field'], ':') !== false) {
                        $filter['field'] = substr($filter['field'], 0, strpos($filter['field'], ':'));
                    }
                    $filterFields = (strpos($filter['field'], ',') !== false) ?  explode(',', $filter['field']) : [$filter['field']];

                    $filterClauses = [];
                    foreach ($filterFields as $field) {
                        if (strpos($field, ':') !== false) {
                            list($field, $filterWeight) = explode(':', $field);
                        }
                        $filterWeight = (isset($filterWeight)) ? intval($filterWeight) : 10;

                        if (strpos($field, '.') !== false) {
                            list($filterTable, $field) = explode('.', $field);
                        }

                        $filterClauses[] = (array_key_exists('comparison', $filter)) ?
                            new RepositoryFilter($filterTable, $field, $filterValue, $filter['comparison'], $filterWeight, $filter['comparisonMode'] ?? null) :
                            new RepositoryFilter($filterTable, $field, $filterValue);
                    }
                    $filters[] = $filterClauses;
                }
            }
        }
        return $filters;
    }

    /**
     * Determines if a given entity existed at the given time - note: this will not determine if any version of the entity existed at the given time, JUST the given version
     *
     * @param ExpiresModel $entity The entity to check for existence at the given time
     * @param DateTime $time The time for which the existence of the entity should be confirmed
     * @return bool True if the entity existed at the time
     */
    protected function doesEntityExistAtTime(ExpiresModel $entity, DateTime $time): bool
    {
        return ($time >= $entity->getDateFrom() && ($time < $entity->getDateTo() || is_null($entity->getDateTo())));
    }

    /**
     * This will insert the given entity into the database
     * @param array $inputs The data provided for the request
     * @param IdentifiableModel|null $entity The entity from which to create
     * @param int $depth The maximum depth into the data structure to traverse for creation
     * @throws ServiceValidationFailureException If validation of the relation data fails
     * @throws ServiceCreateFailureException If insertion failed for some reason other than validation
     * @throws ServiceEntityNotFoundException If the passed entity model does not exist
     * @see https://fractal.thephpleague.com/transformers/
     * @return IdentifiableModel The newly created entity
     */
    protected function insert(array $inputs, ?IdentifiableModel $entity, int $depth = 3): IdentifiableModel
    {
        // ensure that the entity exists and the input is valid
        if (is_null($entity)) {
            throw new ServiceEntityNotFoundException('The provided entity model could not be found.');
        }
        $this->validateRequest($inputs);

        try {
            // map updated data to a new instance of the entity and add it to the queue for persistence
            $preparedEntity = $this->mapRequestToEntity($inputs, $entity, array_keys($this->rules));
            $this->entityManager->persist($preparedEntity);

            // process relations
            $relationships = array_intersect_key($this->getRelationships(), $inputs);
            foreach ($relationships as $key => $relationship) {
                $this->processRelationships($preparedEntity, new $relationship(), $inputs[$key]);
            }

            // update owned associations
            $associations = array_intersect_key($this->getOwnedAssociations(), $inputs);

            foreach ($associations as $key => $association) {
                if (array_key_exists($key, $inputs) && !is_null($inputs[$key])) {
                    $this->upsertOwnedAssociation($preparedEntity, new $association(), $inputs[$key], $depth);
                }
            }

            // commit the transaction
            $this->entityManager->flush();
        } catch (ServiceValidationFailureException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw new ServiceCreateFailureException($e->getMessage(), $e->getCode(), $e->getPrevious());
        }

        return $preparedEntity;
    }


    /**
     * This will update the given entity into the database
     *
     * @param array $inputs The data provided for the request
     * @param IdentifiableModel|null $entity The entity to update
     * @param int $depth The maximum depth into the data structure to traverse for modifications
     * @throws ServiceEntityNotFoundException If the passed entity does not exist
     * @throws ServiceValidationFailureException If the entity is invalid
     * @throws ServiceUpdateFailureException If the update failed for some reason other than validation
     * @see https://fractal.thephpleague.com/transformers/
     * @return IdentifiableModel The updated entity
     */
    protected function modify(array $inputs, ?IdentifiableModel $entity, int $depth = 3): IdentifiableModel
    {
        if (is_null($entity)) {
            throw new ServiceEntityNotFoundException('The entity could not be found.');
        }

        // validate the properties of the entity overridden with new properties send in request
        $this->validateRequest($inputs);

        try {
            // if the data has changed in the primary entity
            $entityExpiredCopy = $this->version($entity);

            // next prepare the original entity with updates
            // the entity must be reset as if it were a new entity so that the current entity becomes the new version
            $entity = $this->prepareEntityForInsert(
                $this->mapRequestToEntity($inputs, $entity, array_keys($this->rules))
            );

            // process relations
            $relationships = array_intersect_key($this->getRelationships(), $inputs);
            foreach ($relationships as $key => $relationship) {
                if (!is_null($inputs[$key])) {
                    $this->processRelationships($entity, new $relationship(), $inputs[$key]);
                }
            }

            // update owned associations
            $associations = array_intersect_key($this->getOwnedAssociations(), $inputs);
            foreach ($associations as $key => $association) {
                if (array_key_exists($key, $inputs) && !is_null($inputs[$key])) {
                    $this->upsertOwnedAssociation($entity, new $association(), $inputs[$key], $depth);
                }
            }

            $this->entityManager->flush();
        } catch (ServiceValidationFailureException $e) {
            throw $e;
        } catch (\Throwable $e) {
            Log::error('Entity update failed for ' . get_class($entity) . '@' . $entity->getId() . ' with the following message:' . $e->getMessage() . '. Rollback will be attempted.');
            // attempt to rollback the expired version of the entity which was created
            try {
                if (isset($entityExpiredCopy)) {
                    $this->entityManager->remove($entityExpiredCopy);
                    $this->entityManager->flush();
                }
            } catch (\Exception $e) {
                Log::error('Failed to rollback expired version created during failed entity update.  Check database for orphans. Original entity: ' . get_class($entity) . '@' . $entity->getId() . ' with inputs::' . print_r($inputs, true));
            }
            dd($e);
            throw new ServiceUpdateFailureException('The new version of the entity could not be created.', $e->getCode(), $e->getPrevious());
        }

        return $entity;
    }

    /**
     * This will expire the given entity
     * @param ExpiresModel|null $entity The entity to expire
     * @throws ServiceExpireFailureException If the expire failed for some reason other than validation
     * @throws ServiceEntityNotFoundException If the passed entity does not exist
     * @return void
     */
    protected function expire(?ExpiresModel $entity): void
    {
        if (is_null($entity)) {
            throw new ServiceEntityNotFoundException('The entity could not be found.');
        }
        try {
            $this->prepareEntityForDelete($entity);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            throw new ServiceExpireFailureException($e->getMessage(), $e->getCode(), $e->getPrevious());
        }
    }

    /**
     * This will store a version of the given entity as it currently exists and expire it
     * @param IdentifiableModel $entity The entity to version
     * @return IdentifiableModel The saved version reference
     */
    protected function version(IdentifiableModel $entity): IdentifiableModel
    {
        $versionedEntity = clone $entity;
        $versionedEntity->setId(null);
        $this->prepareEntityForDelete($versionedEntity);
        $this->entityManager->persist($versionedEntity);
        $this->entityManager->flush($versionedEntity);

        if (method_exists($entity, 'setPreviousId')) {
            $entity->setPreviousId($versionedEntity->getId());
        }
        return $versionedEntity;
    }

    /**
     * Transforms the given entity using the given transformer
     * @param IdentifiableModel|CollectionResult $entity The entity to transform
     * @param TransformerAbstract $transformer The transformer for the repository resource
     * @param array $includes Includes to parse from the transformer
     * @return array
     */
    protected function transform($entity, TransformerAbstract $transformer, array $includes = []): array
    {
        $this->transformerManager->parseIncludes($includes);
        if ($entity instanceof CollectionResult) {
            return [
                'data' => $this->transformerManager->createData(new Collection($entity->getData(), $transformer))->toArray(),
                'count' => $entity->getCount()
            ];
        }
        return $this->transformerManager->createData(new Item($entity, $transformer))->toArray();
    }

    /**
     * Attempts to upload any provided files and then merge them into the existing files list with retrieved upload data
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param array $files The newly uploaded files provided for the request
     * @param string $path The path where the file should save
     * @return array The formatted file list
     */
    protected function uploadAndFormatFileList(array $files, string $path): array
    {
        $returnFiles = [];
        foreach ($files as $i => $file) {
            $returnFiles[$i] = $file;
            unset($returnFiles[$i]['file']);
            if (array_key_exists('file', $file) && $file['file'] instanceof UploadedFile) {
                $filename = time() . '_' . $file['file']->getClientOriginalName();
                /** @phpstan-ignore-next-line */
                Storage::disk('s3')->putFileAs($path, $file['file'], $filename);
                $returnFiles[$i]['path'] = $filename;
                $returnFiles[$i]['mimetype'] = $file['file']->getMimeType();
                $returnFiles[$i]['size'] = $file['file']->getSize();
            }
        }
        return $returnFiles;
    }

    /**
     * Update an existing owned association or create it if it doesn't exist
     * @param ExpiresModel $owner The owning entity of the association
     * @param BusinessModelService $service The service for the owning entity
     * @param array $inputs Input data for the association
     * @param int $depth The maximum depth into the data structure to traverse when updating
     * @throws ServiceValidationFailureException If validation of the relation data fails
     * @throws ServiceRetrieveFailureException If the data cannot be retrieved
     * @throws ServiceCreateFailureException If there is no method on the owning model to add the relation
     * @throws ServiceExpireFailureException If relation removal fails
     * @return void
     */
    private function upsertOwnedAssociation(ExpiresModel $owner, BusinessModelService $service, array $inputs, int $depth = 1)
    {
        // get the service for the relation and some other general info about the association service
        $model = $service->getModel();
        $addMethod = $this->getAddMethod($owner, $service);
        $inputs = (method_exists($owner, 'add' . $service->getModelRelationName())) ? $inputs : [$inputs];

        // remove existing relationships that no longer exist
        $currentRelations = $this->getEntityRelationArray($owner, $service);
        $inputRelationIds = array_column($inputs, 'id');
        foreach ($currentRelations as $relation) {
            if (method_exists($relation, 'getId') && !in_array($relation->getId(), $inputRelationIds)) {
                $this->removeRelation($owner, $service, $relation);
            }
        }

        // if service provides a change confirmation method, and no change has occurred, skip upsert
        $inputs = array_filter($inputs, function ($answer) use ($owner, $service) {
            return $service->isChanged($owner, $answer);
        });

        // persist a new or updated instance of the relation for each data collection
        foreach ($inputs as $relationData) {
            if (!is_array($relationData)) {
                Log::warning('Owned association upsert attempted but provided relation data was not an array. Owning model: ' . print_r(get_class($owner), true) . ', Created Relation: ' . print_r($model, true));
                continue;
            }

            // validate the data provided for this relation before attempting to update
            $this->validateRequest($relationData, $service->getRules());

            // create a prepared entity for the relation which can be added
            $preparedAssociation = new $model();

            // if the relationship is an association with an existing one - get that instance of the relationship and use it instead
            if (array_key_exists('id', $relationData) && !is_null($relationData['id'])) {
                try {
                    $preparedAssociation = $this->entityManager->find($model, $relationData['id']);
                    $this->version($preparedAssociation);
                    $this->prepareEntityForInsert($preparedAssociation);
                } catch (\Throwable $e) {
                    dd($e);
                    Log::warning('Insert relationship passed with ID that failed lookup so was created as new entity instead.  Owning model: ' . print_r(get_class($owner), true) . ', Created Relation: ' . print_r($model, true));
                    $preparedAssociation = new $model();
                }
            }

            // process relations
            $relationships = array_intersect_key($service->getRelationships(), $relationData);
            foreach ($relationships as $key => $relationship) {
                $this->processRelationships($preparedAssociation, new $relationship(), $relationData[$key]);
            }

            // map the data to the new association and persist to the owning entity
            try {
                $preparedAssociation = $this->mapRequestToEntity($relationData, $preparedAssociation, array_keys($service->getRules()));
                $owner->$addMethod($preparedAssociation);
                $this->entityManager->persist($preparedAssociation);
            } catch (\Throwable $e) {
                dd($e);
                throw new ServiceCreateFailureException('Model ' . class_basename($owner) . ' attempted relationship to ' . $service->getModelRelationName() . ' which could not be found or added during association upsert operation.');
            }

            // if the next level of associations should also be persisted, recurse
            if ($depth > 0) {
                $subRelations = array_intersect_key($service->getOwnedAssociations(), $relationData);
                foreach ($subRelations as $subKey => $subRelation) {
                    if (array_key_exists($subKey, $relationData) && !is_null($relationData[$subKey])) {
                        $this->upsertOwnedAssociation($preparedAssociation, new $subRelation(), $relationData[$subKey], $depth - 1);
                    }
                }
            }
        }
    }

    /**
     * Process relationships on the given owning entity
     * @param IdentifiableModel $owner The owning entity of the association
     * @param BusinessModelService $service The service for the owning entity
     * @param array|null $inputs Input data for the association
     * @throws ServiceRetrieveFailureException If the data cannot be retrieved
     * @throws ServiceCreateFailureException If there is no method on the owning model to add the relation
     * @throws ServiceExpireFailureException If relation removal fails
     * @return void
     */
    private function processRelationships(IdentifiableModel $owner, BusinessModelService $service, ?array $inputs)
    {
        // if the relation inputs are null, skip processing it - there's nothing to do here
        if (!is_array($inputs)) {
            return;
        }

        // get the service for the relation and some other general info about the association service
        $model = $service->getModel();
        $addMethod = $this->getAddMethod($owner, $service);
        $inputs = (method_exists($owner, 'add' . $service->getModelRelationName())) ? $inputs : [$inputs];

        // get the instance of each relation and add it to the model
        foreach ($inputs as $relationData) {
            // if the relation doesn't have an ID, it cannot be retrieved and therefore cannot be related - relations' data cannot be modified by the owner
            if (!is_array($relationData) || !array_key_exists('id', $relationData) || is_null($relationData['id'])) {
                Log::warning('Relationship attempted but provided relation data was not an array or didn\'t contain an ID. Owning model: ' . print_r(get_class($owner), true) . ', Created Relation: ' . print_r($model, true));
                continue;
            }

            try {
                $preparedAssociation = $this->entityManager->find($model, $relationData['id']);
                $owner->$addMethod($preparedAssociation);
            } catch (\Throwable $e) {
                Log::warning('Model ' . class_basename($owner) . ' attempted relationship to ' . $service->getModelRelationName() . ' with an ID of ' . $relationData['id'] . ' could not be found or added.');
                continue;
            }
        }

        // remove existing relationships that no longer exist
        $currentRelations = $this->getEntityRelationArray($owner, $service);
        $inputRelationIds = array_column($inputs, 'id');
        foreach ($currentRelations as $relation) {
            if (method_exists($relation, 'getId') && !in_array($relation->getId(), $inputRelationIds)) {
                $this->removeRelation($owner, $service, $relation);
            }
        }
    }

    /**
     * This will remove the given instance of the given relation from the owning entity
     * @param ExpiresModel $owner The owning entity of the relationship
     * @param BusinessModelService $relation The relationship service
     * @param IdentifiableModel $instance The instance of the relationship model
     * @throws ServiceExpireFailureException If there is no available method to perform the removal
     * @return void
     */
    private function removeRelation(ExpiresModel $owner, BusinessModelService $relation, IdentifiableModel $instance): void
    {
        $removeMethod = 'remove' . $relation->getModelRelationName();
        $setMethod = 'set' . $relation->getModelRelationName();

        if (!method_exists($owner, $removeMethod) && !method_exists($owner, $setMethod)) {
            throw new ServiceExpireFailureException('Model ' . class_basename($owner) . ' does not provide method to remove or set ' . $relation->getModelRelationName() . ' relation.');
        }

        // try to either use the model-provided remove method or set method with null, in that preference order
        if (method_exists($owner, $removeMethod)) {
            $owner->$removeMethod($instance);
        } elseif (method_exists($owner, $setMethod)) {
            $owner->$setMethod(null);
        }
    }

    /**
     * This will return entity relationship data for n->many and n->one relationships in an array format
     * @param ExpiresModel $owner The owning entity
     * @param BusinessModelService $relation The relationship service
     * @throws ServiceRetrieveFailureException If the relationship data cannot be retrieved
     * @return array
     */
    private function getEntityRelationArray(ExpiresModel $owner, BusinessModelService $relation): array
    {
        // determine and validate the getter
        $getMethod = (method_exists($owner, 'get' . $relation->getModelRelationPluralName())) ? 'get' . $relation->getModelRelationPluralName() : 'get' . $relation->getModelRelationName();
        if (!method_exists($owner, $getMethod)) {
            throw new ServiceRetrieveFailureException('Model ' . class_basename($owner) . ' does not provide method to get ' . $relation->getModelRelationName() . ' relation.');
        }

        // retrieve and convert existing entity relations
        $currentRelations = $owner->$getMethod();
        if ($currentRelations instanceof DoctrineCollection) {
            return $currentRelations->toArray();
        }
        return [$currentRelations];
    }

    /**
     * This will prepare a given entity for deletion
     * @param ExpiresModel $entity The entity or relation to prepare
     * @return ExpiresModel The prepared entity or relation
     */
    private function prepareEntityForDelete(ExpiresModel $entity): ExpiresModel
    {
        if (method_exists($entity, 'setDateTo')) {
            $entity->setDateTo(new DateTime());
        }
        return $entity;
    }

    /**
     * This will prepare a given entity for insertion
     * @param IdentifiableModel $entity The entity to prepare
     * @return IdentifiableModel The prepared entity
     */
    private function prepareEntityForInsert(IdentifiableModel $entity): IdentifiableModel
    {
        if (method_exists($entity, 'setDateFrom')) {
            $entity->setDateFrom(null);
        }
        return $entity;
    }

    /**
     * Finds the ID of the version of a given model at a given time with the ID of any version of the model
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     * @param string $model The model for which the version at the given time should be returned
     * @param int $currentId The id of any version of the model
     * @param DateTime|null $time The time at which the version of the model should be returned
     * @return int|null The version of the id at the given time, null if there is no version at the given time
     */
    private function findModelVersionId(string $model, int $currentId, ?DateTime $time = null): ?int
    {
        // make sure model and id are valid - TODO: perform better check here
        if (!class_exists($model) || !is_int($currentId)) {
            return null;
        }

        try {
            $table = $this->entityManager->getClassMetadata($model)->getTableName();
            // retrieve the details about the given model first
            $query = $this->entityManager->getConnection()->prepare('SELECT id,date_from,date_to,previous_id FROM ' . $table . ' WHERE id=:id');
            $query->bindValue('id', $currentId);
            $query->execute();
            $original = $query->fetch();
            $startDate = date_create_from_format('Y-m-d H:i:s', $original['date_from']) ?: null;
            $endDate = date_create_from_format('Y-m-d H:i:s', $original['date_to']) ?: null;

            // if no result could be retrieved for the given id OR this is the original version and it was created after the given version date, return a null result
            if ($original === false || is_null($startDate) || (is_null($original['previous_id']) && !is_null($time) && $startDate > $time)) {
                return null;
            }
            // if the version with the given id matches the given time OR no time is defined and this is the original version, then return that
            if (($startDate <= $time && ($endDate > $time || is_null($endDate))) || (is_null($time) && is_null($original['previous_id']))) {
                return $original['id'];
            }

            // if current version starts AFTER the given time, traverse backwards to search for correct version
            if ($startDate > $time || is_null($time)) {
                $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                    SELECT id, date_from, date_to, previous_id FROM ' . $table . ' WHERE id=:id
                    UNION ALL
                    SELECT t.id, t.date_from, t.date_to, t.previous_id
                    FROM cte c
                    inner join ' . $table . ' t on t.id = c.previous_id
                ) select * from cte WHERE date_from <= :time AND (date_to > :time OR date_to IS NULL)');
            }
            // if current version ends BEFORE the given time, traverse forwards to search for correct version
            if ($endDate <= $time && !is_null($endDate)) {
                $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                    SELECT id, date_from, date_to, previous_id FROM ' . $table . ' WHERE id=:id
                    UNION ALL
                    SELECT t.id, t.date_from, t.date_to, t.previous_id
                    FROM cte c
                    inner join ' . $table . ' t on t.previous_id = c.id
                ) select * from cte WHERE date_from <= :time AND (date_to > :time OR date_to IS NULL)');
            }
            $query->bindValue('id', $currentId);
            $query->bindValue('time', $time, 'datetime');
            $query->execute();
            $version = $query->fetch();
            return ($version === false) ? null : $version['id'];
        } catch (DBALException $e) {
            return null;
        }
    }

    /**
     * Finds the ID of the original version of a given model
     * @param string $model The model for which the version at the given time should be returned
     * @param int $currentId The id of any version of the model
     * @return int|null The original version id, null if there is no version at the given time
     */
    private function findModelOriginalId(string $model, int $currentId): ?int
    {
        try {
            $table = $this->entityManager->getClassMetadata($model)->getTableName();
            $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                                    SELECT id, date_from, date_to, previous_id FROM ' . $table . ' WHERE id=:id
                                    UNION ALL
                                    SELECT t.id, t.date_from, t.date_to, t.previous_id
                                    FROM cte c
                                    inner join ' . $table . ' t on t.id = c.previous_id
                                ) select * from cte WHERE previous_id IS NULL');
            $query->bindValue('id', $currentId);
            $query->execute();
            $result = $query->fetch();

            // if the data couldn't be retrieved
            return ($result === false) ? null : $result['id'];
        } catch (DBALException $e) {
            return null;
        }
    }

    /**
     * Finds the ID of the most recent version of a given model
     * @param string $model The model for which the version at the given time should be returned
     * @param int $currentId The id of any version of the model
     * @return int|null The newest version id, null if there is no version at the given time
     */
    private function findModelNewestId(string $model, int $currentId): ?int
    {
        try {
            $table = $this->entityManager->getClassMetadata($model)->getTableName();
            $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                            SELECT id, date_from, date_to, previous_id FROM ' . $table . ' WHERE id=:id
                            UNION ALL
                            SELECT t.id, t.date_from, t.date_to, t.previous_id
                            FROM cte c
                            inner join ' . $table . ' t on t.previous_id = c.id
                        ) select id from cte ORDER BY CASE WHEN date_to IS NULL THEN 0 ELSE 1 END, date_to DESC');
            $query->bindValue('id', $currentId);
            $query->execute();
            $result = $query->fetch();

            // if the data couldn't be retrieved
            return ($result === false) ? null : $result['id'];
        } catch (DBALException $e) {
            return null;
        }
    }

    /**
     * Retrieve the appropriate method for adding a relationship to the given service with the provided entity
     * @param ExpiresModel $owner The entity which owns the relationship
     * @param BusinessModelService $service The related service
     * @throws ServiceCreateFailureException If no available add method exists on the given service
     * @return string The name of the corresponding method to add an instance of the service
     */
    private function getAddMethod(ExpiresModel $owner, BusinessModelService $service): string
    {
        // since the add method should support n->one and n->n relations, the model could have an "add" method or "set" method
        // "add" method is preferred - if it has neither
        $addMethod = (method_exists($owner, 'add' . $service->getModelRelationName())) ? 'add' . $service->getModelRelationName() : 'set' . $service->getModelRelationName();

        if (!method_exists($owner, $addMethod)) {
            throw new ServiceCreateFailureException('Model ' . class_basename($owner) . ' does not provide method to add or set ' . $service->getModelRelationName() . ' relation.');
        }
        return $addMethod;
    }

    /**
     * This will map request variables to a given entity to prepare for storage
     * @param array $inputs The data provided for the request
     * @param IdentifiableModel $entity The entity to which to map the request variables
     * @param array $fields The fields to map
     * @return IdentifiableModel The given entity with the request variables mapped
     */
    private function mapRequestToEntity(array $inputs, IdentifiableModel $entity, array $fields = []): IdentifiableModel
    {
        // handle only direct properties that have a setter in the model
        foreach ($fields as $field) {
            $ruleMethod = 'set' . ucfirst($field);
            if (method_exists($entity, $ruleMethod) && array_key_exists($field, $inputs)) {
                $entity->{$ruleMethod}($inputs[$field]);
            }
        }
        return $entity;
    }

    /**
     * Parses a single criteria comparison based on given value and comparison type
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @param RepositoryFilter[] $criteria The criteria to parse, note that each criteria can have multiple fields
     *                                     so this is an array of filterable criteria.
     * @param string $tableIdentifier The identifier being used for the table to reference
     * @return array An array of the DQL and the additional parameter mappings to add to query
     */
    private function parseCriteria(array $criteria, string $tableIdentifier = 'r'): array
    {
        // define the fields first, since there can be multiple fields defined by which the criteria is compared
        $fields = [];
        $fieldWeights = [];
        foreach ($criteria as $criterion) {
            $fields[] = $criterion->getField();
            $fieldWeights[] = $criterion->getFieldWeight();
        }

        // there is no support for different values or comparisons in the same criteria.
        // Since field names are already parsed out, there is no longer a need for any of the other criteria objects.
        // This will need to be made more versatile in order to support having multiple criteria with an OR with differing comparisons and
        // values - but that will require a more versatile overall approach as well including with input patterns.
        // For now, since the support doesn't exist, just replace the overall list with the first entry
        $criteria = $criteria[0];
        $tableIdentifier = $criteria->getTable() ?? $tableIdentifier;

        // there can be multiple parameters if the compare string is tokenized
        $paramName = $criteria->getTable() . '_' . str_replace(['.',','], '_', $criteria->getField());
        $params = [$paramName => $criteria->getValue()];

        // if using collection comparison (in/!in) and given an array, convert to csv string
        // $criteriaValue = (in_array($criteria->getComparison(), ['in', '!in']) && is_array($criteria->getValue())) ? implode(',', $criteria->getValue()) : $criteria->getValue();

        $queries = [];
        switch ($criteria->getComparison()) {
            case '=':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' = :' . $paramName;
                }, $fields));
                break;

            case '!=':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' <> :' . $paramName;
                }, $fields));
                break;

            case '>':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' > :' . $paramName;
                }, $fields));
                break;

            case '>=':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' >= :' . $paramName;
                }, $fields));
                break;

            case '<':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' < :' . $paramName;
                }, $fields));
                break;

            case '<=':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' <= :' . $paramName;
                }, $fields));
                break;

            case 'in':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' IN (:' . $paramName . ')';
                }, $fields));
                break;

            case '!in':
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName) {
                    return $tableIdentifier . '.' . $field . ' NOT IN (:' . $paramName . ')';
                }, $fields));
                break;

            case 'contains':
                $criteriaValues = ($criteria->getComparisonMode() === 'tokenized') ? $this->getFilterTokens($criteria->getValue()) : [$criteria->getValue()];
                $params = [];
                foreach ($criteriaValues as $i => $value) {
                    $paramNameIteration = $paramName . '_' . $i;
                    $params[$paramNameIteration] = '%' . $value . '%';
                    $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramNameIteration) {
                        return $tableIdentifier . '.' . $field . ' LIKE :' . $paramNameIteration;
                    }, $fields));
                }
                break;

            case '!contains':
                $criteriaValues = ($criteria->getComparisonMode() === 'tokenized') ? $this->getFilterTokens($criteria->getValue()) : [$criteria->getValue()];
                $params = [];
                foreach ($criteriaValues as $i => $value) {
                    $paramNameIteration = $paramName . '_' . $i;
                    $params[$paramNameIteration] = '%' . $value . '%';
                    $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramNameIteration) {
                        return $tableIdentifier . '.' . $field . ' NOT LIKE :' . $paramNameIteration;
                    }, $fields));
                }
                break;

            case 'matches':
                if (!empty($criteria->getValue())) {
                    $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $paramName, $criteria) {
                        switch ($criteria->getComparisonMode()) {
                            case 'natural':
                                return 'MATCH(' . $tableIdentifier . '.' . $field . ') AGAINST (:' . $paramName . ') > 0';
                            case 'boolean':
                                return 'MATCH(' . $tableIdentifier . '.' . $field . ') AGAINST (:' . $paramName . ' IN BOOLEAN MODE) > 0';
                            case 'expanded':
                                return 'MATCH(' . $tableIdentifier . '.' . $field . ') AGAINST (:' . $paramName . ' WITH QUERY EXPANSION) > 0';
                        }
                    }, $fields));
                }
                break;

            default:
                $queries = array_merge($queries, array_map(function ($field) use ($tableIdentifier, $criteria, $paramName) {
                    return (is_array($criteria->getValue())) ? $tableIdentifier . '.' . $field . ' IN (:' . $paramName . ')' : $tableIdentifier . '.' . $field . ' = :' . $paramName;
                }, $fields));
        }

        // combine query criteria into queries and define parameter values
        $queryComparison = (in_array($criteria->getComparison(), ['!=', '!in', '!contains'])) ? 'AND' : 'OR';
        $query = (sizeof($queries) > 0 ) ? '(' . implode(' ' . $queryComparison . ' ', $queries) . ')' : '';

        // derive weighted order by clause to use if match is set
        $weightedOrders = [];
        if (sizeof($queries) > 0 && in_array($criteria->getComparison(), ['match'])) {
            foreach ($queries as $i => $whereString) {
                $weightedOrders[] = str_replace(' > 0', ' * ' . $fieldWeights[$i], $whereString);
            }
        }
        $weightedOrderClause = (!empty($weightedOrders)) ? implode(' + ', $weightedOrders) : null;

        return [
            'query' => $query,
            'params' => $params,
            'weightedOrderClause' => $weightedOrderClause
        ];
    }

    /**
     * Tokenizes a given filter string
     * @param string $filter The filter string to tokenize
     * @return string[] The tokens returned from the given filter string
     */
    private function getFilterTokens(string $filter): array
    {
        $tokens = [];
        $quotedStringPattern = "/(?:(?:\"(?:\\\\\"|[^\"])+\")|(?:'(?:\\\'|[^'])+'))/is";

        // pull out quoted strings to interpret literally
        $found = preg_match_all($quotedStringPattern, $filter, $quotedStringTokens);
        if ($found > 0) {
            // map response list to only values and strip out quotes from ends
            $quotedStringTokens = $quotedStringTokens[0];
            array_walk($quotedStringTokens, function (&$value) {
                $value = substr($value, 1, -1);
            });

            $tokens = array_merge($tokens, $quotedStringTokens);
            $filter = preg_replace($quotedStringPattern, '', $filter);
        }

        // all special patterns are tokenized, so finally split by whitespace to get remaining tokens
        $filter = trim($filter);
        return (!empty($filter)) ? array_merge($tokens, preg_split('/\s+/', $filter)) : $tokens;
    }

    /**
     * This will validate a given identifier for an entity
     * @param RepositoryIdentifier $identifier The identifier to validate
     * @throws ServiceEntityNotFoundException If the identifier is invalid
     * @return void
     */
    private function validateIdentifier(RepositoryIdentifier $identifier): void
    {
        if (!$identifier instanceof RepositoryIdentifier) {
            throw new ServiceEntityNotFoundException('No identifier was provided for the entity.');
        }

        if (!$identifier->validate()) {
            throw new ServiceEntityNotFoundException('The identifier provided for the entity was of invalid type.');
        }
    }

    /**
     * This will validate the given request variables against the validation rules given
     * @param array $inputs The data provided for the request
     * @param array|null $rules The rules to validate against
     * @param array|null $messages The messages to display for validation errors
     * @throws ServiceValidationFailureException If validation of the data fails
     * @return void
     */
    private function validateRequest(array $inputs, array $rules = null, array $messages = null): void
    {
        $rules = (!is_array($rules)) ? $this->rules : $rules;
        $messages = (!is_array($messages)) ? $this->messages : $messages;

        $validator = app('validator')->make($inputs, $rules, $messages);

        if ($validator->fails()) {
            throw new ServiceValidationFailureException('The entity could not be created.', $validator->errors());
        }
    }
}
