<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Models\Relationships\BookAuthor;
use App\Models\Relationships\BookGenre;
use App\Models\Relationships\BookPublisher;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Models\Entities\Primary\Author;
use App\Models\Entities\Primary\Genre;
use App\Models\Entities\Primary\Publisher;

/**
 * @ORM\Entity
 * @ORM\Table(name="book")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Book implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\OneToOne(targetEntity="\App\Models\Entities\Primary\Level", mappedBy="book")
     * @ORM\JoinColumn(name="level_id", referencedColumnName="id")
     */
    protected $level;

    /**
     * @ORM\Column(type="string")
     */
    protected $title;

    /**
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\Column(type="string")
     */
    protected $isbn;

    /**
     * @ORM\Column(type="string")
     */
    protected $coverImage;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToOne(targetEntity="\App\Models\Entities\Primary\Assignment", mappedBy="book")
     */
    protected $assignment;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\BookAuthor", mappedBy="book", cascade={"persist"})
     */
    protected $authors;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\BookGenre", mappedBy="book", cascade={"persist"})
     */
    protected $genres;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\BookPublisher", mappedBy="book", cascade={"persist"})
     */
    protected $publishers;

    public function __construct()
    {
        $this->authors = new ArrayCollection();
        $this->genres = new ArrayCollection();
        $this->publishers = new ArrayCollection();
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
     * @param string $description
     */
    public function setDescription(string $description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getIsbn(): ?string
    {
        return $this->isbn;
    }

    /**
     * @param string $isbn
     */
    public function setIsbn(string $isbn)
    {
        $this->isbn = $isbn;
    }

    /**
     * @return string
     */
    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    /**
     * @param string $coverImage
     */
    public function setCoverImage(string $coverImage)
    {
        $this->coverImage = $coverImage;
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
     * @return Collection
     */
    public function getBookAuthors(): ?Collection
    {
        return $this->authors;
    }

    /**
     * @return Collection
     */
    public function getAuthors(): ?Collection
    {
        return $this->authors->map(function (BookAuthor $author) {
            return $author->getAuthor();
        });
    }

    /**
     * @param Author $author
     * @return Book
     */
    public function addAuthor(Author $author): self
    {
        // make sure the author isn't already connected
        foreach ($this->authors->getValues() as $bookAuthor) {
            if ($bookAuthor->getAuthor() === $author) {
                return $this;
            }
        }
        $bookAuthor = new BookAuthor();
        $bookAuthor->setAuthor($author);
        $bookAuthor->setBook($this);
        $this->authors->add($bookAuthor);
        return $this;
    }

    /**
     * @param Author $author
     * @return Book
     */
    public function removeAuthor(Author $author): self
    {
        foreach ($this->authors->getValues() as $bookAuthor) {
            if ($bookAuthor->getAuthor() === $author) {
                $this->authors->removeElement($bookAuthor);
                $bookAuthor->setDateTo(new DateTime());
            }
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getBookGenres(): ?Collection
    {
        return $this->genres;
    }

    /**
     * @return Collection
     */
    public function getGenres(): ?Collection
    {
        return $this->genres->map(function (BookGenre $genre) {
            return $genre->getGenre();
        });
    }

    /**
     * @param Genre $genre
     * @return Book
     */
    public function addGenre(Genre $genre): self
    {
        // make sure the genre isn't already connected
        foreach ($this->genres->getValues() as $bookGenre) {
            if ($bookGenre->getGenre() === $genre) {
                return $this;
            }
        }
        $bookGenre = new BookGenre();
        $bookGenre->setGenre($genre);
        $bookGenre->setBook($this);
        $this->genres->add($bookGenre);
        return $this;
    }

    /**
     * @param Genre $genre
     * @return Book
     */
    public function removeGenre(Genre $genre): self
    {
        foreach ($this->genres->getValues() as $bookGenre) {
            if ($bookGenre->getGenre() === $genre) {
                $this->genres->removeElement($bookGenre);
                $bookGenre->setDateTo(new DateTime());
            }
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getBookPublishers(): ?Collection
    {
        return $this->publishers;
    }

    /**
     * @return Collection
     */
    public function getPublishers(): ?Collection
    {
        return $this->publishers->map(function (BookPublisher $publisher) {
            return $publisher->getPublisher();
        });
    }

    /**
     * @param Publisher $publisher
     * @return Book
     */
    public function addPublisher(Publisher $publisher): self
    {
        // make sure the publisher isn't already connected
        foreach ($this->publishers->getValues() as $bookPublisher) {
            if ($bookPublisher->getPublisher() === $publisher) {
                return $this;
            }
        }
        $bookPublisher = new BookPublisher();
        $bookPublisher->setPublisher($publisher);
        $bookPublisher->setBook($this);
        $this->publishers->add($bookPublisher);
        return $this;
    }

    /**
     * @param Publisher $publisher
     * @return Book
     */
    public function removePublisher(Publisher $publisher): self
    {
        foreach ($this->publishers->getValues() as $bookPublisher) {
            if ($bookPublisher->getPublisher() === $publisher) {
                $this->publishers->removeElement($bookPublisher);
                $bookPublisher->setDateTo(new DateTime());
            }
        }
        return $this;
    }
}
