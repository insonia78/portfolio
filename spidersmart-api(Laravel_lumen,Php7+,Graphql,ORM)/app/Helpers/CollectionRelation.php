<?php

namespace App\Helpers;

class CollectionRelation
{
    /**
     * @var string The relation to join
     */
    private $relation = null;

    /**
     * @var string The identifier to use
     */
    private $identifier = null;

    /**
     * @var string The type of join to use
     */
    private $joinType = 'LEFT';

    /**
     * CollectionRelation constructor.
     * @param string $relation The relation to join
     * @param string|null $identifier The identifier to use when joining
     */
    public function __construct(string $relation, ?string $identifier = null, ?string $joinType = null)
    {
        $this->relation = $relation;
        $this->identifier = $identifier ?? '_' . substr($relation, 0, 1) . '_';
        $this->joinType = $joinType ?? $this->joinType;
    }

    /**
     * @return string
     */
    public function getRelation(): string
    {
        return $this->relation;
    }

    /**
     * @param string $relation
     */
    public function setRelation(string $relation): void
    {
        $this->relation = $relation;
    }

    /**
     * @return string|null
     */
    public function getIdentifier(): ?string
    {
        return $this->identifier;
    }

    /**
     * @param string|null $identifier
     */
    public function setIdentifier(?string $identifier): void
    {
        $this->identifier = $identifier;
    }

    /**
     * @return string|null
     */
    public function getJoinType(): ?string
    {
        return $this->joinType;
    }

    /**
     * @param string|null $joinType
     */
    public function setJoinType(?string $joinType): void
    {
        $this->joinType = $joinType;
    }
}
