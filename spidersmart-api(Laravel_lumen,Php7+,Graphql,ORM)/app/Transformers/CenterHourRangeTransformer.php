<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\CenterHourRange;
use League\Fractal\Resource\Item;

class CenterHourRangeTransformer extends BaseTransformer
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
     * @param CenterHourRange $hourRange The hour range to transform
     * @return array The transformed data
     */
    public function transform(CenterHourRange $hourRange)
    {
        return $this->parseTransformer($hourRange, [
            'id' => $hourRange->getId(),
            'day' => $hourRange->getDay(),
            'startTime' => $hourRange->getStartTime()->format("H:i"),
            'endTime' => $hourRange->getEndTime()->format("H:i"),
            'dateFrom' => $this->formatDate($hourRange->getDateFrom()),
            'dateTo' => $this->formatDate($hourRange->getDateTo())
        ]);
    }

    /**
     * Defines what a center will look like when included in the transformation
     *
     * @param CenterHourRange $hourRange The address for which to include the user
     * @return \League\Fractal\Resource\Item
     */
    public function includeCenter(CenterHourRange $hourRange): Item
    {
        $center = $hourRange->getCenter();
        return $this->item($center, new CenterTransformer());
    }
}
