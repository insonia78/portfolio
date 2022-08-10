<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\FamilyContact;
use League\Fractal\Resource\Collection;

class FamilyContactTransformer extends BaseTransformer
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
     * @param FamilyContact $contact The address to transform
     * @return array The transformed data
     */
    public function transform(FamilyContact $contact)
    {
        return $this->parseTransformer($contact, [
            'id' => $contact->getId(),
            'title' => $contact->getTitle(),
            'value' => $contact->getValue(),
            'description' => $contact->getDescription(),
            'dateFrom' => $this->formatDate($contact->getDateFrom()),
            'dateTo' => $this->formatDate($contact->getDateTo())
        ]);
    }

    /**
     * Defines what family will look like when included in the transformation
     *
     * @param FamilyContact $contact The contact for which to include the family
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFamily(FamilyContact $contact): Collection
    {
        $family = $contact->getFamily();
        return $this->collection($family, new FamilyTransformer());
    }
}
