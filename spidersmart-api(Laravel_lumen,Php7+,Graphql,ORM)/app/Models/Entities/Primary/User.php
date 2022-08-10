<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use App\Traits\ModelVersioning;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Gedmo\Mapping\Annotation as Gedmo;
use App\Models\Entities\Relation\Enrollment;
use App\Models\Entities\Secondary\UserAddress;
use App\Models\Entities\Secondary\UserContact;
use DateTime;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({
 *     "user" = "\App\Models\Entities\Primary\User",
 *     "administrator" = "\App\Models\Entities\Primary\Administrator",
 *     "director" = "\App\Models\Entities\Primary\Director",
 *     "teacher" = "\App\Models\Entities\Primary\Teacher",
 *     "guardian" = "\App\Models\Entities\Primary\Guardian",
 *     "student" = "\App\Models\Entities\Primary\Student"
 * })
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class User implements IdentifiableModel, VersionedModel
{
    use ModelEntity;
    use ModelExpires;
    use ModelVersioning;

    /**
     * @ORM\Column(type="string")
     */
    protected $prefix;

    /**
     * @ORM\Column(type="string")
     */
    protected $firstName;

    /**
     * @ORM\Column(type="string")
     */
    protected $middleName;

    /**
     * @ORM\Column(type="string")
     */
    protected $lastName;

    /**
     * @ORM\Column(type="string")
     */
    protected $suffix;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $isActive = true;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\UserAddress", mappedBy="user")
     */
    protected $addresses;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\UserContact", mappedBy="user")
     */
    protected $contacts;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Relation\Enrollment", mappedBy="user", cascade={"persist"})
     */
    protected $enrollments;

    /**
     * User constructor.
     */
    public function __construct()
    {
        $this->addresses = new ArrayCollection();
        $this->contacts = new ArrayCollection();
        $this->enrollments = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getPrefix(): ?string
    {
        return $this->prefix;
    }

    /**
     * @param string|null $prefix
     */
    public function setPrefix(?string $prefix)
    {
        $this->prefix = $prefix;
    }

    /**
     * @return string
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     */
    public function setFirstName(string $firstName)
    {
        $this->firstName = $firstName;
    }

    /**
     * @return string
     */
    public function getMiddleName(): ?string
    {
        return $this->middleName;
    }

    /**
     * @param string|null $middleName
     */
    public function setMiddleName(?string $middleName)
    {
        $this->middleName = $middleName;
    }

    /**
     * @return string
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     */
    public function setLastName(string $lastName)
    {
        $this->lastName = $lastName;
    }

    /**
     * @return string
     */
    public function getSuffix(): ?string
    {
        return $this->suffix;
    }

    /**
     * @param string|null $suffix
     */
    public function setSuffix(?string $suffix)
    {
        $this->suffix = $suffix;
    }

    /**
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    /**
     * @return Collection
     */
    public function getAddresses(): Collection
    {
        return $this->addresses;
    }

    /**
     * @param UserAddress $address
     * @return User
     */
    public function addAddress(UserAddress $address): self
    {
        $this->addresses->add($address);
        $address->setUser($this);
        return $this;
    }

    /**
     * @param UserAddress $address
     * @return User
     */
    public function removeAddress(UserAddress $address): self
    {
        if ($this->addresses->contains($address)) {
            $this->addresses->removeElement($address);
            $address->setDateTo(new DateTime());
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getContacts(): Collection
    {
        return $this->contacts;
    }

    /**
     * @param UserContact $contact
     * @return User
     */
    public function addContact(UserContact $contact): self
    {
        $this->contacts->add($contact);
        $contact->setUser($this);
        return $this;
    }

    /**
     * @param UserContact $contact
     * @return User
     */
    public function removeContact(UserContact $contact): self
    {
        if ($this->contacts->contains($contact)) {
            $this->contacts->removeElement($contact);
            $contact->setDateTo(new DateTime());
        }
        return $this;
    }

    /**
     * @return Collection
     */
    public function getEnrollments(): Collection
    {
        return $this->enrollments;
    }

    /**
     * @param Collection $enrollments
     */
    public function setEnrollments(Collection $enrollments)
    {
        $this->enrollments = $enrollments;
    }

    /**
     * @param Enrollment $enrollment
     * @return User
     */
    public function addEnrollment(Enrollment $enrollment): self
    {
        $this->enrollments->add($enrollment);
        $enrollment->setUser($this);
        return $this;
    }

    /**
     * @param Enrollment $enrollment
     * @return User
     */
    public function removeEnrollment(Enrollment $enrollment): self
    {
        if ($this->enrollments->contains($enrollment)) {
            $this->enrollments->removeElement($enrollment);
            $enrollment->setDateTo(new DateTime());
        }
        return $this;
    }

    /**
     * Criteria to filter based on given center id
     * @param string|string[] $centerId
     * @return bool
     */
    public function criteriaCenter($centerId): bool
    {
        $centerId = (is_array($centerId)) ? $centerId : [$centerId];
        return $this->getEnrollments()->filter(
            function ($enrollment) use ($centerId) {
                return (!is_null($enrollment->getCenter()) && in_array($enrollment->getCenter()->getId(), $centerId));
            }
        )->count() > 0;
    }
}
