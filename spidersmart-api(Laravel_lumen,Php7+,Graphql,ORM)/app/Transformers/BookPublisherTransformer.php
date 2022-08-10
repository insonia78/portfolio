<?php

namespace App\Transformers;

use App\Models\Relationships\BookPublisher;

class BookPublisherTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param BookPublisher $bookPublisher
     * @return array The transformed data
     */
    public function transform(BookPublisher $bookPublisher)
    {
        $publisher = $this->getCurrentScope()->getManager()->createData($this->item($bookPublisher->getPublisher(), new PublisherTransformer()))->toArray();
        return $this->parseTransformer($bookPublisher, array_merge(
            $publisher,
            [
                'relatedFrom' => $this->formatDate($bookPublisher->getDateFrom()),
                'relatedTo' => $this->formatDate($bookPublisher->getDateTo())
            ]
        ));
    }
}
