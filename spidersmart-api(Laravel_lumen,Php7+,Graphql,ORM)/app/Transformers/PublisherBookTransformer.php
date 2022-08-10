<?php

namespace App\Transformers;

use App\Models\Relationships\BookPublisher;

class PublisherBookTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookPublisher $bookPublisher
     * @return array The transformed data
     */
    public function transform(BookPublisher $bookPublisher)
    {
        $book = $this->getCurrentScope()->getManager()->createData($this->item($bookPublisher->getBook(), new BookTransformer()))->toArray();
        return $this->parseTransformer($bookPublisher, array_merge(
            $book,
            [
                'relatedFrom' => $this->formatDate($bookPublisher->getDateFrom()),
                'relatedTo' => $this->formatDate($bookPublisher->getDateTo())
            ]
        ));
    }
}
