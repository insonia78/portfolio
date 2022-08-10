<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Genre;
use League\Fractal\Resource\Collection;

class GenreTransformer extends BaseTransformer
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
     * @param genre $genre The genre to transform
     * @return array The transformed data
     */
    public function transform(Genre $genre)
    {
        return $this->parseTransformer($genre, [
            'id' => $genre->getId(),
            'name' => $genre->getName(),
            'dateFrom' => $this->formatDate($genre->getDateFrom()),
            'dateTo' => $this->formatDate($genre->getDateTo()),
            'active' => $genre->isActive()
        ]);
    }

    /**
     * Defines what books will look like when included in the transformation
     *
     * @param genre $genre The genre for which to include books
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBooks(Genre $genre): Collection
    {
        $books = $genre->getBooks();
        return $this->collection($books, new GenreBookTransformer());
    }
}
