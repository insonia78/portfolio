<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\Evaluation;
use League\Fractal\Resource\Collection;

class EvaluationTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'enrollments'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param evaluation $evaluation The evaluation to transform
     * @return array The transformed data
     */
    public function transform(Evaluation $evaluation)
    {
        return $this->parseTransformer($evaluation, [
            'id' => $evaluation->getId(),
            'title' => $evaluation->getTitle(),
            'rating' => $evaluation->getRating(),
            'comments' => $evaluation->getComments(),
            'dateFrom' => $this->formatDate($evaluation->getDateFrom()),
            'dateTo' => $this->formatDate($evaluation->getDateTo()),
            'active' => $evaluation->isActive()
        ]);
    }

    /**
     * Defines what enrollment will look like when included in the transformation
     *
     * @param evaluation $evaluation The evaluation for which to include enrollments
     * @return \League\Fractal\Resource\Collection
     */
    public function includeEnrollments(Evaluation $evaluation): Collection
    {
        $enrollment = $evaluation->getEnrollment();
        return $this->collection($enrollment, new EnrollmentTransformer());
    }
}
