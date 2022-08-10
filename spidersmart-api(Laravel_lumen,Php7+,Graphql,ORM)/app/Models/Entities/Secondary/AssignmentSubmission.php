<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Models\Derived\AssignmentSubmissionView;
use App\Models\Entities\Primary\Assignment;
use App\Models\Entities\Relation\Enrollment;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="assignment_submission")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class AssignmentSubmission implements VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Relation\Enrollment", inversedBy="assignments")
     * @ORM\JoinColumn(name="enrollment_id", referencedColumnName="id")
     */
    protected $enrollment;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Assignment", fetch="EAGER")
     * @ORM\JoinColumn(name="assignment_id", referencedColumnName="id")
     */
    protected $assignment;

    /**
     * @ORM\Column(type="integer")
     * This only exists for certain assignment types and is only referenced internally when performing side-effect
     * This is no exposed externally at all, if it needs to be in the future, convert to a relationship with the
     * BookCheckout model
     */
    protected $bookCheckoutId = null;

    /**
     * @ORM\Column(type="integer")
     * Note: This one is necessary to allow direct filtering on enrollment id in submission collections
     * @todo Either make this common practice across models to map relation id fields without get/setters OR
     * migrate this to the service layer with custom dql in required accessor calls
     */
    protected $enrollmentId;

    /**
     * @ORM\Column(type="string")
     */
    protected $status;

    /**
     * @ORM\Column(type="string")
     */
    protected $comments;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\AssignmentSubmissionAnswer", mappedBy="submission", fetch="EAGER")
     */
    protected $answers;

    /**
     * Stores the last non-draft version of the assignment if current version is a draft
     * This is a derived field and does not map to the database at all
     * @var AssignmentSubmissionView|null
     */
    protected $lastNonDraft = null;

    public function __construct()
    {
        $this->answers = new ArrayCollection();
    }

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
     * @return Assignment
     */
    public function getAssignment(): ?Assignment
    {
        return $this->assignment;
    }

    /**
     * @param Assignment $assignment
     */
    public function setAssignment(Assignment $assignment)
    {
        $this->assignment = $assignment;
    }

    /**
     * @return int|null
     */
    public function getBookCheckoutId(): ?int
    {
        return $this->bookCheckoutId;
    }

    /**
     * @param int|null $bookCheckoutId
     */
    public function setBookCheckoutId(?int $bookCheckoutId): void
    {
        $this->bookCheckoutId = $bookCheckoutId;
    }

    /**
     * @return string
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     */
    public function setStatus(string $status)
    {
        $this->status = $status;
    }

    /**
     * @return string
     */
    public function getComments(): ?string
    {
        return $this->comments;
    }

    /**
     * @param string|null $comments
     */
    public function setComments(?string $comments)
    {
        $this->comments = $comments;
    }

    /**
     * @return Collection
     */
    public function getAnswers(): ?Collection
    {
        return $this->answers;
    }

    /**
     * @param Collection $answers
     */
    public function setAnswers(Collection $answers)
    {
        $this->answers = $answers;
    }

    /**
     * @param AssignmentSubmissionAnswer $answer
     * @return AssignmentSubmission
     */
    public function addAnswer(AssignmentSubmissionAnswer $answer): self
    {
        $this->answers->add($answer);
        $answer->setSubmission($this);
        return $this;
    }

    /**
     * @param AssignmentSubmissionAnswer $answer
     * @return AssignmentSubmission
     */
    public function removeAnswer(AssignmentSubmissionAnswer $answer): self
    {
        if ($this->answers->contains($answer)) {
            $this->answers->removeElement($answer);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($answer->getSubmission() === $this) {
                $answer->expire();
            }
        }
        return $this;
    }

    /**
     * @return AssignmentSubmissionView
     */
    public function getLastNonDraft(): ?AssignmentSubmissionView
    {
        return $this->lastNonDraft;
    }

    /**
     * @param AssignmentSubmissionView|null $lastNonDraft
     */
    public function setLastNonDraft(?AssignmentSubmissionView $lastNonDraft)
    {
        $this->lastNonDraft = $lastNonDraft;
    }
}
