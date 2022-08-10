<?php

namespace App\Services;

use App\Annotations\Access;
use App\Contracts\BusinessModelService;
use App\Contracts\CrudService;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Center;
use App\Models\Entities\Primary\Student;
use App\Models\Entities\Primary\Teacher;
use App\Models\Entities\Relation\CenterBook;
use App\Transformers\CenterBookTransformer;
use App\Transformers\CenterTransformer;
use App\Transformers\StudentTransformer;
use App\Transformers\TeacherTransformer;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony;

/**
 * Class CenterService
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @package App\Services
 */
class CenterService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'label' => 'required|alpha_dash',
        'name' => 'required|string',
        'streetAddress' => 'required|string',
        'city' => 'required|string',
        'state' => 'required|string',
        'postalCode' => 'required|string',
        'country' => 'required|alpha|size:2',
        'phone' => 'required|alpha_num|max:15',
        'email' => 'required|email',
        'latitude' => 'numeric',
        'longitude' => 'numeric',
        'timezone' => 'timezone',
        'visible' => 'boolean',
        'useInventory' => 'boolean',
        'bookCheckoutLimit' => 'integer',
        'bookCheckoutFrequency' => 'in:day,weekly,bi_weekly,semi_monthly,quad_weekly,monthly,bi_monthly,quarterly'
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'hours' => \App\Services\CenterHourRangeService::class,
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'subjects' => \App\Services\SubjectService::class
    ];

    /**
     * Retrieve a center from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="center-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of center
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id']) && !isset($inputs['label'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }
        $identifier = (isset($inputs['id'])) ? new RepositoryIdentifier($inputs['id']) : new RepositoryIdentifier($inputs['label'], 'label', FILTER_SANITIZE_STRING);


        return $this->transform(
            $this->retrieveEntity(
                Center::class,
                $identifier
            ),
            new CenterTransformer(),
            ['hours', 'subjects', 'subjects.levels']
        );
    }

    /**
     * Retrieve all centers
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="center-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                Center::class,
                $inputs['queryOptions'] ?? []
            ),
            new CenterTransformer()
        );
    }

    /**
     * Retrieve books from the given center
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="center-view")
     */
    public function getBookInventory(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 'c.id', 'value' => $inputs['id'] ]
        ]);

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'title') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'b.title';
            }
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'level') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'l.name';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'title') {
                $inputs['queryOptions']['sort']['field'] = 'b.title';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                CenterBook::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('center', 'c'),
                    new CollectionRelation('book', 'b'),
                    new CollectionRelation('b.level', 'l')
                ]
            ),
            new CenterBookTransformer()
        );
    }

    /**
     * Retrieve students from the given center
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view")
     */
    public function getStudents(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject center restriction as filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 'c.id', 'value' => $inputs['id'] ]
        ]);

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'name') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'lastName,firstName,middleName';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'center') {
                $inputs['queryOptions']['sort']['field'] = 'c.name';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'name') {
                $inputs['queryOptions']['sort']['field'] = 'lastName,firstName,middleName';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                Student::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('enrollments', 'e'),
                    new CollectionRelation('e.center', 'c')
                ]
            ),
            new StudentTransformer(),
            ['enrollments', 'enrollments.center', 'enrollments.level', 'enrollments.level.subject']
        );
    }

    /**
     * Retrieve teachers from the given center
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view")
     */
    public function getTeachers(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject center restriction as filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
            [ 'field' => 'c.id', 'value' => $inputs['id'] ]
        ]);

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'name') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'lastName,firstName';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'center') {
                $inputs['queryOptions']['sort']['field'] = 'c.name';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'name') {
                $inputs['queryOptions']['sort']['field'] = 'lastName,firstName';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                Teacher::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('enrollments', 'e'),
                    new CollectionRelation('e.center', 'c')
                ]
            ),
            new TeacherTransformer(),
            ['enrollments', 'enrollments.center', 'enrollments.level', 'enrollments.level.subject']
        );
    }

    /**
     * Create a new center
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="center-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new Center()),
            new CenterTransformer()
        );
    }

    /**
     * Update a center with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="center-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Center::class, new RepositoryIdentifier($inputs['id']))),
            new CenterTransformer()
        );
    }

    /**
     * Update a center's book inventory for the given book
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the required parameters are not set
     * @throws ServiceRetrieveFailureException If the selected book or center could not be found
     * @return array The data returned for the entity
     *
     * @Access(permission="center-update")
     */
    public function updateBookInventory(array $inputs = []): array
    {
        if (!isset($inputs['bookId']) || !isset($inputs['centerId']) || !isset($inputs['quantity'])) {
            throw new ServiceValidationFailureException('Not enough information was given to update the inventory.  Request must include book id, center id, and quantity.');
        }

        // retrieve inventory item id based on given details
        try {
            $sql = $this->entityManager->getConnection()->prepare('SELECT b.id FROM center_book b WHERE b.center_id=:centerid AND b.book_id=:bookid AND date_to IS NULL');
            $sql->bindParam('centerid', $inputs['centerId']);
            $sql->bindParam('bookid', $inputs['bookId']);
            $sql->execute();
            $id = $sql->fetchOne() ?: null;

            $sql = (is_null($id)) ? 'INSERT INTO center_book (book_id, center_id, quantity) VALUES (:bookid, :centerid, :quantity)' : 'UPDATE center_book SET quantity=:quantity WHERE book_id=:bookid AND center_id=:centerid AND id=:id';
            $query = $this->entityManager->getConnection()->prepare($sql);
            $query->bindParam('centerid', $inputs['centerId']);
            $query->bindParam('bookid', $inputs['bookId']);
            $query->bindParam('quantity', $inputs['quantity']);
            if (!is_null($id)) {
                $query->bindParam('id', $id);
            }
            $query->execute();
            if (is_null($id)) {
                $id = $this->entityManager->getConnection()->lastInsertId();
            }

            return $this->transform(
                $this->entityManager->createQuery('SELECT b FROM App\Models\Entities\Relation\CenterBook b WHERE b.id=' . $id)->getSingleResult(),
                new CenterBookTransformer()
            );
        } catch (NonUniqueResultException | NoResultException $e) {
            throw new ServiceRetrieveFailureException('The book details could not be retrieved.');
        } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $e) {
            throw new ServiceRetrieveFailureException('An error occurred while trying to lookup this user\'s submissions.');
        }
    }

    /**
     * Removes a book from the center's inventory
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the required parameters are not set
     * @throws ServiceRetrieveFailureException If the requested book could not be found
     * @throws ServiceExpireFailureException If the remove failed to complete
     * @return array The data returned for the entity
     *
     * @Access(permission="center-update")
     */
    public function removeBookInventory(array $inputs = []): array
    {
        if (!isset($inputs['bookId']) || !isset($inputs['centerId'])) {
            throw new ServiceValidationFailureException('Not enough information was given to update the inventory.  Request must include book id, center id.');
        }

        // retrieve inventory item id based on given details
        try {
            $sql = $this->entityManager->getConnection()->prepare('SELECT b.id FROM center_book b WHERE b.center_id=:centerid AND b.book_id=:bookid AND b.date_to IS NULL');
            $sql->bindParam('centerid', $inputs['centerId']);
            $sql->bindParam('bookid', $inputs['bookId']);
            $sql->execute();
            $id = $sql->fetchNumeric()[0];
            if (is_null($id)) {
                throw new ServiceRetrieveFailureException('The book could not be found in the center inventory.  Was it removed already?');
            }
            $book = $this->entityManager->createQuery('SELECT b FROM App\Models\Entities\Relation\CenterBook b WHERE b.id=' . $id)->getSingleResult();

            $sql = $this->entityManager->getConnection()->prepare('UPDATE center_book b SET date_to = NOW() WHERE b.center_id=:centerid AND b.book_id=:bookid AND b.date_to IS NULL');
            $sql->bindParam('centerid', $inputs['centerId']);
            $sql->bindParam('bookid', $inputs['bookId']);
            $sql->execute();

            return $this->transform(
                $book,
                new CenterBookTransformer()
            );
        } catch (NoResultException | NonUniqueResultException $e) {
            throw new ServiceRetrieveFailureException('The book could not be found in the center inventory.  Was it removed already?');
        } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $e) {
            throw new ServiceExpireFailureException('An error occurred while trying to remove the book from the center inventory.');
        }
    }

    /**
     * Deletes a given center
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="center-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Center::class, new RepositoryIdentifier($inputs['id']))
        );
    }
}
