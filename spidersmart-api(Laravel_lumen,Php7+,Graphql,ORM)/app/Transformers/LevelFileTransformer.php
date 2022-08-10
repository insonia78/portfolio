<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\LevelFile;
use Doctrine\Common\Collections\Collection;
use League\Fractal\Resource\Item;

class LevelFileTransformer extends FileTransformer
{
    /**
     * @var array The included relationships which are available
     */
    protected $availableIncludes = [
        'level'
    ];

    /**
     * Transform the given entity into a data array
     * @param LevelFile $file
     * @todo PHP 7.x will not allow the parameter to be defined as LevelFile despite it extending File
     *       PHP 8.x supports union types however, so we after its release and upgrade, we can change this back to File
     *       and change the parameter in FileTransformer::transform() to User|Student|...
     * @return array The transformed data
     */
    public function transform(LevelFile $file): array
    {
        $outputMap = array_merge($this->getOutputMap($file), [
            'role' => $file->getRole(),
            'path' => getenv('UPLOAD_BASE_PATH_LEVEL') . $file->getPath()
        ]);
        return $this->parseTransformer($file, $outputMap);
    }

    /**
     * Defines what assignment will look like when included in the transformation
     *
     * @param LevelFile $file The section for which to include assignments
     * @return Item
     */
    public function includeLevel(LevelFile $file): ?Item
    {
        $level = $file->getLevel();
        return (!is_null($level)) ? $this->item($level, new LevelTransformer()) : null;
    }
}
