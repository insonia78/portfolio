<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use DateTime;

/**
 * @ORM\Entity
 * @ORM\Table(name="assignment_submission_answer")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class AssignmentSubmissionAnswer implements ExpiresModel, IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Secondary\AssignmentSubmission", inversedBy="answers")
     * @ORM\JoinColumn(name="assignment_submission_id", referencedColumnName="id")
     */
    protected $submission;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Secondary\Question", fetch="EAGER")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id")
     */
    protected $question;

    /**
     * @ORM\Column(type="string")
     */
    protected $answer;

    /**
     * @ORM\Column(type="string")
     */
    protected $correction;

    /**
     * @ORM\Column(type="string")
     */
    protected $comments;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    protected $isCorrect = null;

    /**
     * @ORM\Column(type="integer")
     * NOTE: this is necessary to allow looking up of answers at a point in time for the submission without reconnecting the submission
     * relation each time
     */
    protected $assignmentSubmissionId;

    /**
     * @return AssignmentSubmission
     */
    public function getSubmission(): ?AssignmentSubmission
    {
        return $this->submission;
    }

    /**
     * @param AssignmentSubmission $submission
     */
    public function setSubmission(AssignmentSubmission $submission)
    {
        $this->submission = $submission;
    }

    /**
     * @return Question
     */
    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    /**
     * @param Question $question
     */
    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }

    /**
     * @return string $answer
     */
    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    /**
     * @param string|null $answer
     */
    public function setAnswer(?string $answer)
    {
        $this->answer = $answer;
    }

    /**
     * @return string
     */
    public function getCorrection(): ?string
    {
        return $this->correction;
    }

    /**
     * @param string|null $correction
     */
    public function setCorrection(?string $correction): void
    {
        $this->correction = $correction;
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
     * @return bool|null
     */
    public function isCorrect(): ?bool
    {
        return $this->isCorrect;
    }

    /**
     * @param bool|null $isCorrect
     */
    public function setCorrect(?bool $isCorrect): void
    {
        $this->isCorrect = $isCorrect;
    }

    /**
     * Method to allow expiration of the answer
     */
    public function expire(): void
    {
        $this->setDateTo(new DateTime());
    }
}
