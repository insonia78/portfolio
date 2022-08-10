<?php

namespace App\Models\Derived;

use App\Contracts\VersionedModel;
use App\Models\Entities\Secondary\AssignmentSubmission;
use App\Models\Entities\Secondary\AssignmentSubmissionAnswer;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class AssignmentSubmissionView implements VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @var string The status of the submission
     */
    protected $status;

    /**
     * @var string The submission comments
     */
    protected $comments;

    /**
     * @var AssignmentSubmissionAnswer[] The answers that were submitted with this submission
     */
    protected $answers = [];

    /**
     * Instantiates an instance of the class from an array of properties
     * @param array $inputs
     * @return AssignmentSubmissionView The updated view after applying inputs
     */
    public function fromArray(array $inputs = []): AssignmentSubmissionView
    {
        if (array_key_exists('id', $inputs)) {
            $this->setId($inputs['id']);
        }
        if (array_key_exists('status', $inputs)) {
            $this->setStatus($inputs['status']);
        }
        if (array_key_exists('comments', $inputs)) {
            $this->setComments($inputs['comments']);
        }
        if (array_key_exists('date_from', $inputs)) {
            $this->setDateFrom(new DateTime($inputs['date_from']));
        }
        if (array_key_exists('date_to', $inputs)) {
            $this->setDateTo(new DateTime($inputs['date_to']));
        }
        if (array_key_exists('answers', $inputs)) {
            $this->setAnswers($inputs['answers']);
        }
        return $this;
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
     * @return array
     */
    public function getAnswers(): ?array
    {
        return $this->answers;
    }

    /**
     * @param array $answers
     */
    public function setAnswers(array $answers)
    {
        $this->answers = $answers;
    }
}
