<?php

namespace App\Models\Entities\Relation;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Models\Entities\Secondary\FamilyAddress;
use App\Models\Entities\Secondary\FamilyContact;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use App\Models\Entities\Primary\User;

/**
 * @ORM\Entity
 * @ORM\Table(name="family")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class Family implements IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\FamilyUser", mappedBy="family", cascade={"persist"}, fetch="EAGER")
     */
    protected $users;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\FamilyAddress", mappedBy="family")
     */
    protected $addresses;

    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Entities\Secondary\FamilyContact", mappedBy="family")
     */
    protected $contacts;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->addresses = new ArrayCollection();
        $this->contacts = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getUsers(): ?Collection
    {
        return $this->users;
    }

    /**
     * @param Collection $users
     */
    public function setUsers(Collection $users)
    {
        $this->users = $users;
    }

    /**
     * @param User $user
     * @return Family
     */
    public function addUser(User $user): self
    {
        $this->users->add($user);
        // $user->setFamily($user);
        return $this;
    }

    /**
     * @return Collection
     */
    public function getAddresses(): ?Collection
    {
        return $this->addresses;
    }

    /**
     * @param Collection $addresses
     */
    public function setAddresses(Collection $addresses)
    {
        $this->addresses = $addresses;
    }

    /**
     * @param FamilyAddress $address
     * @return Family
     */
    public function addAddress(FamilyAddress $address): self
    {
        $this->addresses->add($address);
        // $address->setFamily($this);
        return $this;
    }

    /**
     * @return Collection
     */
    public function getContacts(): ?Collection
    {
        return $this->contacts;
    }

    /**
     * @param Collection $contacts
     */
    public function setContacts(Collection $contacts)
    {
        $this->contacts = $contacts;
    }

    /**
     * @param FamilyContact $contact
     * @return Family
     */
    public function addContact(FamilyContact $contact)
    {
        $this->contacts->add($contact);
        // $contact->setFamily($this);
        return $this;
    }
}
