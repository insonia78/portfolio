<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Assignment;
use App\Models\Entities\Secondary\AssignmentFile;
use Doctrine\Common\Collections\Collection;

/**
 * Class AssignmentFileService
 * @package App\Services
 */
class AssignmentFileService extends FileService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $modelRelationName = 'file';

    /**
     * @inheritDoc
     */
    protected $modelRelationPluralName = 'files';

    /**
     * @inheritDoc
     */
    protected $rules = [
        'role' => 'required|in:assignment,answer_key,attachment',
        'name' => 'string|nullable',
        'description' => 'string|nullable',
        'mimetype' => 'string|nullable',
        'path' => 'string|nullable'
    ];

    /**
     * @inheritDoc
     * @noinspection DuplicatedCode
     * @param Assignment $original The existing state of the assignment for which the files are being compared
     * @param array $inputs The input values for the current file
     */
    public function isChanged(IdentifiableModel $original, array $inputs): bool
    {
        $currentFiles = $original->getFiles();
        $currentFilesArray = $currentFiles->toArray();
        $currentFilesIds = array_map(function ($file) {
            return $file->getId();
        }, $currentFilesArray);

        // if the file has no id that exists within the current file set, it is new and so has changed
        if (!array_key_exists('id', $inputs) || !in_array($inputs['id'], $currentFilesIds)) {
            return true;
        }

        // if the file does exist within the current file set, check for changes
        /** @var AssignmentFile $currentFile */
        $currentFile = $currentFilesArray[array_search($inputs['id'], $currentFilesIds)];
        return (
            $currentFile->getName() !== $inputs['name'] ||
            $currentFile->getDescription() !== $inputs['description'] ||
            $currentFile->getRole() !== $inputs['role']
        );
    }
}
