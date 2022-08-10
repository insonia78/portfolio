<?php

namespace App\Transformers;

use App\Models\Relationships\BookAuthor;

class BookAuthorTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookAuthor $bookAuthor
     * @return array The transformed data
     */
    public function transform(BookAuthor $bookAuthor)
    {
        $author = $this->getCurrentScope()->getManager()->createData($this->item($bookAuthor->getAuthor(), new AuthorTransformer()))->toArray();
        return $this->parseTransformer($bookAuthor, array_merge(
            $author,
            [
                'relatedFrom' => $this->formatDate($bookAuthor->getDateFrom()),
                'relatedTo' => $this->formatDate($bookAuthor->getDateTo())
            ]
        ));
    }
}
