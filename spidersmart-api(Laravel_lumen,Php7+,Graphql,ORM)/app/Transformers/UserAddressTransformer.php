<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\UserAddress;
use League\Fractal\Resource\Item;

class UserAddressTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'user'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param UserAddress $address The address to transform
     * @return array The transformed data
     */
    public function transform(UserAddress $address)
    {
        return $this->parseTransformer($address, [
            'id' => $address->getId(),
            'title' => $address->getTitle(),
            'streetAddress' => $address->getStreetAddress(),
            'city' => $address->getCity(),
            'state' => $address->getState(),
            'postalCode' => $address->getPostalCode(),
            'country' => $address->getCountry(),
            'dateFrom' => $this->formatDate($address->getDateFrom()),
            'dateTo' => $this->formatDate($address->getDateTo())
        ]);
    }

    /**
     * Defines which user will look like when included in the transformation
     *
     * @param UserAddress $address The address for which to include the user
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(UserAddress $address): Item
    {
        $user = $address->getUser();
        return $this->item($user, new UserTransformer());
    }
}
