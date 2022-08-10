<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\VersionedModel;
use App\Models\Entities\Primary\Assignment;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="question")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */

class Question implements VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Assignment", inversedBy="question")
     * @ORM\JoinColumn(name="assignment_id", referencedColumnName="id")
     */
    protected $assignment;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Secondary\AssignmentSection", inversedBy="questions", fetch="EAGER")
     * @ORM\JoinColumn(name="assignment_section_id", referencedColumnName="id")
     */
    protected $section;

    /**
     * @ORM\Column(type="string")
     */
    protected $type;

    /**
     * @ORM\Column(type="string")
     */
    protected $question;

    /**
     * @ORM\Column(type="string")
     */
    protected $answer;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\QuestionAnswer", mappedBy="question")
     */
    protected $answers;

    public function __construct()
    {
        $this->answers = new ArrayCollection();
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
     * @return string
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type)
    {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getQuestion(): ?string
    {
        return $this->question;
    }

    /**
     * @param string $question
     */
    public function setQuestion(string $question)
    {
        $this->question = $question;
    }

    /**
     * @return string
     */
    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    /**
     * @param string $answer
     */
    public function setAnswer(string $answer)
    {
        $this->answer = $answer;
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
     * @return AssignmentSection
     */
    public function getSection(): ?AssignmentSection
    {
        return $this->section;
    }

    /**
     * @param AssignmentSection $section
     */
    public function setSection(AssignmentSection $section)
    {
        $this->section = $section;
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
     * @param QuestionAnswer $answer
     * @return Question
     */
    public function addAnswer(QuestionAnswer $answer): self
    {
        $this->answers->add($answer);
        $answer->setQuestion($this);
        return $this;
    }

    /**
     * @param QuestionAnswer $answer
     * @return Question
     */
    public function removeAnswer(QuestionAnswer $answer): self
    {
        if ($this->answers->contains($answer)) {
            $this->answers->removeElement($answer);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($answer->getQuestion() === $this) {
                $answer->setQuestion(null);
            }
        }
        return $this;
    }
}
