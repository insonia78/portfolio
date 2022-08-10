<?php

namespace App\Models\Entities\Relation;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Models\Entities\Primary\Assignment;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Primary\Center;
use App\Models\Entities\Primary\Level;
use App\Models\Entities\Primary\TuitionRate;
use App\Models\Entities\Primary\User;
use App\Models\Entities\Secondary\AssignmentSubmission;
use App\Models\Entities\Secondary\BookCheckout;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use DateTime;

/**
 * @ORM\Entity
 * @ORM\Table(name="enrollment")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Enrollment implements IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\User", inversedBy="enrollments")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Center", inversedBy="enrollments")
     * @ORM\JoinColumn(name="center_id", referencedColumnName="id")
     */
    protected $center;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Level", inversedBy="enrollments")
     * @ORM\JoinColumn(name="level_id", referencedColumnName="id")
     */
    protected $level;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\TuitionRate", inversedBy="enrollments")
     * @ORM\JoinColumn(name="tuition_rate_id", referencedColumnName="id")
     */
    protected $tuitionRate;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\BookCheckout", mappedBy="enrollment", cascade={"persist"})
     */
    protected $books;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\AssignmentSubmission", mappedBy="enrollment", fetch="EAGER")
     */
    protected $assignments;

    /**
     * @ORM\Column(type="integer")
     * NOTE: this is necessary to allow filtering by user on enrollments - since user is extended, it will automatically add joins to the table
     *       so filtering by the join results in a duplicate key issue in the generated SQL.  This is a known issue with Doctrine in this specific
     *       scenario, so the id can be exposed directly as a comparator thereby allowing the comparison without a second join on user.
     */
    protected $userId;

    public function __construct()
    {
        $this->books = new ArrayCollection();
        $this->assignments = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getUserId(): ?int
    {
        return $this->userId;
    }

    /**
     * @param int $id
     */
    public function setUserId(int $id)
    {
        $this->userId = $id;
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
     * @return Level
     */
    public function getLevel(): ?Level
    {
        return $this->level;
    }

    /**
     * @param Level|null $level
     */
    public function setLevel(?Level $level)
    {
        $this->level = $level;
    }

    /**
     * @return TuitionRate
     */
    public function getTuitionRate(): ?TuitionRate
    {
        return $this->tuitionRate;
    }

    /**
     * @param TuitionRate $tuitionRate
     */
    public function setTuitionRate(TuitionRate $tuitionRate)
    {
        $this->tuitionRate = $tuitionRate;
    }

    /**
     * @return Collection
     */
    public function getBookCheckouts(): ?Collection
    {
        return $this->books;
    }

    /**
     * @return Collection
     */
    public function getBooks(): ?Collection
    {
        return $this->books->map(function (BookCheckout $book) {
            return $book->getBook();
        });
    }

    /**
     * @param Book $book
     * @return Enrollment
     */
    public function addBook(Book $book): self
    {
        // make sure the book isn't already connected
        foreach ($this->books->getValues() as $bookCheckout) {
            if ($bookCheckout->getBook() === $book) {
                return $this;
            }
        }
        $bookCheckout = new BookCheckout();
        $bookCheckout->setBook($book);
        $bookCheckout->setEnrollment($this);
        $this->books->add($bookCheckout);
        return $this;
    }

    /**
     * @param Book $book
     * @return Enrollment
     */
    public function removeBook(Book $book): self
    {
        foreach ($this->books->getValues() as $bookCheckout) {
            if ($bookCheckout->getBook() === $book) {
                $this->books->removeElement($bookCheckout);
                $bookCheckout->setDateTo(new DateTime());
            }
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getAssignmentSubmissions(): ?Collection
    {
        return $this->assignments;
    }

    /**
     * @return Collection
     */
    public function getAssignments(): ?Collection
    {
        return $this->assignments->map(function (AssignmentSubmission $assignment) {
            return $assignment->getAssignment();
        });
    }

    /**
     * @param Assignment $assignment
     * @return Enrollment
     */
    public function addAssignment(Assignment $assignment): self
    {
        // make sure the assignment isn't already connected
        foreach ($this->assignments->getValues() as $assignmentSubmission) {
            if ($assignmentSubmission->getAssignment() === $assignment) {
                return $this;
            }
        }
        $assignmentSubmission = new AssignmentSubmission();
        $assignmentSubmission->setAssignment($assignment);
        $assignmentSubmission->setEnrollment($this);
        $this->assignments->add($assignmentSubmission);
        return $this;
    }

    /**
     * @param Assignment $assignment
     * @return Enrollment
     */
    public function removeAssignment(Assignment $assignment): self
    {
        foreach ($this->assignments->getValues() as $assignmentSubmission) {
            if ($assignmentSubmission->getAssignment() === $assignment) {
                $this->assignments->removeElement($assignmentSubmission);
                $assignmentSubmission->setDateTo(new DateTime());
            }
        }
        return $this;
    }
}
