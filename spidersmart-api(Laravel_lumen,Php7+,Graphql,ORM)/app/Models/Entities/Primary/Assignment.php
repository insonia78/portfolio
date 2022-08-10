<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Models\Entities\Secondary\AssignmentFile;
use App\Models\Entities\Secondary\AssignmentSection;
use App\Models\Entities\Secondary\Question;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="assignment")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Assignment implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\OneToOne(targetEntity="\App\Models\Entities\Primary\Level", mappedBy="assignment", fetch="EAGER")
     * @ORM\JoinColumn(name="level_id", referencedColumnName="id")
     */
    protected $level;

    /**
     * @ORM\OneToOne(targetEntity="\App\Models\Entities\Primary\Book", inversedBy="assignment", fetch="EAGER")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\AssignmentFile", mappedBy="assignment")
     */
    protected $files;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\Question", mappedBy="assignment")
     */
    protected $questions;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\AssignmentSection", mappedBy="assignment")
     */
    protected $sections;

    public function __construct()
    {
        $this->files = new ArrayCollection();
        $this->questions = new ArrayCollection();
        $this->sections = new ArrayCollection();
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
     * @param string|null $description
     */
    public function setDescription(?string $description)
    {
        $this->description = $description;
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
     * @return Book
     */
    public function getBook(): ?Book
    {
        return $this->book;
    }

    /**
     * @param Book $book
     */
    public function setBook(Book $book)
    {
        $this->book = $book;
    }

    /**
     * @return Collection
     */
    public function getQuestions(): ?Collection
    {
        return $this->questions;
    }

    /**
     * @param Collection $questions
     */
    public function setQuestions(Collection $questions)
    {
        $this->questions = $questions;
    }

    /**
     * @param Question $question
     * @return Assignment
     */
    public function addQuestion(Question $question): self
    {
        $this->questions->add($question);
        $question->setAssignment($this);
        return $this;
    }

    /**
     * @param Question $question
     * @return Assignment
     */
    public function removeQuestion(Question $question): self
    {
        if ($this->questions->contains($question)) {
            $this->questions->removeElement($question);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($question->getAssignment() === $this) {
                $question->setAssignment(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getSections(): ?Collection
    {
        return $this->sections;
    }

    /**
     * @param Collection $sections
     */
    public function setSections(Collection $sections)
    {
        $this->sections = $sections;
    }

    /**
     * @param AssignmentSection $section
     * @return Assignment
     */
    public function addSection(AssignmentSection $section): self
    {
        $this->sections->add($section);
        $section->setAssignment($this);
        return $this;
    }

    /**
     * @param AssignmentSection $section
     * @return Assignment
     */
    public function removeSection(AssignmentSection $section): self
    {
        if ($this->sections->contains($section)) {
            $this->sections->removeElement($section);
            $section->setDateTo(new DateTime());
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getFiles(): ?Collection
    {
        return $this->files;
    }

    /**
     * @param Collection $files
     */
    public function setFiles(Collection $files)
    {
        $this->files = $files;
    }

    /**
     * @param AssignmentFile $file
     * @return Assignment
     */
    public function addFile(AssignmentFile $file): self
    {
        $this->files->add($file);
        $file->setAssignment($this);
        return $this;
    }

    /**
     * @param AssignmentFile $file
     * @return Assignment
     */
    public function removeFile(AssignmentFile $file): self
    {
        if ($this->files->contains($file)) {
            $this->files->removeElement($file);
            $file->setDateTo(new DateTime());
        }
        return $this;
    }
}
