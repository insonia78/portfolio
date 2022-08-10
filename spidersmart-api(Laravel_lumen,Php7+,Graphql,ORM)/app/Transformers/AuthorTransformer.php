<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Author;
use League\Fractal\Resource\Collection;

class AuthorTransformer extends BaseTransformer
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
     * @param Author $author The author to transform
     * @return array The transformed data
     */
    public function transform(Author $author)
    {
        return $this->parseTransformer($author, [
            'id' => $author->getId(),
            'name' => $author->getName(),
            'dateFrom' => $this->formatDate($author->getDateFrom()),
            'dateTo' => $this->formatDate($author->getDateTo()),
            'active' => $author->isActive()
        ]);
    }

    /**
     * Defines what books will look like when included in the transformation
     *
     * @param Author $author The author for which to include books
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBooks(Author $author): Collection
    {
        $books = $author->getBooks();
        return $this->collection($books, new AuthorBookTransformer());
    }
}
