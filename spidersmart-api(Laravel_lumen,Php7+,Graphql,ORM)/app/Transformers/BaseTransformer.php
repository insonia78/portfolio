<?php

namespace App\Transformers;

use League\Fractal\Resource\Collection;
use League\Fractal\Resource\NullResource;
use League\Fractal\TransformerAbstract;
use DateTime;

/**
 * Class BaseTransformer
 * @SuppressWarnings(PHPMD.NumberOfChildren)
 * @package App\Transformers
 */
class BaseTransformer extends TransformerAbstract
{
    /**
     * Transform the given entity into a data array
     *
     * @param Object $entity The entity to transform
     * @param array $dataMap The data mapping for the entity properties
     * @return array The transformed data
     */
    protected function parseTransformer(object $entity, array $dataMap)
    {
        return array_merge($dataMap, [
            '__typename' => class_basename($entity)
        ]);
    }

    /**
     * Formats the given date according to API configuration
     *
     * @param DateTime|null $date The given DateTime object
     * @param null $format The date format to use, will default to the configuration setting
     * @return string The formatted date, if date is not a DateTime object, this will pass through instead
     */
    protected function formatDate(?\DateTime $date, $format = null)
    {
        $dateFormat = $format ?? config('api.dateFormat');
        return (!is_null($date) && is_a($date, 'DateTime')) ? $date->format($dateFormat) : $date;
    }

    /**
     * Provides check for data before passing to collection.  Addresses issue where passing null data to the collection method will trigger an error.
     *
     * @param mixed $data The data provided which should be transformed
     * @param TransformerAbstract $transformer The transformer which should be used to perform the transformation
     * @param string|null $resourceKey The collection resource key
     * @return Collection|null The transformed data collection
     */
    protected function collection($data, $transformer, $resourceKey = null): ?Collection
    {
        if (is_null($data)) {
            return null;
        }
        return parent::collection($data, $transformer, $resourceKey);
    }
}
