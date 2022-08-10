<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Primary\Publisher;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="book_publisher")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class BookPublisher implements ExpiresModel
{
    use ModelExpires;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Book", inversedBy="publishers")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Publisher", inversedBy="books")
     * @ORM\JoinColumn(name="publisher_id", referencedColumnName="id")
     */
    protected $publisher;

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
     * @return Publisher
     */
    public function getPublisher(): ?Publisher
    {
        return $this->publisher;
    }

    /**
     * @param Publisher $publisher
     */
    public function setPublisher(Publisher $publisher)
    {
        $this->publisher = $publisher;
    }

    /**
     * This relationship maps publishers to books, however books are the owning side and therefore are the only mutating side
     * e.g. a book can add a publisher, but a publisher can't add a book - this id provides an accessor method to the publisher id
     * which can be used for mutation comparisons
     * @return int
     */
    public function getId(): ?int
    {
        return $this->publisher->getId();
    }
}
