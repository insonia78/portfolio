<?php

namespace App\Services;

use App\Annotations\Access;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Relation\Enrollment;
use App\Models\Entities\Secondary\BookCheckout;
use App\Transformers\BookCheckoutTransformer;
use App\Transformers\StudentTransformer;
use App\Exceptions\ServiceEntityNotFoundException;
use Dingo\Api\Http\Response;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\ORM\TransactionRequiredException;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Class StudentService
 * @package App\Services
 */
class StudentService extends UserService
{
    /** @var int Reference to the role id used for students */
    private const STUDENT_ROLE_ID = 3;

    /**
     * @inheritDoc
     */
    protected $rules = [
        'username' => 'string|not_regex:/\@/i',
        'password' => 'string',
        'prefix' => 'string|nullable',
        'firstName' => 'string|required',
        'middleName' => 'string|nullable',
        'lastName' => 'string|required',
        'suffix' => 'string|nullable',
        'gender' => 'string|nullable',
        'school' => 'string',
        'dateOfBirth' => 'date|nullable',
        'grade' => 'numeric',
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'addresses' => \App\Services\UserAddressService::class,
        'contacts' => \App\Services\UserContactService::class,
        'enrollments' => \App\Services\EnrollmentService::class
    ];

    /**
     * @inheritDoc
     */
    protected $filterCriteria = [
      'center' => 'center'
    ];

    /**
     * Retrieve a student from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view,student-view-assigned")
     */
    public function get(array $inputs = []): array
    {
        // disable soft deleted filter so that returned books will be returned in checkout history list
        /** @phpstan-ignore-next-line */
        $this->entityManager->getFilters()->getFilter('soft-deleteable')->disableForEntity(BookCheckout::class);

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        $studentDetails = $this->transform(
            $this->retrieveEntity(
                Student::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new StudentTransformer(),
            [
                'addresses',
                'enrollments',
                'enrollments.center',
                'enrollments.center.subjects',
                'enrollments.center.subjects.levels',
                'enrollments.level',
                'enrollments.level.subject',
                'enrollments.books',
                'enrollments.books.book',
                'enrollments.assignments',
                'enrollments.assignments.assignment',
                'enrollments.assignments.answers',
                'enrollments.assignments.answers.question',
                'contacts',
                'books'
            ]
        );

        // inject enrollment history
        $enrollmentService = new EnrollmentService();
//        $enrollmentHistory = [];
        if (array_key_exists('enrollments', $studentDetails) && sizeof($studentDetails['enrollments']) > 0) {
            foreach ($studentDetails['enrollments'] as $i => $enrollmentData) {
                try {
                    $enrollment = $this->entityManager->find(Enrollment::class, $enrollmentData['id']);
                    $studentDetails['enrollments'][$i]['versions'] = $enrollmentService->getVersions($enrollment);
                } catch (Exception $e) {
                    Log::error('Error when trying to retrieve enrollment history for enrollment (' . $enrollmentData['id'] . '): ' . $e->getMessage());
                }
            }
        }

        // attempt to retrieve authentication profile
        try {
            $studentAuthDetails = $this->getAuthProfile($inputs['id']);
            $studentDetails['username'] = $studentAuthDetails->username;
        } catch (Exception $e) {
            Log::error('Failed to retrieve authentication details when looking up user (ID: ' . $inputs['id'] . '): ' . $e->getMessage());
        }

        return $studentDetails;
    }

    /**
     * Retrieve all students
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="student-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Student::class,
                $inputs['queryOptions'] ?? []
            ),
            new StudentTransformer(),
            ['enrollments', 'enrollments.center', 'enrollments.level', 'enrollments.level.subject']
        );
    }

    /**
     * Retrieve checked out books from the given student
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view")
     */
    public function getBookCheckouts(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 'e.userId', 'value' => $inputs['id'] ]
        ]);

        // convert special sorts and filters
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'title') {
                $inputs['queryOptions']['sort']['field'] = 'b.title';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'relatedFrom') {
                $inputs['queryOptions']['sort']['field'] = 'dateFrom';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                BookCheckout::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('enrollment', 'e'),
                    new CollectionRelation('book', 'b')
                ]
            ),
            new BookCheckoutTransformer()
        );
    }

    /**
     * Create a new student
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @return array The newly created entity data
     *
     * @Access(permission="student-create")
     */
    public function create(array $inputs): array
    {
        // first generate the student
        $newStudent = $this->transform(
            $this->insert($inputs, new Student()),
            new StudentTransformer()
        );

        // attempt to create the authentication for the student
        try {
            $this->createAuthProfile([
                'id' => $newStudent['id'],
                'username' => $inputs['username'],
                'password' => $inputs['password'],
                'type' => 'student',
                'roles' => [self::STUDENT_ROLE_ID]
            ]);
            $newStudent['username'] = $inputs['username'];
        } catch (ServiceValidationFailureException $e) {
            // if there was an issue with creating the user login, attempt to delete the user we just created
            try {
                $query = $this->entityManager->getConnection()->prepare('DELETE FROM user WHERE id=:id');
                $query->bindValue('id', $newStudent['id']);
                $query->execute();
            } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $ee) {
                Log::error('Student (ID: ' . $newStudent['id'] . ') was created but authentication data was invalid and rollback of the user profile failed.');
            }
            throw $e;
        } catch (Exception $e) {
            Log::error('Student (ID: ' . $newStudent['id'] . ') was created but an error occurred creating the authentication profile.');
        }
        return $newStudent;
    }

    /**
     * Updates a student with given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="student-update")
     */
    public function update(array $inputs): array
    {
        // first, handle the modification of all other student data
        $updatedStudent = $this->transform(
            $this->modify(
                $inputs,
                $this->retrieveEntity(Student::class, new RepositoryIdentifier($inputs['id']))
            ),
            new StudentTransformer()
        );

        // attempt to update the authentication properties for the student
        try {
            $this->updateAuthProfile([
                'id' => $updatedStudent['id'],
                'username' => $inputs['username'],
                'password' => $inputs['password'],
                // type needs to be sent for auth system to verify permissions
                'type' => 'student'
            ]);
            $updatedStudent['username'] = $inputs['username'];
        } catch (ServiceValidationFailureException $e) {
            // validation exceptions should pass through
            throw $e;
        } catch (Exception $e) {
            Log::error('Student (ID: ' . $updatedStudent['id'] . ') was updated but an error occurred updating the authentication profile.');
        }

        return $updatedStudent;
    }

    /**
     * Locks the given students account
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The data of the locked student
     *
     * @Access(permission="student-update")
     */
    public function lock(array $inputs): array
    {
        if (!isset($inputs['id']) || !is_numeric($inputs['id'])) {
            throw new ServiceValidationFailureException('The provided id was invalid.');
        }

        // attempting to retrieve the student will throw an exception if it fails
        $student = $this->retrieveEntity(Student::class, new RepositoryIdentifier($inputs['id']));

        // attempt to update the authentication properties for the student
        try {
            $this->updateAuthProfile([
                'id' => $inputs['id'],
                'active' => false,
                // type needs to be sent for auth system to verify permissions
                'type' => 'student'
            ]);
        } catch (ServiceValidationFailureException $e) {
            // validation exceptions should pass through
            throw $e;
        }

        return $this->transform(
            $student,
            new StudentTransformer()
        );
    }

    /**
     * Unlocks the students account
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The data of the unlocked student
     *
     * @Access(permission="student-update")
     */
    public function unlock(array $inputs): array
    {
        if (!isset($inputs['id']) || !is_numeric($inputs['id'])) {
            throw new ServiceValidationFailureException('The provided id was invalid.');
        }

        // attempting to retrieve the student will throw an exception if it fails
        $student = $this->retrieveEntity(Student::class, new RepositoryIdentifier($inputs['id']));

        // attempt to update the authentication properties for the student
        try {
            $this->updateAuthProfile([
                'id' => $inputs['id'],
                'active' => true,
                // type needs to be sent for auth system to verify permissions
                'type' => 'student'
            ]);
        } catch (ServiceValidationFailureException $e) {
            // validation exceptions should pass through
            throw $e;
        }

        return $this->transform(
            $student,
            new StudentTransformer()
        );
    }

    /**
     * Deletes a given student
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="student-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Student::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
