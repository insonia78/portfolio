<?php

namespace App\Contracts;

/**
 * Interface BusinessModelService
 * @package App\Contracts
 */
interface BusinessModelService
{
    /**
     * Retrieve validation rules related to input
     * @return array The rule data
     */
    public function getRules(): array;

    /**
     * Retrieve a map of messages related to validation rules
     * @return array The returned map of messages
     */
    public function getMessages(): array;

    /**
     * Return the name of the data model which is referenced by the service
     * @return string The name of the data model
     */
    public function getModel(): string;

    /**
     * Returns the name of the model as it is referred by relations rather than the formal model name
     * @return string The name of the model for relations
     */
    public function getModelRelationName(): string;

    /**
     * Returns the pluralized name of the model as it is referred by relations rather than the formal model name
     * @return string The pluralized name of the model for relations
     */
    public function getModelRelationPluralName(): string;

    /**
     * Returns independent entities which are related, but cannot be modified by the owning service
     * @return array The map of related entities
     */
    public function getRelationships(): array;

    /**
     * Returns entities which do not exist independent of the owning service - The owning service is
     * responsible for modifying and controlling them
     * @return array The map of owned entities
     */
    public function getOwnedAssociations(): array;

    /**
     * Returns whether the original model has changed based on the given input
     * This can be overridden by child services to provide a comparison check and return false on entities which
     * haven't changed to prevent constant versioning of unchanged relationships when a parent is changed
     * @param IdentifiableModel $original The original model
     * @param array $inputs The updated data to compare to the original model
     * @return bool True if it should be considered changed and versioned accordingly
     */
    public function isChanged(IdentifiableModel $original, array $inputs): bool;
}
