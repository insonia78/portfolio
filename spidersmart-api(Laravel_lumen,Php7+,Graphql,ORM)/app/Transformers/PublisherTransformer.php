<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Publisher;
use League\Fractal\Resource\Collection;

class PublisherTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'books'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param publisher $publisher The publisher to transform
     * @return array The transformed data
     */
    public function transform(Publisher $publisher)
    {
        return $this->parseTransformer($publisher, [
            'id' => $publisher->getId(),
            'name' => $publisher->getName(),
            'dateFrom' => $this->formatDate($publisher->getDateFrom()),
            'dateTo' => $this->formatDate($publisher->getDateTo()),
            'active' => $publisher->isActive()
        ]);
    }

    /**
     * Defines what books will look like when included in the transformation
     *
     * @param publisher $publisher The publisher for which to include books
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBooks(Publisher $publisher): Collection
    {
        $books = $publisher->getBooks();
        return $this->collection($books, new PublisherBookTransformer());
    }
}
