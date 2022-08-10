<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Models\Entities\Relation\Enrollment;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="evaluation")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Evaluation implements IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Relatioin\Enrollment", inversedBy="evaluation")
     * @ORM\JoinColumn(name="enrollment_id", referencedColumnName="id")
     */
    protected $enrollment;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="enum")
     */
    protected $rating;

    /**
     * @ORM\Column(type="string")
     */
    protected $comments;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @return Enrollment
     */
    public function getEnrollment(): ?Enrollment
    {
        return $this->enrollment;
    }

    /**
     * @param Enrollment $enrollment
     */
    public function setEnrollment(Enrollment $enrollment)
    {
        $this->enrollment = $enrollment;
    }

    /**
     * @return string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getRating(): ?string
    {
        return $this->rating;
    }

    /**
     * @param string $rating
     */
    public function setRating(string $rating)
    {
        $this->rating = $rating;
    }

    /**
     * @return string
     */
    public function getComments(): ?string
    {
        return $this->comments;
    }

    /**
     * @param string $comments
     */
    public function setComments(string $comments)
    {
        $this->comments = $comments;
    }

    /**
     * @return bool
     */
    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     */
    public function setActive(bool $isActive)
    {
        $this->isActive = $isActive;
    }
}
