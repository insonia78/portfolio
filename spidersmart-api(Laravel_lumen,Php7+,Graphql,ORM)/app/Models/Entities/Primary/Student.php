<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use App\Helpers\RepositoryFilter;
use App\Models\Entities\Secondary\BookCheckout;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="student")
 */
class Student extends User implements IdentifiableModel, VersionedModel
{
    /**
     * @ORM\Column(type="datetime", name="dob", nullable=true)
     */
    protected $dateOfBirth;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $gender;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $school;

    /**
     * @return DateTime|null
     */
    public function getDateOfBirth(): ?DateTime
    {
        return $this->dateOfBirth;
    }

    /**
     * @param DateTime|null $dateOfBirth
     */
    public function setDateOfBirth(?DateTime $dateOfBirth)
    {
        $this->dateOfBirth = $dateOfBirth;
    }

    /**
     * @return string|null
     */
    public function getGender(): ?string
    {
        return $this->gender;
    }

    /**
     * @param string|null $gender
     */
    public function setGender(?string $gender)
    {
        if (!isset($gender) || empty($gender)) {
            $gender = null;
        }
        $this->gender = $gender;
    }

    /**
     * @return string|null
     */
    public function getSchool(): ?string
    {
        return $this->school;
    }

    /**
     * @param string|null $school
     */
    public function setSchool(?string $school)
    {
        $this->school = $school;
    }

    /**
     * @return Collection
     */
    public function getBooks(): Collection
    {
        $books = [];
        foreach ($this->enrollments as $enrollment) {
            $books = array_merge($books, $enrollment->getBookCheckouts()->toArray());
        }
        return new ArrayCollection($books);
    }
}
