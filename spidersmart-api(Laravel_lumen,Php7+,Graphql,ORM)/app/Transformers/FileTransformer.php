<?php

namespace App\Transformers;

use App\Models\Entities\Secondary\File;

class FileTransformer extends BaseTransformer
{
    /**
     * Defines the map of outputs to be defined for a user - this is overridable for children to define additional output
     *
     * @param File $file The file to transform
     * @return array The output map to apply
     */
    protected function getOutputMap(File $file): array
    {
        return $this->parseTransformer($file, [
            'id' => $file->getId(),
            'name' => $file->getName(),
            'mimetype' => $file->getMimetype(),
            'description' => $file->getDescription(),
            'path' => $file->getPath(),
            'dateFrom' => $this->formatDate($file->getDateFrom()),
            'dateTo' => $this->formatDate($file->getDateTo()),
            'active' => $file->isActive()
        ]);
    }
}
