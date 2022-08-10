<?php

namespace App\Contracts;

/**
 * Interface IdentifiableModel
 * @package App\Contracts
 */
interface IdentifiableModel extends ExpiresModel
{
    /**
     * Retrieve unique identifier
     * @return int The id
     */
    public function getId(): ?int;

    /**
     * Set unique identifier
     *
     * @param int $id The identifier
     * @return void
     */
    public function setId(int $id);
}
