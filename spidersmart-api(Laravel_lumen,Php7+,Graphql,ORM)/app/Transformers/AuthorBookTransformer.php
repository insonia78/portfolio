<?php

namespace App\Transformers;

use App\Models\Relationships\BookAuthor;
use League\Fractal\Resource\Item;

class AuthorBookTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookAuthor $bookAuthor
     * @return array The transformed data
     */
    public function transform(BookAuthor $bookAuthor)
    {
        $book = $this->getCurrentScope()->getManager()->createData($this->item($bookAuthor->getBook(), new BookTransformer()))->toArray();
        return $this->parseTransformer($bookAuthor, array_merge(
            $book,
            [
                'relatedFrom' => $this->formatDate($bookAuthor->getDateFrom()),
                'relatedTo' => $this->formatDate($bookAuthor->getDateTo())
            ]
        ));
    }
}
