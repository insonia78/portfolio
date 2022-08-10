<?php

namespace App\Models\Entities\Relation;

use App\Contracts\ExpiresModel;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Primary\Center;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="center_book")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class CenterBook implements IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Center", inversedBy="books")
     * @ORM\JoinColumn(name="center_id", referencedColumnName="id")
     */
    protected $center;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Book", fetch="EAGER")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id")
     */
    protected $book;

    /**
     * @ORM\Column(type="integer")
     */
    protected $quantity;

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
     * @return int
     */
    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    /**
     * @param int $quantity
     */
    public function setQuantity(int $quantity)
    {
        $this->quantity = $quantity;
    }
}
