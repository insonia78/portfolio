<?php

namespace App\Helpers;

use App\Contracts\IdentifiableModel;

class CollectionResult
{
    /**
     * @var IdentifiableModel[] The retrieved data
     */
    private $data = [];

    /**
     * @var int The number of data results retrieved
     */
    private $count = 0;

    /**
     * RepositoryConstraint constructor.
     * @param IdentifiableModel[] $data The retrieved data
     * @param int|null $count The number of data results retrieved
     */
    public function __construct(array $data, ?int $count = null)
    {
        $this->data = $data;
        $this->count = $count ?? sizeof($data);
    }

    /**
     * @return IdentifiableModel[]
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * @param IdentifiableModel[] $data
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }

    /**
     * @return int
     */
    public function getCount(): int
    {
        return $this->count;
    }

    /**
     * @param int $count
     */
    public function setCount(int $count): void
    {
        $this->count = $count;
    }
}
