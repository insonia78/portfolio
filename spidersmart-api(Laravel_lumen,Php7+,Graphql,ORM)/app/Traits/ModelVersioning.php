<?php

namespace App\Traits;

/**
 * Trait ModelVersioning
 * Adds versioning traits for models
 * @package App\Traits
 */
trait ModelVersioning
{
    /**
     * @ORM\Column(type="integer")
     */
    protected $previousId;

    /**
     * @return int
     */
    public function getPreviousId(): ?int
    {
        return $this->previousId;
    }

    /**
     * @param int $previousId
     */
    public function setPreviousId(int $previousId)
    {
        // @todo - add check here to throw exception if trying to make previous id = id
        $this->previousId = $previousId;
    }
}
