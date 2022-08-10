<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Models\Relationships\BookAuthor;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\ArrayCollection;
use App\Models\Entities\Primary\Book;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity
 * @ORM\Table(name="author")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Author implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\BookAuthor", mappedBy="author", cascade={"persist"}, fetch="EAGER")
     */
    protected $books;

    /**
     * Author constructor.
     */
    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name)
    {
        $this->name = $name;
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
     * @return Collection
     */
    public function getBooks(): Collection
    {
        return $this->books;
    }

    /**
     * @param Collection $books
     *
    public function setBooks(Collection $books)
    {
        $this->books = $books;
    }

    /**
     * @param Book $book
     * @return Author
     *
    public function addBook(Book $book): self
    {
        $bookAuthor = new BookAuthor();
        $bookAuthor->setAuthor($this);
        $bookAuthor->setBook($book);
        $this->books->add($bookAuthor);
        return $this;
    }

    /**
     * @param Book $book
     * @return Author
     *
    public function removeBook(Book $book): self
    {
        if ($this->books->contains($book)) {
            $this->books->removeElement($book);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($book->getAuthors()->contains($this)) {
                $book->removeAuthor($this);
            }
        }
        return $this;
    }*/
}
