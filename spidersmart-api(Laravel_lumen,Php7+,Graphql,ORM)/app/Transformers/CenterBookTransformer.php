<?php

namespace App\Transformers;

use App\Models\Entities\Relation\CenterBook;
use League\Fractal\Resource\Item;

class CenterBookTransformer extends BaseTransformer
{
    /**
     * Transform the given entity into a data array
     * @param CenterBook $centerBook
     * @return array The transformed data
     */
    public function transform(CenterBook $centerBook): array
    {
        $book = $this->getCurrentScope()->getManager()->createData($this->item($centerBook->getBook(), new BookTransformer()))->toArray();
        $assignment = (!is_null($centerBook->getBook()->getAssignment())) ? $this->getCurrentScope()->getManager()->createData($this->item($centerBook->getBook()->getAssignment(), new AssignmentTransformer()))->toArray() : null;
        $level = (!is_null($assignment)) ? $this->getCurrentScope()->getManager()->createData($this->item($centerBook->getBook()->getAssignment()->getLevel(), new LevelTransformer()))->toArray() : null;
        return $this->parseTransformer($centerBook, array_merge(
            $book,
            [
                'quantity' => $centerBook->getQuantity(),
                'level' => $level,
                'assignment' => $assignment,
                'relatedFrom' => $this->formatDate($centerBook->getDateFrom()),
                'relatedTo' => $this->formatDate($centerBook->getDateTo())
            ]
        ));
    }
}
