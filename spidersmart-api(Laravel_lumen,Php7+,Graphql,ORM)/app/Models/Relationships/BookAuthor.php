<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Author;
use App\Models\Entities\Primary\Book;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="book_author")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class BookAuthor implements ExpiresModel
{
    use ModelExpires;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Book", inversedBy="authors")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Author", inversedBy="books")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id")
     */
    protected $author;

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
     * @return Author
     */
    public function getAuthor(): ?Author
    {
        return $this->author;
    }

    /**
     * @param Author $author
     */
    public function setAuthor(Author $author)
    {
        $this->author = $author;
    }

    /**
     * This relationship maps authors to books, however books are the owning side and therefore are the only mutating side
     * e.g. a book can add an author, but an author can't add a book - this id provides an accessor method to the author id
     * which can be used for mutation comparisons
     * @return int
     */
    public function getId(): ?int
    {
        return $this->author->getId();
    }
}
