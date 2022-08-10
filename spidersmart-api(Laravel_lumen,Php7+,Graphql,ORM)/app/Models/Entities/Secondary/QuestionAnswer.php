<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\VersionedModel;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="question_answer")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class QuestionAnswer implements VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Secondary\Question", inversedBy="question_answer")
     * @ORM\JoinColumn(name="question_id", referencedColumnName="id")
     */
    protected $question;

    /**
     * @ORM\Column(type="string")
     */
    protected $answer;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isCorrect;

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
    public function isCorrect(): ?bool
    {
        return $this->isCorrect;
    }

    /**
     * @param bool $correct
     */
    public function setCorrect(bool $correct)
    {
        $this->isCorrect = $correct;
    }
}
