<?php

namespace App\Transformers;

use App\Models\Relationships\BookGenre;

class BookGenreTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookGenre $bookGenre
     * @return array The transformed data
     */
    public function transform(BookGenre $bookGenre)
    {
        $genre = $this->getCurrentScope()->getManager()->createData($this->item($bookGenre->getGenre(), new GenreTransformer()))->toArray();
        return $this->parseTransformer($bookGenre, array_merge(
            $genre,
            [
                'relatedFrom' => $this->formatDate($bookGenre->getDateFrom()),
                'relatedTo' => $this->formatDate($bookGenre->getDateTo())
            ]
        ));
    }
}
