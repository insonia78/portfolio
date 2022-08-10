<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\Question;
use League\Fractal\Resource\Item;
use League\Fractal\Resource\Collection;

class QuestionTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'assignment', 'answers'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param Question $question The Question to transform
     * @return array The transformed data
     */
    public function transform(Question $question)
    {
        return $this->parseTransformer($question, [
            'id' => $question->getId(),
            'type' => $question->getType(),
            'question' => $question->getQuestion(),
            'answer' => $question->getAnswer(),
            'dateFrom' => $this->formatDate($question->getDateFrom()),
            'dateTo' => $this->formatDate($question->getDateTo()),
            'active' => $question->isActive()
        ]);
    }

    /**
     * Defines what assignment will look like when included in the transformation
     *
     * @param Question $question The question for which to include the assignment
     * @return \League\Fractal\Resource\Item
     */
    public function includeAssignment(Question $question): Item
    {
        $assignment = $question->getAssignment();
        return $this->item($assignment, new AssignmentTransformer());
    }

    /**
     * Defines what question answer will look like when included in the transformation
     *
     * @param Question $question The question for which to include answers
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAnswers(Question $question): Collection
    {
        $answers = $question->getAnswers();
        return $this->collection($answers, new QuestionAnswerTransformer());
    }
}
