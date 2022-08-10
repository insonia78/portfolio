<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\UserContact;
use League\Fractal\Resource\Item;

class UserContactTransformer extends BaseTransformer
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
     * @param UserContact $contact The contact to transform
     * @return array The transformed data
     */
    public function transform(UserContact $contact)
    {
        return $this->parseTransformer($contact, [
            'id' => $contact->getId(),
            'title' => $contact->getTitle(),
            'type' => $contact->getType(),
            'value' => $contact->getValue(),
            'dateFrom' => $this->formatDate($contact->getDateFrom()),
            'dateTo' => $this->formatDate($contact->getDateTo())
        ]);
    }

    /**
     * Defines which user will look like when included in the transformation
     *
     * @param UserContact $contact The contact for which to include the user
     * @return \League\Fractal\Resource\Item
     */
    public function includeUser(UserContact $contact): Item
    {
        $user = $contact->getUser();
        return $this->item($user, new UserTransformer());
    }
}
