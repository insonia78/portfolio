<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Models\Entities\Secondary\CenterHourRange;
use App\Models\Entities\Relation\CenterBook;
use App\Models\Relationships\CenterSubject;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Relation\Enrollment;
use DateTime;

/**
 * @ORM\Entity
 * @ORM\Table(name="center")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Center implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\Column(type="string")
     */
    protected $label;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $streetAddress;

    /**
     * @ORM\Column(type="string")
     */
    protected $city;

    /**
     * @ORM\Column(type="string")
     */
    protected $state;

    /**
     * @ORM\Column(type="string")
     */
    protected $postalCode;

    /**
     * @ORM\Column(type="string")
     */
    protected $country;

    /**
     * @ORM\Column(type="string")
     */
    protected $phone;

    /**
     * @ORM\Column(type="string")
     */
    protected $email;

    /**
     * @ORM\Column(type="float")
     */
    protected $latitude;

    /**
     * @ORM\Column(type="float")
     */
    protected $longitude;

    /**
     * @ORM\Column(type="string")
     */
    protected $timezone;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isVisible = true;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $useInventory = true;

    /**
     * @ORM\Column(type="smallint")
     */
    protected $bookCheckoutLimit = 1;

    /**
     * @ORM\Column(type="string")
     */
    protected $bookCheckoutFrequency = 'weekly';

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\CenterSubject", mappedBy="center", cascade={"persist"}, fetch="EAGER")
     */
    protected $subjects;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\CenterHourRange", mappedBy="center")
     */
    protected $hours;

    /**
     * @  ORM\OneToMany(targetEntity="\App\Models\Entities\Relation\CenterBook", mappedBy="center")
     */
    protected $books;

    /**
     * @ ORM\OneToMany(targetEntity="\App\Models\Entities\Relation\Enrollment", mappedBy="center")
     */
    protected $enrollments;

    public function __construct()
    {
        $this->hours = new ArrayCollection();
        $this->books = new ArrayCollection();
        $this->subjects = new ArrayCollection();
        $this->enrollments = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel(string $label)
    {
        $this->label = $label;
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
     * @return string
     */
    public function getStreetAddress(): ?string
    {
        return $this->streetAddress;
    }

    /**
     * @param string $streetAddress
     */
    public function setStreetAddress(string $streetAddress)
    {
        $this->streetAddress = $streetAddress;
    }

    /**
     * @return string
     */
    public function getCity(): ?string
    {
        return $this->city;
    }

    /**
     * @param string $city
     */
    public function setCity(string $city)
    {
        $this->city = $city;
    }

    /**
     * @return string
     */
    public function getState(): ?string
    {
        return $this->state;
    }

    /**
     * @param string $state
     */
    public function setState(string $state)
    {
        $this->state = $state;
    }

    /**
     * @return string
     */
    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    /**
     * @param string $postalCode
     */
    public function setPostalCode(string $postalCode)
    {
        $this->postalCode = $postalCode;
    }

    /**
     * @return string
     */
    public function getCountry(): ?string
    {
        return $this->country;
    }

    /**
     * @param string $country
     */
    public function setCountry(string $country)
    {
        $this->country = $country;
    }

    /**
     * @return string
     */
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    /**
     * @param string $phone
     */
    public function setPhone(string $phone)
    {
        $this->phone = $phone;
    }

    /**
     * @return string
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    /**
     * @return float
     */
    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    /**
     * @param float $latitude
     */
    public function setLatitude(float $latitude): void
    {
        $this->latitude = $latitude;
    }

    /**
     * @return float
     */
    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    /**
     * @param float $longitude
     */
    public function setLongitude(float $longitude): void
    {
        $this->longitude = $longitude;
    }

    /**
     * @return string
     */
    public function getTimezone(): ?string
    {
        return $this->timezone;
    }

    /**
     * @param string $timezone
     */
    public function setTimezone(string $timezone): void
    {
        $this->timezone = $timezone;
    }

    /**
     * @return bool
     */
    public function isVisible(): bool
    {
        return $this->isVisible;
    }

    /**
     * @param bool $isVisible
     */
    public function setVisible(bool $isVisible): void
    {
        $this->isVisible = $isVisible;
    }

    /**
     * @return bool
     */
    public function useInventory(): bool
    {
        return $this->useInventory;
    }

    /**
     * @param bool $useInventory
     */
    public function setUseInventory(bool $useInventory): void
    {
        $this->useInventory = $useInventory;
    }

    /**
     * @return int
     */
    public function getBookCheckoutLimit(): int
    {
        return $this->bookCheckoutLimit;
    }

    /**
     * @param int $bookCheckoutLimit
     */
    public function setBookCheckoutLimit(int $bookCheckoutLimit): void
    {
        $this->bookCheckoutLimit = $bookCheckoutLimit;
    }

    /**
     * @return string
     */
    public function getBookCheckoutFrequency(): string
    {
        return $this->bookCheckoutFrequency;
    }

    /**
     * @param string $bookCheckoutFrequency
     */
    public function setBookCheckoutFrequency(string $bookCheckoutFrequency): void
    {
        $this->bookCheckoutFrequency = $bookCheckoutFrequency;
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
    public function getCenterSubjects(): ?Collection
    {
        return $this->subjects;
    }

    /**
     * @return Collection
     */
    public function getSubjects(): ?Collection
    {
        return $this->subjects->map(function (CenterSubject $subject) {
            return $subject->getSubject();
        });
    }

    /**
     * @param Subject $subject
     * @return Center
     */
    public function addSubject(Subject $subject): self
    {
        // make sure the subject isn't already connected
        foreach ($this->subjects->getValues() as $centerSubject) {
            if ($centerSubject->getSubject() === $subject) {
                return $this;
            }
        }
        $centerSubject = new CenterSubject();
        $centerSubject->setSubject($subject);
        $centerSubject->setCenter($this);
        $this->subjects->add($centerSubject);
        return $this;
    }

    /**
     * @param Subject $subject
     * @return Center
     */
    public function removeSubject(Subject $subject): self
    {
        foreach ($this->subjects->getValues() as $centerSubject) {
            if ($centerSubject->getSubject() === $subject) {
                $this->subjects->removeElement($centerSubject);
                $centerSubject->setDateTo(new DateTime());
            }
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getHours(): Collection
    {
        return $this->hours;
    }

    /**
     * @return Collection
     */
    public function getCenterHourRange(): Collection
    {
        return $this->hours;
    }

    /**
     * @param CenterHourRange $hourRange
     * @return Center
     */
    public function addCenterHourRange(CenterHourRange $hourRange): self
    {
        $this->hours->add($hourRange);
        $hourRange->setCenter($this);
        return $this;
    }

    public function removeCenterHourRange(CenterHourRange $hourRange): self
    {
        if ($this->hours->contains($hourRange)) {
            $this->hours->removeElement($hourRange);
            $hourRange->setDateTo(new DateTime());
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getCenterBooks(): ?Collection
    {
        return $this->books->filter(function (CenterBook $book) {
            return !is_null($book->getBook());
        });
    }

    /**
     * @return Collection
     */
    public function getBooks(): ?Collection
    {
        return $this->books->map(function (CenterBook $book) {
            return $book->getBook();
        });
    }

    /**
     * @param CenterBook $book
     * @return Center
     */
    public function addBook(CenterBook $book): self
    {
        // make sure that the book isn't already connected
        foreach ($this->books->getValues() as $centerBook) {
            if ($centerBook->getBook() === $book->getBook()) {
                // if the book's connected but quantity changed, just updated the quantity - no need to version this change
                if ($centerBook->getQuantity() !== $book->getQuantity()) {
                    $centerBook->setQuantity($book->getQuantity());
                }
                return $this;
            }
        }

//        $centerBook = new CenterBook();
//        $centerBook->setBook($book->getBook());
        $book->setCenter($this);
        $this->books->add($book);
        return $this;
    }

    /**
     * @param CenterBook $book
     * @return Center
     */
    public function removeBook(CenterBook $book): self
    {
        $this->books->removeElement($book);
        $book->setDateTo(new DateTime());
        return $this;
    }

    /**
     * @return Collection
     */
    public function getEnrollments(): ?Collection
    {
        return $this->enrollments;
    }

    /**
     * @param Enrollment $enrollment
     * @return Center
     */
    public function addEnrollment(Enrollment $enrollment): self
    {
        $this->enrollments->add($enrollment);
        $enrollment->setCenter($this);
        return $this;
    }

    /**
     * @param Enrollment $enrollment
     * @return Center
     */
    public function removeEnrollment(Enrollment $enrollment): self
    {
        if ($this->enrollments->contains($enrollment)) {
            $this->enrollments->removeElement($enrollment);

            // TODO:  PERHAPS THIS SHOULD DELETE THE QUESTION INSTEAD OF JUST UNASSIGNING IT
            // CHECK IF THE FK RELATIONSHIP IN THE DATABASE WILL DO THIS FOR US
            if ($enrollment->getCenter() === $this) {
                $enrollment->setCenter(null);
            }
        }
        return $this;
    }
}
