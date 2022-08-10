<?php

namespace App\Transformers;

use App\Models\Entities\Primary\User;
use App\Models\Entities\Primary\Student;
use League\Fractal\Resource\Collection;

class StudentTransformer extends UserTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'addresses', 'enrollments', 'contacts', 'books'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param Student $student The student to transform
     * @todo PHP 7.x will not allow the parameter to be defined as Student despite it extending User
     *       PHP 8.x supports union types however, so we after its release and upgrade, we can change this back to Student
     *       and change the parameter in UserTransformer::transform() to User|Student|...
     * @return array The transformed data
     */
    public function transform(Student $student): array
    {
        $outputMap = array_merge($this->getOutputMap($student), [
            'dateOfBirth' => $this->formatDate($student->getDateOfBirth()),
            'gender' => $student->getGender(),
            'school' => $student->getSchool()
        ]);
        return $this->parseTransformer($student, $outputMap);
    }

    /**
     * Defines what genres will look like when included in the transformation
     *
     * @param Student $student The student for which to include book checkouts
     * @return Collection
     */
    public function includeBooks(Student $student): Collection
    {
        $books = $student->getBooks();
        return $this->collection($books, new BookCheckoutTransformer());
    }
}
