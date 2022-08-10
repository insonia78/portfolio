<?php

namespace App\Transformers;

use App\Models\Entities\Primary\TuitionRate;
use League\Fractal\Resource\Collection;

class TuitionRateTransformer extends BaseTransformer
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
     * @param TuitionRate $tuitionRate The tuition rate to transform
     * @return array The transformed data
     */
    public function transform(TuitionRate $tuitionRate)
    {
        return $this->parseTransformer($tuitionRate, [
            'id'                => $tuitionRate->getId(),
            'title'             => $tuitionRate->getTitle(),
            'description'       => $tuitionRate->getDescription(),
            'amount'            => $tuitionRate->getAmount(),
            'payPeriod'         => $tuitionRate->getPayPeriod(),
            'payOccurrences'    => $tuitionRate->getPayOccurrences(),
            'bookPeriod'        => $tuitionRate->getBookPeriod(),
            'bookLimit'         => $tuitionRate->getBookLimit(),
            'assignmentPeriod'  => $tuitionRate->getAssignmentPeriod(),
            'assignmentLimit'   => $tuitionRate->getAssignmentLimit(),
            'dateFrom'          => $this->formatDate($tuitionRate->getDateFrom()),
            'dateTo'            => $this->formatDate($tuitionRate->getDateTo()),
            'active'            => $tuitionRate->isActive()
        ]);
    }

    /**
     * Defines which enrollments will look like when included in the transformation
     *
     * @param TuitionRate $tuitionRate The tuition rate for which to include enrollments
     * @return \League\Fractal\Resource\Collection
     */
    public function includeEnrollments(TuitionRate $tuitionRate): Collection
    {
        $enrollments = $tuitionRate->getEnrollments();
        return $this->collection($enrollments, new EnrollmentTransformer());
    }
}
