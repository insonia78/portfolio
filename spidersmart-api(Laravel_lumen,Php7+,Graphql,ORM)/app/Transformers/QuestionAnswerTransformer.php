<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\QuestionAnswer;
use League\Fractal\Resource\Collection;

class QuestionAnswerTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'question'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param questionAnswer $questionAnswer The Question Answer to transform
     * @return array The transformed data
     */
    public function transform(QuestionAnswer $questionAnswer)
    {
        return $this->parseTransformer($questionAnswer, [
            'id' => $questionAnswer->getId(),
            'answer' => $questionAnswer->getAnswer(),
            'correct' => $questionAnswer->isCorrect(),
            'question' => $questionAnswer->getQuestion(),
            'dateFrom' => $this->formatDate($questionAnswer->getDateFrom()),
            'dateTo' => $this->formatDate($questionAnswer->getDateTo())
        ]);
    }

    /**
     * Defines what question will look like when included in the transformation
     *
     * @param questionAnswer $questionAnswer The answer for which to include the question
     * @return \League\Fractal\Resource\Collection
     */
    public function includeQuestion(QuestionAnswer $questionAnswer): Collection
    {
        $question = $questionAnswer->getQuestion();
        return $this->collection($question, new QuestionTransformer());
    }
}
