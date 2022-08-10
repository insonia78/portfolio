<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\FamilyAddress;
use League\Fractal\Resource\Collection;

class FamilyAddressTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'family'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param FamilyAddress $address The address to transform
     * @return array The transformed data
     */
    public function transform(FamilyAddress $address)
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
     * Defines what family will look like when included in the transformation
     *
     * @param FamilyAddress $address The address for which to retrieve the family
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFamily(FamilyAddress $address): Collection
    {
        $family = $address->getFamily();
        return $this->collection($family, new FamilyTransformer());
    }
}
