<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

class UserContactService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'contact';

    /**
     * @inheritDoc
     */
    protected $modelRelationPluralName = 'contacts';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'title' => 'required|string',
        'type' => 'required|string',
        'value' => 'required|string'
    ];
}
