<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\AssignmentFile;
use Doctrine\Common\Collections\Collection;
use League\Fractal\Resource\Item;

class AssignmentFileTransformer extends FileTransformer
{
    /**
     * @var array The included relationships which are available
     */
    protected $availableIncludes = [
        'assignment'
    ];

    /**
     * Transform the given entity into a data array
     * @param AssignmentFile $file
     * @todo PHP 7.x will not allow the parameter to be defined as AssignmentFile despite it extending File
     *       PHP 8.x supports union types however, so we after its release and upgrade, we can change this back to File
     *       and change the parameter in FileTransformer::transform() to User|Student|...
     * @return array The transformed data
     */
    public function transform(AssignmentFile $file): array
    {
        $outputMap = array_merge($this->getOutputMap($file), [
            'role' => $file->getRole(),
            'path' => getenv('UPLOAD_BASE_PATH_ASSIGNMENT') . $file->getPath()
        ]);
        return $this->parseTransformer($file, $outputMap);
    }

    /**
     * Defines what assignment will look like when included in the transformation
     *
     * @param AssignmentFile $file The section for which to include assignments
     * @return Item
     */
    public function includeAssignment(AssignmentFile $file): ?Item
    {
        $assignment = $file->getAssignment();
        return (!is_null($assignment)) ? $this->item($assignment, new AssignmentTransformer()) : null;
    }
}
