<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Teacher;
use App\Models\Entities\Primary\User;
use League\Fractal\Resource\Collection;

class TeacherTransformer extends UserTransformer
{
    /**
     * TeacherTransformer constructor.
     * Extend the available includes to incorporate additional potential includes at the teacher level
     */
    public function __construct()
    {
        $this->availableIncludes = array_merge($this->availableIncludes, [
            'students'
        ]);
    }

    /**
     * Transform the given entity into a data array
     *
     * @param User $teacher The teacher to transform
     * @todo PHP 7.x will not allow the parameter to be defined as Teacher despite it extending User
     *       PHP 8.x supports union types however, so we after its release and upgrade, we can change this back to Teacher
     *       and change the parameter in UserTransformer::transform() to User|Teacher|...
     * @return array The transformed data
     */
    public function transform(User $teacher): array
    {
        // start generating the transform array with basic user properties
        $outputMap = $this->getOutputMap($teacher);

        return $this->parseTransformer($teacher, $outputMap);
    }

    /**
     * Defines what contacts will look like when included in the transformation
     *
     * @param  Teacher $teacher The user for which to include contacts
     * @return Collection
     */
    public function includeStudents(Teacher $teacher): Collection
    {
        $students = $teacher->getTeacherStudents() ?? [];
        return $this->collection($students, new TeacherStudentTransformer());
    }
}
