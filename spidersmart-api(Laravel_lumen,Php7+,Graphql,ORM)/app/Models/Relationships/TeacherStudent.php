<?php

namespace App\Models\Relationships;

use App\Contracts\ExpiresModel;
use App\Contracts\IdentifiableModel;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Primary\Teacher;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="teacher_student")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 */
class TeacherStudent implements IdentifiableModel
{
    use ModelExpires;
    use ModelEntity;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Teacher", inversedBy="students")
     * @ORM\JoinColumn(name="teacher_id", referencedColumnName="id")
     */
    protected $teacher;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Student", inversedBy="teachers", fetch="EAGER")
     * @ORM\JoinColumn(name="student_id", referencedColumnName="id")
     */
    protected $student;

    /**
     * @return Teacher
     */
    public function getTeacher(): ?Teacher
    {
        return $this->teacher;
    }

    /**
     * @param Teacher $teacher
     */
    public function setTeacher(Teacher $teacher)
    {
        $this->teacher = $teacher;
    }

    /**
     * @return Student
     */
    public function getStudent(): ?Student
    {
        return $this->student;
    }

    /**
     * @param Student $student
     */
    public function setStudent(Student $student)
    {
        $this->student = $student;
    }

    /**
     * This relationship maps students to teachers, however teachers are the owning side and therefore are the only mutating side
     * e.g. a teacher can add a student, but a student can't add a teacher - this id provides an accessor method to the student id
     * which can be used for mutation comparisons
     * @return int
     */
    public function getId(): ?int
    {
        return $this->student->getId();
    }
}
