<?php

namespace App\Transformers;

use App\Models\Entities\Relation\Family;
use League\Fractal\Resource\Collection;

class FamilyTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'users', 'contacts', 'addresses'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param Family $family The family to transform
     * @return array The transformed data
     */
    public function transform(Family $family)
    {
        return $this->parseTransformer($family, [
            'id' => $family->getId(),
            'dateFrom' => $this->formatDate($family->getDateFrom()),
            'dateTo' => $this->formatDate($family->getDateTo())
        ]);
    }

    /**
     * Defines what user will look like when included in the transformation
     *
     * @param Family $family The family for which to include users
     * @return \League\Fractal\Resource\Collection
     */
    public function includeUsers(Family $family): Collection
    {
        $user = $family->getUsers();
        return $this->collection($user, new FamilyUserTransformer());
    }

    /**
     * Defines what contacts will look like when included in the transformation
     *
     * @param Family $family The family for which to include contacts
     * @return \League\Fractal\Resource\Collection
     */
    public function includeContacts(Family $family): Collection
    {
        $contacts = $family->getContacts();
        return $this->collection($contacts, new FamilyContactTransformer());
    }

    /**
     * Defines what addresses will look like when included in the transformation
     *
     * @param Family $family The family for which to include addresses
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAddresses(Family $family): Collection
    {
        $addresses = $family->getAddresses();
        return $this->collection($addresses, new FamilyAddressTransformer());
    }
}
