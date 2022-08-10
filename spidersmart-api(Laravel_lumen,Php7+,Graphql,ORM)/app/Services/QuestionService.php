<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Secondary\Question;
use App\Transformers\QuestionTransformer;
use Symfony;

/**
 * Class QuestionService
 * @package App\Services
 */
class QuestionService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'type' => 'required|string',
        'question' => 'required|string',
        //'answer' => 'required|string',
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'answers' => \App\Services\QuestionAnswerService::class
    ];

    /**
     * Retrieve a user from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceEntityNotFoundException If no identifier was provided to validate
     * @throws ServiceRetrieveFailureException If retrieval failed
     * @return array The data returned for the entity
     */
 /*   public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of question
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // $this->validateIdentifier($identifier);
        return $this->transform(
            $this->retrieveEntity(
                Question::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new QuestionTransformer(),
            ['answers', 'categories']
        );
    }*/

    /**
     * Retrieve all questions <<IS THIS EVER USED?? QUESTIONS ARE ONLY ACCESSED AS A SUB-PROPERTY OF ASSIGNMENT SECTIONS, RIGHT???>>
     *
     * @throws ServiceRetrieveFailureException If retrieval failed
     * @return array An array of returned entities
     */
/*    public function getAll(): array
    {
        return $this->retrieveCollection(
            Question::class,
            $inputs['queryOptions'] ?? [],
            new QuestionTransformer(),
            ['answers', 'categories']
        );
    }*/

    /**
     * Create a new question
     *
     * @param array $inputs The data provided for the request
     * @return array The newly created entity data
     */
    /*public function create(array $inputs)
    {
        return $this->transformEntity(
            $this->insert($inputs, new Question()),
            new QuestionTransformer()
        );
    }*/

    /**
     * Updates a question with given information
     *
     * @param array $inputs The data provided for the request
     * @return array The updated entity data
     *
    public function update(array $inputs)
    {
        return $this->transformEntity(
            $this->modify($inputs, $this->retrieveEntity(Question::class, new RepositoryIdentifier($inputs['id']))),
            new QuestionTransformer()
        );
    }

    /**
     * Deletes a given question
     *
     * @param array $inputs The data provided for the request
     * @return void
     */
 /*   public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Question::class, new RepositoryIdentifier($inputs['id']))
        );
    }*/
}
