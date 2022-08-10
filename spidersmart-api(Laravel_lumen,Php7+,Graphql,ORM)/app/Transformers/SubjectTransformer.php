<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Subject;
use League\Fractal\Resource\Collection;

class SubjectTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'centers', 'levels'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param subject $subject The subject to transform
     * @return array The transformed data
     */
    public function transform(Subject $subject)
    {
        return $this->parseTransformer($subject, [
            'id' => $subject->getId(),
            'name' => $subject->getName(),
            'displayName' => $subject->getDisplayName(),
            'displayIcon' => $subject->getDisplayIcon(),
            'description' => $subject->getDescription(),
            'dateFrom' => $this->formatDate($subject->getDateFrom()),
            'dateTo' => $this->formatDate($subject->getDateTo()),
            'hasBooks' => $subject->hasBooks(),
            'hasArticles' => $subject->hasArticles(),
            'active' => $subject->isActive()
        ]);
    }

    /**
     * Defines what centers will look like when included in the transformation
     *
     * @param Subject $subject The subject for which to include centers
     * @return \League\Fractal\Resource\Collection
     */
    public function includeCenters(Subject $subject): Collection
    {
        $centers = $subject->getCenters();
        return $this->collection($centers, new SubjectCenterTransformer());
    }

    /**
     * Defines what levels will look like when included in the transformation
     *
     * @param Subject $subject The subject for which to include levels
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLevels(Subject $subject): Collection
    {
        $levels = $subject->getLevels();
        return $this->collection($levels, new LevelTransformer());
    }
}
