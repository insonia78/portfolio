<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Models\Entities\Relation\Enrollment;

/**
 * @ORM\Entity
 * @ORM\Table(name="tuition_rate")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class TuitionRate implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\Column(type="decimal")
     */
    protected $amount;

    /**
     * @ORM\Column(type="enum")
     */
    protected $payPeriod;

    /**
     * @ORM\Column(type="integer")
     */
    protected $payOccurrences;

    /**
     * @ORM\Column(type="enum")
     */
    protected $bookPeriod;

    /**
     * @ORM\Column(type="integer")
     */
    protected $bookLimit;

    /**
     * @ORM\Column(type="enum")
     */
    protected $assignmentPeriod;

    /**
     * @ORM\Column(type="integer")
     */
    protected $assignmentLimit;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Relation\Enrollment", mappedBy="tuition_rate")
     */
    protected $enrollments;


    public function __construct()
    {
        $this->enrollments = new ArrayCollection();
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
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description)
    {
        $this->description = $description;
    }

    /**
     * @return float
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     */
    public function setAmount(float $amount)
    {
        $this->amount = $amount;
    }

    /**
     * @return string
     */
    public function getPayPeriod(): ?string
    {
        return $this->payPeriod;
    }

    /**
     * @param string $payPeriod
     */
    public function setPayPeriod(string $payPeriod)
    {
        $this->payPeriod = $payPeriod;
    }

    /**
     * @return int
     */
    public function getPayOccurrences(): ?int
    {
        return $this->payOccurrences;
    }

    /**
     * @param int $payOccurrences
     */
    public function setPayOccurrences(int $payOccurrences)
    {
        $this->payOccurrences = $payOccurrences;
    }

    /**
     * @return string
     */
    public function getBookPeriod(): ?string
    {
        return $this->bookPeriod;
    }

    /**
     * @param string $bookPeriod
     */
    public function setBookPeriod(string $bookPeriod)
    {
        $this->bookPeriod = $bookPeriod;
    }

    /**
     * @return int
     */
    public function getBookLimit(): ?int
    {
        return $this->bookLimit;
    }

    /**
     * @param int $bookLimit
     */
    public function setBookLimit(int $bookLimit)
    {
        $this->bookLimit = $bookLimit;
    }

    /**
     * @return string
     */
    public function getAssignmentPeriod(): ?string
    {
        return $this->assignmentPeriod;
    }

    /**
     * @param string $assignmentPeriod
     */
    public function setAssignmentPeriod(string $assignmentPeriod)
    {
        $this->assignmentPeriod = $assignmentPeriod;
    }

    /**
     * @return int
     */
    public function getAssignmentLimit(): ?int
    {
        return $this->assignmentLimit;
    }

    /**
     * @param int $assignmentLimit
     */
    public function setAssignmentLimit(int $assignmentLimit)
    {
        $this->assignmentLimit = $assignmentLimit;
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

    /**
     * @return Collection
     */
    public function getEnrollments(): ?Collection
    {
        return $this->enrollments;
    }

    /**
     * @param Collection $enrollments
     */
    public function setEnrollments(Collection $enrollments)
    {
        $this->enrollments = $enrollments;
    }

    /**
     * @param Enrollment $enrollment
     * @return TuitionRate
     */
    public function addEnrollment(Enrollment $enrollment): self
    {
        $this->enrollments->add($enrollment);
        $enrollment->setTuitionRate($this);
        return $this;
    }

    /**
     * @param Enrollment $enrollment
     * @return TuitionRate
     */
    public function removeEnrollment(Enrollment $enrollment): self
    {
        if ($this->enrollments->contains($enrollment)) {
            $this->enrollments->removeElement($enrollment);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($enrollment->getTuitionRate() === $this) {
                $enrollment->setTuitionRate(null);
            }
        }
        return $this;
    }
}
