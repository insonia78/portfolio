<?php

namespace App\Transformers;

use App\Models\Relationships\FamilyUser;
use League\Fractal\Resource\Item;

class FamilyUserTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are available
     */
    protected $availableIncludes = [
        'user', 'family'
    ];

    /**
     * Transform the given entity into a data array
     * @param FamilyUser $familyUser
     * @return array The transformed data
     */
    public function transform(FamilyUser $familyUser)
    {
        return $this->parseTransformer($familyUser, [
            'dateFrom' => $this->formatDate($familyUser->getDateFrom()),
            'dateTo' => $this->formatDate($familyUser->getDateTo())
        ]);
    }

    /**
     * Defines which user will look like when included in the transformation
     * @param FamilyUser $familyUser
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(FamilyUser $familyUser): Item
    {
        $user = $familyUser->getUser();
        return $this->item($user, new UserTransformer());
    }

    /**
     * Defines which family will look like when included in the transformation
     * @param FamilyUser $familyUser
     * @return \League\Fractal\Resource\Item
     */
    public function includeFamily(FamilyUser $familyUser): Item
    {
        $family = $familyUser->getFamily();
        return $this->item($family, new FamilyTransformer());
    }
}
