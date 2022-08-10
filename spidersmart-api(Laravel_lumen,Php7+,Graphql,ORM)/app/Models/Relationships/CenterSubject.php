<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Models\Entities\Primary\Center;
use App\Models\Entities\Primary\Subject;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="center_subject")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class CenterSubject implements ExpiresModel
{
    use ModelExpires;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Center", inversedBy="subjects")
     * @ORM\JoinColumn(name="center_id", referencedColumnName="id")
     */
    protected $center;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Subject", inversedBy="centers")
     * @ORM\JoinColumn(name="subject_id", referencedColumnName="id")
     */
    protected $subject;

    /**
     * @return Center
     */
    public function getCenter(): ?Center
    {
        return $this->center;
    }

    /**
     * @param Center $center
     */
    public function setCenter(Center $center)
    {
        $this->center = $center;
    }

    /**
     * @return Subject
     */
    public function getSubject(): ?Subject
    {
        return $this->subject;
    }

    /**
     * @param Subject $subject
     */
    public function setSubject(Subject $subject)
    {
        $this->subject = $subject;
    }
}
