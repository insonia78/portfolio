<?php

namespace App\Transformers;

use App\Models\Entities\Primary\Center;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Relation\Enrollment;
use League\Fractal\Resource\Collection;

class CenterTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'books', 'enrollments', 'students', 'hours', 'subjects'
    ];

    /**
     * Transform the given entity into a data array
     *
     * @param Center $center The center to transform
     * @return array The transformed data
     */
    public function transform(Center $center): array
    {
        return $this->parseTransformer($center, [
            'id' => $center->getId(),
            'label' => $center->getLabel(),
            'name' => $center->getName(),
            'streetAddress' => $center->getStreetAddress(),
            'city' => $center->getCity(),
            'state' => $center->getState(),
            'postalCode' => $center->getPostalCode(),
            'country' => $center->getCountry(),
            'phone' => $center->getPhone(),
            'email' => $center->getEmail(),
            'latitude' => $center->getLatitude(),
            'longitude' => $center->getLongitude(),
            'timezone' => $center->getTimezone(),
            'visible' => $center->isVisible(),
            'useInventory' => $center->useInventory(),
            'bookCheckoutLimit' => $center->getBookCheckoutLimit(),
            'bookCheckoutFrequency' => $center->getBookCheckoutFrequency(),
            'dateFrom' => $this->formatDate($center->getDateFrom()),
            'dateTo' => $this->formatDate($center->getDateTo()),
            'active' => $center->isActive()
        ]);
    }

    /**
     * Defines what enrollments will look like when included in the transformation
     *
     * @param Center $center The center for which to include enrollments
     * @return Collection
     */
    public function includeEnrollments(Center $center): Collection
    {
        $enrollments = $center->getEnrollments();
        return $this->collection($enrollments, new EnrollmentTransformer());
    }

    /**
     * Defines what students will look like when included in the transformation
     *
     * @param Center $center The center for which to include enrollments
     * @return Collection
     */
    public function includeStudents(Center $center): Collection
    {
        $students = $center->getEnrollments()
            ->filter(function (Enrollment $enrollment) {
                return (is_a($enrollment->getUser(), Student::class));
            })->map(function (Enrollment $enrollment) {
                return $enrollment->getUser();
            });
        return $this->collection($students, new StudentTransformer());
    }

    /**
     * Defines what books will look like when included in the transformation
     *
     * @param Center $center The center for which to include books
     * @return Collection
     */
    public function includeBooks(Center $center): Collection
    {
        return $this->collection($center->getCenterBooks(), new CenterBookTransformer());
    }

    /**
     * Defines what hours will look like when included in the transformation
     *
     * @param Center $center The center for which to include hours
     * @return Collection
     */
    public function includeHours(Center $center): Collection
    {
        return $this->collection($center->getHours(), new CenterHourRangeTransformer());
    }

    /**
     * Defines what subjects will look like when included in the transformation
     *
     * @param Center $center The center for which to include subjects
     * @return Collection
     */
    public function includeSubjects(Center $center): Collection
    {
        return $this->collection($center->getCenterSubjects(), new CenterSubjectTransformer());
    }
}
