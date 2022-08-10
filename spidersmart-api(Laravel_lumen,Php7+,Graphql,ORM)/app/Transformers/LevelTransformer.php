<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Level;
use League\Fractal\Resource\Item;
use League\Fractal\Resource\Collection;

class LevelTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'subject', 'enrollments', 'files'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param level $level The level to transform
     * @return array The transformed data
     */
    public function transform(Level $level)
    {
        return $this->parseTransformer($level, [
            'id' => $level->getId(),
            'name' => $level->getName(),
            'description' => $level->getDescription(),
            'rule' => $level->getRule(),
            'vocabLines' => $level->getVocabLines(),
            'shortAnswerLines' => $level->getShortAnswerLines(),
            'essayLines' => $level->getEssayLines(),
            'dateFrom' => $this->formatDate($level->getDateFrom()),
            'dateTo' => $this->formatDate($level->getDateTo()),
            'active' => $level->isActive()
        ]);
    }

    /**
     * Defines what subject will look like when included in the transformation
     *
     * @param level $level The level for which to include the subject
     * @return Item
     */
    public function includeSubject(Level $level): Item
    {
        $subject = $level->getSubject();
        return $this->item($subject, new SubjectTransformer());
    }

    /**
     * Defines what enrollments will look like when included in the transformation
     *
     * @param level $level The level for which to include enrollments
     * @return Collection
     */
    public function includeEnrollments(Level $level): Collection
    {
        $enrollments = $level->getEnrollments();
        return $this->collection($enrollments, new EnrollmentTransformer());
    }

    /**
     * Defines what level files when included in the transformation
     *
     * @param Level $level The level for which to include files
     * @return Collection
     */
    public function includeFiles(Level $level): Collection
    {
        $files = $level->getFiles();
        return $this->collection($files, new LevelFileTransformer());
    }
}
