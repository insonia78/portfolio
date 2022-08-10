<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

/**
 * Class AssignmentFileService
 * @package App\Services
 */
class FileService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'file';

    /**
     * @inheritDoc
     */
    protected $modelRelationPluralName = 'files';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'name' => 'string|nullable',
        'description' => 'string|nullable',
        'mimetype' => 'string|nullable',
        'path' => 'string|nullable'
    ];
}
