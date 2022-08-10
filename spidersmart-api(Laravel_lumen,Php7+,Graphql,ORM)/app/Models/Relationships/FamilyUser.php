<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Models\Entities\Primary\User;
use App\Models\Entities\Relation\Family;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="family_user")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class FamilyUser implements ExpiresModel
{
    use ModelExpires;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Relation\Family", inversedBy="users")
     * @ORM\JoinColumn(name="family_id", referencedColumnName="id")
     */
    protected $family;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\User", inversedBy="families")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @return Family
     */
    public function getFamily(): ?Family
    {
        return $this->family;
    }

    /**
     * @param Family $family
     */
    public function setFamily(Family $family)
    {
        $this->family = $family;
    }

    /**
     * @return User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }
}
