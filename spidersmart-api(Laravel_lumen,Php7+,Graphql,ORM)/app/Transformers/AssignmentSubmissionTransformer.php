<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\AssignmentSubmission;
use App\Transformers\EnrollmentTransformer;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;

class AssignmentSubmissionTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are available
     */
    protected $availableIncludes = [
        'assignment', 'enrollment', 'answers', 'lastNonDraft'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param AssignmentSubmission $submission The enrollment assignment to transform
     * @return array The transformed data
     */
    public function transform(AssignmentSubmission $submission)
    {
        return $this->parseTransformer($submission, [
            'id' => $submission->getId(),
            'status' => $submission->getStatus(),
            'comments' => $submission->getComments(),
            'lastNonDraft' => $submission->getLastNonDraft(),
            'dateFrom' => $this->formatDate($submission->getDateFrom()),
            'dateTo' => $this->formatDate($submission->getDateTo())
        ]);
    }

    /**
     * Defines what enrollment will look like when included in the transformation
     *
     * @param AssignmentSubmission $submission The assignment for which to include the enrollment
     * @return Item
     */
    public function includeEnrollment(AssignmentSubmission $submission)
    {
        $enrollment = $submission->getEnrollment();
        return $this->item($enrollment, new EnrollmentTransformer());
    }

    /**
     * Defines the last non-draft version of the submission
     *
     * @param AssignmentSubmission $submission The assignment for which to include the enrollment
     * @return Item
     */
    public function includeLastNonDraft(AssignmentSubmission $submission)
    {
        $lastNonDraft = $submission->getLastNonDraft();
        return ($lastNonDraft) ? $this->item($lastNonDraft, new AssignmentSubmissionViewTransformer()) : null;
    }


    /**
     * Defines what assignment will look like when included in the transformation
     *
     * @param AssignmentSubmission $submission The enrollment assignment for which to include the assignment
     * @return Item
     */
    public function includeAssignment(AssignmentSubmission $submission)
    {
        $assignment = $submission->getAssignment();
        return $this->item($assignment, new AssignmentTransformer());
    }

    /**
     * Defines what answers to the submission will look like when included in the transformation
     *
     * @param AssignmentSubmission $submission The assignment submission for which to retrieve answers
     * @return Collection
     */
    public function includeAnswers(AssignmentSubmission $submission)
    {
        $answers = $submission->getAnswers();
        return $this->collection($answers, new AssignmentSubmissionAnswerTransformer());
    }
}
