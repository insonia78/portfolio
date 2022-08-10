<?php

namespace App\Transformers;

use App\Models\Entities\Primary\User;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Primary\Teacher;
use League\Fractal\Resource\Collection;

class UserTransformer extends BaseTransformer
{
    /**
     * @var array The included relationships which are defined
     */
    protected $availableIncludes = [
        'addresses', 'enrollments', 'contacts'
    ];

    /**
     * Defines the map of outputs to be defined for a user - this is overridable for children to define additional output
     *
     * @param User $user The user to transform
     * @return array The output map to apply
     */
    protected function getOutputMap(User $user): array
    {
        return  [
            'id' => $user->getId(),
            'prefix' => $user->getPrefix(),
            'firstName' => $user->getFirstName(),
            'middleName' => $user->getMiddleName(),
            'lastName' => $user->getLastName(),
            'suffix' => $user->getSuffix(),
            'dateFrom' => $this->formatDate($user->getDateFrom()),
            'dateTo' => $this->formatDate($user->getDateTo()),
            'active' => $user->isActive()
        ];
    }

    /**
     * Defines what addresses will look like when included in the transformation
     *
     * @param User $user The user for which to include addresses
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAddresses(User $user): Collection
    {
        $addresses = $user->getAddresses() ?? [];
        return $this->collection($addresses, new UserAddressTransformer());
    }

    /**
     * Defines what contacts will look like when included in the transformation
     *
     * @param User $user The user for which to include contacts
     * @return \League\Fractal\Resource\Collection
     */
    public function includeContacts(User $user): Collection
    {
        $contacts = $user->getContacts() ?? [];
        return $this->collection($contacts, new UserContactTransformer());
    }

    /**
     * Defines what addresses will look like when included in the transformation
     *
     * @param User $user The user for which to include enrollments
     * @return \League\Fractal\Resource\Collection
     */
    public function includeEnrollments(User $user): Collection
    {
        $enrollments = $user->getEnrollments() ?? [];
        return $this->collection($enrollments, new EnrollmentTransformer());
    }
}
