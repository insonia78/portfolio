<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Level;
use App\Models\Entities\Secondary\LevelFile;

/**
 * Class AssignmentFileService
 * @package App\Services
 */
class LevelFileService extends FileService implements BusinessModelService
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
        'role' => 'required|in:assessment,answer_key',
        'name' => 'string|nullable',
        'description' => 'string|nullable',
        'mimetype' => 'string|nullable',
        'path' => 'string|nullable'
    ];

    /**
     * @inheritDoc
     * @noinspection DuplicatedCode
     * @param Level $original The existing state of the level for which the files are being compared
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
        /** @var LevelFile $currentFile */
        $currentFile = $currentFilesArray[array_search($inputs['id'], $currentFilesIds)];
        return (
            $currentFile->getName() !== $inputs['name'] ||
            $currentFile->getDescription() !== $inputs['description'] ||
            $currentFile->getRole() !== $inputs['role']
        );
    }
}
