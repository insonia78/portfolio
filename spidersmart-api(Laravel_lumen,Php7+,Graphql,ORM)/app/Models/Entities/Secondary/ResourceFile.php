<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\VersionedModel;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\Collection;
use App\Models\Entities\Primary\Assignment;

/**
 * @ORM\Entity
 * @ORM\Table(name="resource_file")
 */
class ResourceFile extends File implements IdentifiableModel, VersionedModel
{
}
