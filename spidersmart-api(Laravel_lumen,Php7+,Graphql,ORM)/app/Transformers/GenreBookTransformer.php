<?php

namespace App\Transformers;

use App\Models\Relationships\BookGenre;

class GenreBookTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookGenre $bookGenre
     * @return array The transformed data
     */
    public function transform(BookGenre $bookGenre)
    {
        $book = $this->getCurrentScope()->getManager()->createData($this->item($bookGenre->getBook(), new BookTransformer()))->toArray();
        return $this->parseTransformer($bookGenre, array_merge(
            $book,
            [
                'relatedFrom' => $this->formatDate($bookGenre->getDateFrom()),
                'relatedTo' => $this->formatDate($bookGenre->getDateTo())
            ]
        ));
    }
}
