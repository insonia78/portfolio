<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\ExpiresModel;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Relation\Enrollment;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="book_checkout")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class BookCheckout implements ExpiresModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Relation\Enrollment", inversedBy="books")
     * @ORM\JoinColumn(name="enrollment_id", referencedColumnName="id")
     */
    protected $enrollment;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Book", inversedBy="enrollments")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

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
}
