<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

/**
 * Class CenterHourRangeService
 * @package App\Services
 */
class CenterHourRangeService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'day' => 'required|string|size:1',
        'startTime' => 'required|date_format:H:i',
        'endTime' => 'required|date_format:H:i'
    ];
}
