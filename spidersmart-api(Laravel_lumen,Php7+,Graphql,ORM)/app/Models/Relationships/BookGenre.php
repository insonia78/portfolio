<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Primary\Genre;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="book_genre")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class BookGenre implements ExpiresModel
{
    use ModelExpires;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Book", inversedBy="genres")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Genre", inversedBy="books")
     * @ORM\JoinColumn(name="genre_id", referencedColumnName="id")
     */
    protected $genre;

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
     * @return Genre
     */
    public function getGenre(): ?Genre
    {
        return $this->genre;
    }

    /**
     * @param Genre $genre
     */
    public function setGenre(Genre $genre)
    {
        $this->genre = $genre;
    }

    /**
     * This relationship maps genres to books, however books are the owning side and therefore are the only mutating side
     * e.g. a book can add a genre, but a genre can't add a book - this id provides an accessor method to the genre id
     * which can be used for mutation comparisons
     * @return int
     */
    public function getId(): ?int
    {
        return $this->genre->getId();
    }
}
