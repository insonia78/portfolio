<?php

namespace App\Transformers;

use App\Models\Derived\AssignmentSubmissionView;
use League\Fractal\Resource\Collection;

class AssignmentSubmissionViewTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are available
     */
    protected $availableIncludes = [
        'answers'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param AssignmentSubmissionView $submission The enrollment assignment to transform
     * @return array The transformed data
     */
    public function transform(AssignmentSubmissionView $submission)
    {
        return $this->parseTransformer($submission, [
            'id' => $submission->getId(),
            'status' => $submission->getStatus(),
            'comments' => $submission->getComments(),
            'dateFrom' => $this->formatDate($submission->getDateFrom()),
            'dateTo' => $this->formatDate($submission->getDateTo())
        ]);
    }

    /**
     * Defines what answers to the submission view will look like when included in the transformation
     *
     * @param AssignmentSubmissionView $submission The assignment submission for which to retrieve answers
     * @return Collection
     */
    public function includeAnswers(AssignmentSubmissionView $submission)
    {
        $answers = $submission->getAnswers();
        return $this->collection($answers, new AssignmentSubmissionAnswerTransformer());
    }
}
