<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\VersionedModel;
use App\Models\Entities\Primary\Level;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity
 * @ORM\Table(name="level_file")
 */
class LevelFile extends File implements IdentifiableModel, VersionedModel
{
    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Level", inversedBy="level_file")
     * @ORM\JoinColumn(name="level_id", referencedColumnName="id")
     */
    protected $level;

    /**
     * @ORM\Column(type="string")
     */
    protected $role;

    /**
     * @return Level
     */
    public function getLevel(): ?Level
    {
        return $this->level;
    }

    /**
     * @param Level $level
     */
    public function setLevel(Level $level)
    {
        $this->level = $level;
    }

    /**
     * @return string
     */
    public function getRole(): ?string
    {
        return $this->role;
    }

    /**
     * @param string $role
     */
    public function setRole(string $role)
    {
        $this->role = $role;
    }
}
