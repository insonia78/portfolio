<?php

namespace App\Contracts;

/**
 * Interface VersionedModel
 * @package App\Contracts
 */
interface VersionedModel extends IdentifiableModel
{
    /**
     * Retrieve id of previous version of the entity
     * @return int|null Id of previous version, or null if this is the initial version
     */
    public function getPreviousId(): ?int;

    /**
     * Set id of previous version of the entity
     *
     * @param int $id The id of the previous version
     * @return void
     */
    public function setPreviousId(int $id);
}
