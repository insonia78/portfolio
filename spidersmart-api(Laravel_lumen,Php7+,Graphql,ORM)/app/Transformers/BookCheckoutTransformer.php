<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\BookCheckout;
use League\Fractal\Resource\Item;

class BookCheckoutTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'book', 'user', 'center'
    ];

    /**
     * Transform the given entity into a data array
     * @param BookCheckout $bookCheckout
     * @return array The transformed data
     */
    public function transform(BookCheckout $bookCheckout)
    {
        return $this->parseTransformer($bookCheckout, [
            'id' => $bookCheckout->getId(),
            'relatedFrom' => $this->formatDate($bookCheckout->getDateFrom()),
            'relatedTo' => $this->formatDate($bookCheckout->getDateTo())
        ]);
    }

    /**
     * Defines what book will look like when included in the transformation
     *
     * @param BookCheckout $checkout The enrollment for which to include the user
     * @return Item
     */
    public function includeBook(BookCheckout $checkout): ?Item
    {
        $user = $checkout->getBook();
        return $this->item($user, new BookTransformer());
    }

    /**
     * Defines what user will look like when included in the transformation
     *
     * @param BookCheckout $checkout The enrollment for which to include the user
     * @return Item
     */
    public function includeUser(BookCheckout $checkout): ?Item
    {
        $user = $checkout->getEnrollment()->getUser();
        return $this->item($user, new StudentTransformer());
    }

    /**
     * Defines what center will look like when included in the transformation
     *
     * @param BookCheckout $checkout The enrollment for which to include the user
     * @return Item
     */
    public function includeCenter(BookCheckout $checkout): ?Item
    {
        $user = $checkout->getEnrollment()->getCenter();
        return $this->item($user, new CenterTransformer());
    }
}
