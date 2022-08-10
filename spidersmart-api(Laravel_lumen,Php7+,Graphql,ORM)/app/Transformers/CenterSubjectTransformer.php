<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Subject;
use App\Models\Relationships\CenterSubject;
use League\Fractal\Resource\Collection;

class CenterSubjectTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'levels'
    ];

    /**
     * Transform the given entity into a data array
     * @param CenterSubject $centerSubject
     * @return array The transformed data
     */
    public function transform(CenterSubject $centerSubject)
    {
        $subject = $this->getCurrentScope()->getManager()->createData($this->item($centerSubject->getSubject(), new SubjectTransformer()))->toArray();
        return $this->parseTransformer($centerSubject, array_merge(
            $subject,
            [
                'relatedFrom' => $this->formatDate($centerSubject->getDateFrom()),
                'relatedTo' => $this->formatDate($centerSubject->getDateTo())
            ]
        ));
    }

    /**
     * Defines what levels will look like when included in the transformation
     *
     * @param CenterSubject $subject The subject for which to include levels
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLevels(CenterSubject $subject): Collection
    {
        $levels = $subject->getSubject()->getLevels();
        return $this->collection($levels, new LevelTransformer());
    }
}
