<?php

namespace App\Contracts;

/**
 * Interface CrudService
 * @package App\Contracts
 */
interface CrudService
{
    /**
     * Retrieve data of an entity based on provided inputs
     * @param array $inputs The data provided for the request
     * @return array The returned data
     */
    public function get(array $inputs): array;

    /**
     * Retrieve a map of data for all entities of the current type
     * @return array The returned map of entity data
     */
    public function getAll(): array;

    /**
     * Create and persist a new entity of the current type with the given data
     * @param array $inputs The data to persist for the entity
     * @return array The newly created entity data
     */
    public function create(array $inputs): array;

    /**
     * Modify and persist the given entity with the given data
     * @param array $inputs The data to persist for the entity
     * @return array The updated entity data
     */
    public function update(array $inputs): array;

    /**
     * Delete (expire) the given entity
     * @param array $inputs The data to reference the entity
     * @return void
     */
    public function delete(array $inputs);
}
