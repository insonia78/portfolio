<?php

namespace App\Models\Entities\Primary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Contracts\VersionedModel;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\Mapping as ORM;
use App\Models\Entities\Primary\Student;
use App\Models\Relationships\TeacherStudent;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use DateTime;

use function Amp\Iterator\toArray;

/**
 * @ORM\Entity
 * @ORM\Table(name="teacher")
 */
class Teacher extends User implements IdentifiableModel, VersionedModel
{
    /**
     * @ORM\OneToMany(targetEntity="\App\Models\Relationships\TeacherStudent", mappedBy="teacher", fetch="EAGER", cascade={"persist"})
     */
    protected $students;

    public function __construct()
    {
        parent::__construct();
        $this->students = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getTeacherStudents(): ?Collection
    {
        return $this->students->filter(function (TeacherStudent $student) {
            try {
                if (!is_null($student->getStudent()) && !is_null($student->getStudent()->getDateFrom())) {
                    return true;
                }
            } catch (EntityNotFoundException $e) {
                return false;
            }
        });
    }

    /**
     * @return Collection
     */
    public function getStudents(): ?Collection
    {
        return $this->students->map(function (TeacherStudent $student) {
            return $student->getStudent();
        });
    }

    /**
     * @param Student $student
     * @return Teacher
     */
    public function addStudent(Student $student): self
    {
        // make sure the student isn't already connected
        foreach ($this->students->getValues() as $teacherStudent) {
            if ($teacherStudent->getStudent() === $student) {
                return $this;
            }
        }
        $teacherStudent = new TeacherStudent();
        $teacherStudent->setStudent($student);
        $teacherStudent->setTeacher($this);
        $this->students->add($teacherStudent);
        return $this;
    }

    /**
     * @param Student $student
     * @return Teacher
     */
    public function removeStudent(Student $student): self
    {
        foreach ($this->students->getValues() as $teacherStudent) {
            if ($teacherStudent->getStudent() === $student) {
                $this->students->removeElement($teacherStudent);
                $teacherStudent->setDateTo(new DateTime());
            }
        }
        return $this;
    }
}
