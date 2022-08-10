<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Subject;
use App\Models\Relationships\CenterSubject;
use League\Fractal\Resource\Collection;

class SubjectCenterTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [];

    /**
     * Transform the given entity into a data array
     * @param CenterSubject $centerSubject
     * @return array The transformed data
     */
    public function transform(CenterSubject $centerSubject)
    {
        $center = $this->getCurrentScope()->getManager()->createData($this->item($centerSubject->getCenter(), new CenterTransformer()))->toArray();
        return $this->parseTransformer($centerSubject, array_merge(
            $center,
            [
                'relatedFrom' => $this->formatDate($centerSubject->getDateFrom()),
                'relatedTo' => $this->formatDate($centerSubject->getDateTo())
            ]
        ));
    }
}
