<?php

namespace App\Services;

use App\Annotations\Access;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Primary\Teacher;
use App\Helpers\RepositoryIdentifier;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Models\Relationships\TeacherStudent;
use App\Transformers\StudentTransformer;
use App\Transformers\TeacherStudentTransformer;
use App\Transformers\TeacherTransformer;
use Doctrine\DBAL\DBALException;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Class TeacherService
 * @package App\Services
 */
class TeacherService extends UserService
{
    /** @var int Reference to the role id used for teachers */
    private const TEACHER_ROLE_ID = 4;

    /**
     * @inheritDoc
     */
    protected $rules = [
        'username' => 'string',
        'password' => 'string',
        'prefix' => 'string|nullable',
        'firstName' => 'string|required',
        'middleName' => 'string|nullable',
        'lastName' => 'string|required',
        'suffix' => 'string|nullable'
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
    protected $relationships = [
        'students' => \App\Services\StudentService::class
    ];

    /**
     * Retrieve a teacher from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="teacher-view,teacher-view-assigned")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of subject
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        $teacherDetails = $this->transform(
            $this->retrieveEntity(
                Teacher::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new TeacherTransformer(),
            ['addresses', 'contacts', 'enrollments', 'enrollments.center', 'enrollments.level', 'enrollments.level.subject']
        );

        // attempt to retrieve authentication profile
        try {
            $teacherAuthDetails = $this->getAuthProfile($inputs['id']);
            $teacherDetails['username'] = $teacherAuthDetails->username;
        } catch (Exception $e) {
            Log::error('Failed to retrieve authentication details when looking up user (ID: ' . $inputs['id'] . '): ' . $e->getMessage());
        }

        return $teacherDetails;
    }

    /**
     * Retrieve all teachers
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="teacher-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Teacher::class,
                $inputs['queryOptions'] ?? []
            ),
            new TeacherTransformer(),
            ['enrollments', 'enrollments.center', 'students']
        );
    }

    /**
     * Retrieve students assigned to the given teacher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view,student-view-assigned")
     */
    public function getStudents(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 't.id', 'value' => $inputs['id'] ]
        ]);

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'name') {
                $inputs['queryOptions']['filters'][$i]['field'] = 's.lastName,s.firstName';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'name') {
                $inputs['queryOptions']['sort']['field'] = 's.lastName,s.firstName';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                TeacherStudent::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('teacher', 't'),
                    new CollectionRelation('student', 's')
                ]
            ),
            new TeacherStudentTransformer()
        );
    }

    /**
     * Create a new teacher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="teacher-create")
     */
    public function create(array $inputs): array
    {
        $newTeacher = $this->transform(
            $this->insert($inputs, new Teacher()),
            new TeacherTransformer()
        );

        // attempt to create the authentication for the student
        try {
            $this->createAuthProfile([
                'id' => $newTeacher['id'],
                'username' => $inputs['username'],
                'password' => $inputs['password'],
                'type' => 'teacher',
                'roles' => [self::TEACHER_ROLE_ID]
            ]);
            $newTeacher['username'] = $inputs['username'];
        } catch (ServiceValidationFailureException $e) {
            // if there was an issue with creating the user login, attempt to delete the user we just created
            try {
                $query = $this->entityManager->getConnection()->prepare('DELETE FROM user WHERE id=:id');
                $query->bindValue('id', $newTeacher['id']);
                $query->execute();
            } catch (DBALException $ee) {
                Log::error('Teacher (ID: ' . $newTeacher['id'] . ') was created but authentication data was invalid and rollback of the user profile failed.');
            }
            throw $e;
        } catch (Exception $e) {
            Log::error('Teacher (ID: ' . $newTeacher['id'] . ') was created but an error occurred creating the authentication profile:: ' . $e->getMessage());
        }
        return $newTeacher;
    }

    /**
     * Updates a teacher with given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="teacher-update")
     */
    public function update(array $inputs): array
    {
        $updatedTeacher = $this->transform(
            $this->modify(
                $inputs,
                $this->retrieveEntity(Teacher::class, new RepositoryIdentifier($inputs['id']))
            ),
            new TeacherTransformer()
        );

        // attempt to update the authentication properties for the teacher
        try {
            $this->updateAuthProfile([
                'id' => $updatedTeacher['id'],
                'username' => $inputs['username'],
                'password' => $inputs['password'],
                // type needs to be sent for auth system to verify permissions
                'type' => 'teacher'
            ]);
            $updatedTeacher['username'] = $inputs['username'];
        } catch (ServiceValidationFailureException $e) {
            // validation exceptions should pass through
            throw $e;
        } catch (Exception $e) {
            Log::error('Teacher (ID: ' . $updatedTeacher['id'] . ') was updated but an error occurred updating the authentication profile:: ' . $e->getMessage());
        }

        return $updatedTeacher;
    }

    /**
     * Deletes a given teacher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="teacher-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Teacher::class, new RepositoryIdentifier($inputs['id']))
        );
    }

    /**
     * Assigns the a student to the teacher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceCreateFailureException If the relation failed to be created
     * @return array
     *
     * @Access(permission="student-assign")
     */
    public function assignStudent(array $inputs): array
    {
        $student = $this->getStudentAssignmentStudent($inputs);
        $teacher = $this->getStudentAssignmentTeacher($inputs);

        try {
            $teacher->addStudent($student);
            $this->entityManager->flush();
        } catch (\Throwable $e) {
            throw new ServiceCreateFailureException('Failed to assign student with id of ' . $student->getId() . ' to teacher with id of ' . $teacher->getId());
        }

        return $this->transform($student, new StudentTransformer());
    }

    /**
     * Unassigns the a student from the teacher
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceCreateFailureException If the relation failed to be created
     * @return array
     *
     * @Access(permission="student-assign")
     */
    public function unassignStudent(array $inputs): array
    {
        $student = $this->getStudentAssignmentStudent($inputs);
        $teacher = $this->getStudentAssignmentTeacher($inputs);

        try {
            $teacher->removeStudent($student);
            $this->entityManager->flush();
        } catch (\Throwable $e) {
            throw new ServiceCreateFailureException('Failed to unassign student with id of ' . $student->getId() . ' from teacher with id of ' . $teacher->getId());
        }

        return $this->transform($student, new StudentTransformer());
    }

    /**
     * Get the teacher for the provided assignment inputs
     * @param array $inputs The input array for the assignment
     * @throws ServiceEntityNotFoundException If the teacher could not be found
     * @return Teacher The teacher associated with the assignment
     */
    private function getStudentAssignmentTeacher(array $inputs): Teacher
    {
        if (!isset($inputs['teacher']) || !is_array($inputs['teacher']) || !isset($inputs['teacher']['id'])) {
            throw new ServiceEntityNotFoundException('No valid identifier was provided for the teacher');
        }
        try {
            /** @var Teacher $teacher */
            $teacher = $this->retrieveEntity(Teacher::class, new RepositoryIdentifier($inputs['teacher']['id']));
            return $teacher;
        } catch (\Throwable $e) {
            throw new ServiceEntityNotFoundException('The teacher could not be found.');
        }
    }

    /**
     * Get the student for the provided assignment inputs
     * @param array $inputs The input array for the assignment
     * @throws ServiceEntityNotFoundException If the student could not be found
     * @return Student The student associated with the assignment
     */
    private function getStudentAssignmentStudent(array $inputs): Student
    {
        if (!isset($inputs['student']) || !is_array($inputs['student']) || !isset($inputs['student']['id'])) {
            throw new ServiceEntityNotFoundException('No valid identifier was provided for the student');
        }
        try {
            /** @var Student $student */
            $student = $this->retrieveEntity(Student::class, new RepositoryIdentifier($inputs['student']['id']));
            return $student;
        } catch (\Throwable $e) {
            throw new ServiceEntityNotFoundException('The student could not be found.');
        }
    }
}
