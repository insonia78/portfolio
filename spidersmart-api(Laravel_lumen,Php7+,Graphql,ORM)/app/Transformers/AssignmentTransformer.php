<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Assignment;
use League\Fractal\Resource\Item;
use League\Fractal\Resource\Collection;

class AssignmentTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'level', 'book', 'questions', 'sections', 'files'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param Assignment $assignment The assignment to transform
     * @return array The transformed data
     */
    public function transform(Assignment $assignment): array
    {
        return $this->parseTransformer($assignment, [
            'id' => $assignment->getId(),
            'title' => $assignment->getTitle(),
            'description' => $assignment->getDescription(),
            'dateFrom' => $this->formatDate($assignment->getDateFrom()),
            'dateTo' => $this->formatDate($assignment->getDateTo()),
            'active' => $assignment->isActive()
        ]);
    }

    /**
     * Defines what level will look like when included in the transformation
     *
     * @param Assignment $assignment The assignment for which to include levels
     * @return Item
     */
    public function includeLevel(Assignment $assignment): ?Item
    {
        $level = $assignment->getLevel();
        return (!is_null($level)) ? $this->item($level, new LevelTransformer()) : null;
    }

    /**
     * Defines what books will look like when included in the transformation
     *
     * @param Assignment $assignment The assignment for which to include the book
     * @return Item
     */
    public function includeBook(Assignment $assignment): ?Item
    {
        $book = $assignment->getBook();
        return (!is_null($book)) ? $this->item($book, new BookTransformer()) : null;
    }

    /**
     * Defines what questions will look like when included in the transformation
     *
     * @param Assignment $assignment The assignment for which to include questions
     * @return Collection
     */
    public function includeQuestions(Assignment $assignment): Collection
    {
        $questions = $assignment->getQuestions();
        return $this->collection($questions, new QuestionTransformer());
    }

    /**
     * Defines what assignment sections when included in the transformation
     *
     * @param Assignment $assignment The assignment for which to include sections
     * @return Collection
     */
    public function includeSections(Assignment $assignment): Collection
    {
        $sections = $assignment->getSections();
        return $this->collection($sections, new AssignmentSectionTransformer());
    }

    /**
     * Defines what assignment files when included in the transformation
     *
     * @param Assignment $assignment The assignment for which to include files
     * @return Collection
     */
    public function includeFiles(Assignment $assignment): Collection
    {
        $files = $assignment->getFiles();
        return $this->collection($files, new AssignmentFileTransformer());
    }
}
