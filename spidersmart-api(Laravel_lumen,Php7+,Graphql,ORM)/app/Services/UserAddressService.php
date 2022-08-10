<?php

namespace App\Services;

use App\Contracts\BusinessModelService;

/**
 * Class AddressService
 * @package App\Services
 */
class UserAddressService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'address';

    /**
     * @inheritDoc
     */
    protected $modelRelationPluralName = 'addresses';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'title' => 'required|string',
        'streetAddress' => 'required|string',
        'city' => 'required|string',
        'state' => 'required|string',
        'postalCode' => 'required|string',
        'country' => 'required|alpha|size:2'
    ];
}
