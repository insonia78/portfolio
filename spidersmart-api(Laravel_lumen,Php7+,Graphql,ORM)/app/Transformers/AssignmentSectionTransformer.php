<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\AssignmentSection;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;

class AssignmentSectionTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'assignment', 'questions'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param AssignmentSection $section The section to transform
     * @return array The transformed data
     */
    public function transform(AssignmentSection $section): array
    {
        return $this->parseTransformer($section, [
            'id' => $section->getId(),
            'active' => $section->isActive(),
            'dateFrom' => $this->formatDate($section->getDateFrom()),
            'dateTo' => $this->formatDate($section->getDateTo()),
            'title' => $section->getTitle(),
            'instructions' => $section->getInstructions()
        ]);
    }

    /**
     * Defines what assignment will look like when included in the transformation
     *
     * @param AssignmentSection $section The section for which to include assignments
     * @return Item
     */
    public function includeAssignment(AssignmentSection $section): ?Item
    {
        $assignment = $section->getAssignment();
        return (!is_null($assignment)) ? $this->item($assignment, new AssignmentTransformer()) : null;
    }

    /**
     * Defines what questions will look like when included in the transformation
     *
     * @param AssignmentSection $section The section for which to include questions
     * @return \League\Fractal\Resource\Collection
     */
    public function includeQuestions(AssignmentSection $section): Collection
    {
        $questions = $section->getQuestions();
        return $this->collection($questions, new QuestionTransformer());
    }
}
