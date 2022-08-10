<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

/**
 * Class AssignmentSectionService
 * @package App\Services
 */
class AssignmentSectionService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'section';

    /**
     * @inheritDoc
     */
    protected $modelRelationPluralName = 'sections';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'title' => 'required|string',
        'instructions' => 'string|nullable'
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'questions' => \App\Services\QuestionService::class
    ];
}
