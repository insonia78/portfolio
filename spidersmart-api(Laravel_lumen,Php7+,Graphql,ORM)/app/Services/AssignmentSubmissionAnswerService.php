<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Secondary\AssignmentSubmission;
use App\Models\Entities\Secondary\AssignmentSubmissionAnswer;

/**
 * Class AssignmentSubmissionAnswerService
 * @package App\Services
 */
class AssignmentSubmissionAnswerService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'Answer';
    protected $modelRelationPluralName = 'Answers';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'answer' => 'string|nullable',
        'correction' => 'string|nullable',
        'comments' => 'string|nullable',
        'correct' => 'boolean|nullable'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'question' => \App\Services\QuestionService::class,
//        'book' => \App\Services\BookService::class
    ];

    /**
     * @inheritDoc
     * @param AssignmentSubmission $original
     */
    public function isChanged(IdentifiableModel $original, array $inputs): bool
    {
        $answers = $original->getAnswers();

        // make sure a question reference exists
        if (!isset($inputs['question']) || !isset($inputs['question']['id'])) {
            return false;
        }

        // ensure all expected values exist
        $expectedKeys = ['answer', 'comments', 'correction', 'correct'];
        $validAnswer = false;
        foreach ($expectedKeys as $key) {
            $inputs[$key] = $inputs[$key] ?? null;
            if (!is_null($inputs[$key])) {
                $validAnswer = true;
            }
        }
        if (!$validAnswer) {
            return false;
        }

        // ensure some change has occurred with answer
        if (
            array_filter($answers->toArray(), function ($answer) use ($inputs) {
                return $answer->getId() === intval($inputs['id'])
                && $answer->getSubmission()->getId() === $inputs['submission_id']
                && $answer->getQuestion()->getId() === $inputs['question']['id']
                && $answer->getAnswer() === $inputs['answer']
                && $answer->getComments() === $inputs['comments']
                && $answer->getCorrection() === $inputs['correction']
                && $answer->isCorrect() === $inputs['correct'];
            })
        ) {
            return false;
        }
        return true;
    }
}
