<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

/**
 * Class CenterBookService
 * @package App\Services
 */
class CenterBookService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'Book';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'quantity' => 'required|integer'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'book' => \App\Services\BookService::class
    ];
}
