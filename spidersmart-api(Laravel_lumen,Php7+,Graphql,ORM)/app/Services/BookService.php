<?php

namespace App\Services;

use App\Annotations\Access;
use App\Contracts\BusinessModelService;
use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceRetrieveFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use App\Helpers\CollectionRelation;
use App\Helpers\RepositoryIdentifier;
use App\Models\Entities\Primary\Book;
use App\Models\Entities\Relation\Enrollment;
use App\Models\Entities\Secondary\BookCheckout;
use App\Transformers\BookCheckoutTransformer;
use App\Transformers\BookTransformer;
use DateTime;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony;

/**
 * Class BookService
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @package App\Services
 */
class BookService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'title' => 'required|string',
        'description' => 'string',
        'isbn' => 'required|string',
        'coverImage' => 'string|nullable',
        'active' => 'int'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'authors' => \App\Services\AuthorService::class,
        'publishers' => \App\Services\PublisherService::class,
        'genres' => \App\Services\GenreService::class
    ];

    /**
     * Retrieve a book from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="book-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of book
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        return $this->transform(
            $this->retrieveEntity(
                Book::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new BookTransformer(),
            ['authors', 'publishers', 'genres', 'level', 'assignment']
        );
    }

    /**
     * Retrieve all books
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="book-view")
     */
    public function getAll(array $inputs = []): array
    {
        if (isset($inputs['queryOptions'])) {
            // convert special filters
            if (isset($inputs['queryOptions']['filters'])) {
                $filterCount = sizeof($inputs['queryOptions']['filters']);
                for ($i = 0; $i < $filterCount; $i++) {
                    if ($inputs['queryOptions']['filters'][$i]['field'] === 'level') {
                        $inputs['queryOptions']['filters'][$i]['field'] = 'l.name';
                    }
                    if ($inputs['queryOptions']['filters'][$i]['field'] === 'levelId') {
                        $inputs['queryOptions']['filters'][$i]['field'] = 'l.id';
                    }
                }
            }

            // convert special sorts
            if (isset($inputs['queryOptions']['sort'])) {
                if ($inputs['queryOptions']['sort']['field'] === 'level') {
                    $inputs['queryOptions']['sort']['field'] = 'l.name';
                }
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                Book::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('level', 'l')
                ]
            ),
            new BookTransformer(),
            ['assignment', 'level']
        );
    }

    /**
     * Retrieve checked out books from the given student, center or enrollment
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="student-view")
     */
    public function getCheckouts(array $inputs = []): array
    {
        // ensure that there is a valid lookup parameter
        if (
            (!isset($inputs['enrollments']) || sizeof($inputs['enrollments']) < 1 || !isset($inputs['enrollments'][0]['id']))
            && (!isset($inputs['centers']) || sizeof($inputs['centers']) < 1 || !isset($inputs['centers'][0]['id']))
            && (!isset($inputs['students']) || sizeof($inputs['students']) < 1 || !isset($inputs['students'][0]['id']))
            && (!isset($inputs['books']) || sizeof($inputs['books']) < 1 || !isset($inputs['books'][0]['id']))
        ) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject appropriate restriction as filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        if (isset($inputs['enrollments']) && sizeof($inputs['enrollments']) > 0 && isset($inputs['enrollments'][0]['id'])) {
            /** @phpstan-ignore-next-line */
            $this->entityManager->getFilters()->getFilter('soft-deleteable')->disableForEntity(Enrollment::class);
            $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
                ['field' => 'e.id', 'value' => array_column($inputs['enrollments'], 'id')]
            ]);
        } elseif (isset($inputs['centers']) && sizeof($inputs['centers']) > 0 && isset($inputs['centers'][0]['id'])) {
            $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
                ['field' => 'c.id', 'value' => array_column($inputs['centers'], 'id')]
            ]);
        } elseif (isset($inputs['students']) && sizeof($inputs['students']) > 0 && isset($inputs['students'][0]['id'])) {
            $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
                ['field' => 'e.userId', 'value' => array_column($inputs['students'], 'id')]
            ]);
        } elseif (isset($inputs['books']) && sizeof($inputs['books']) > 0 && isset($inputs['books'][0]['id'])) {
            $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
                ['field' => 'b.id', 'value' => array_column($inputs['books'], 'id')]
            ]);
        }

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'title') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'b.title';
            }
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'student') {
                $inputs['queryOptions']['filters'][$i]['field'] = 's.firstName,s.lastName';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'center') {
                $inputs['queryOptions']['sort']['field'] = 'c.name';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'student') {
                $inputs['queryOptions']['sort'] = 's.lastName,s.firstName';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'title') {
                $inputs['queryOptions']['sort']['field'] = 'b.title';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'level') {
                $inputs['queryOptions']['sort']['field'] = 'l.name';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                BookCheckout::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('enrollment', 'e'),
                    new CollectionRelation('e.center', 'c'),
                //                    new CollectionRelation('e.user', 's'),
                    new CollectionRelation('book', 'b'),
                    new CollectionRelation('b.level', 'l')
                ]
            ),
            new BookCheckoutTransformer(),
            ['center', 'user', 'book', 'book.level', 'book.assignment']
        );
    }

    /**
     * Create a new book
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="book-create")
     */
    public function create(array $inputs): array
    {
        // check for a cover image and process if exists
        if (array_key_exists('coverImage', $inputs) && $inputs['coverImage'] instanceof UploadedFile) {
            $inputs['coverImage'] = Storage::disk('s3')->put('books', $inputs['coverImage']);
        }

        return $this->transform(
            $this->insert($inputs, new Book()),
            new BookTransformer()
        );
    }

    /**
     * Updates a book with given information
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="book-update")
     */
    public function update(array $inputs): array
    {
        // check for a cover image and process if exists
        if (array_key_exists('coverImage', $inputs) && $inputs['coverImage'] instanceof UploadedFile) {
            $inputs['coverImage'] = Storage::disk('s3')->put('books', $inputs['coverImage']);
        }

        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Book::class, new RepositoryIdentifier($inputs['id']))),
            new BookTransformer()
        );
    }

    /**
     * Deletes a given book
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="book-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Book::class, new RepositoryIdentifier($inputs['id']))
        );
    }

    /**
     * Checks out the given book to the given enrollment
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceCreateFailureException If the relation failed to be created
     * @return array
     *
     * @Access(permission="book-checkout")
     */
    public function checkout(array $inputs): array
    {
        $enrollment = $this->getCheckoutEnrollment($inputs);
        $book = $this->getCheckoutBook($inputs);
        /*
         * @todo  Add check here to prevent checking out books which are not in stock
         * 1. Get the enrollment center and IF center has book inventory turned off, perform the checkout
         * 2. ELSE if the book does not exists in the center inventory, throw an exception
         * 3. IF the book does exist in the center inventory, get the number of active checkouts of that book for that center
         * 4. IF the center quantity of the book minus the active checkouts is <= 0, throw an exception
         * 5. ELSE, perform the checkout
         */
        try {
            $enrollment->addBook($book);
            $this->entityManager->flush();
            $bookCheckout = $enrollment->getBookCheckouts()->last();
        } catch (\Throwable $e) {
            throw new ServiceCreateFailureException('Failed to checkout book with id of ' . $book->getId() . ' to enrollment with id of ' . $enrollment->getId());
        }

        return $this->transform(
            $bookCheckout,
            new BookCheckoutTransformer(),
            ['center', 'user', 'book', 'book.level', 'book.assignment']
        );
    }

    /**
     * Returns the given book
     * @SuppressWarnings(PHPMD.ElseExpression)
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the required parameters are not set
     * @throws ServiceRetrieveFailureException If the checkout cannot be found
     * @throws ServiceUpdateFailureException If the remove failed to complete
     * @return array
     *
     * @Access(permission="book-return")
     */
    public function return(array $inputs = []): array
    {
        if (!isset($inputs['id'])) {
            throw new ServiceValidationFailureException('Not enough information was given to return the book.  Request must include id.');
        }

        // retrieve inventory item id based on given details
        try {
            // try to retrieve the book, if the book does not exist with the given id, this will throw a NoResult exception
            $book = $this->entityManager->createQuery('SELECT b FROM App\Models\Entities\Secondary\BookCheckout b WHERE b.id=:id')->setParameter('id', $inputs['id'])->getSingleResult();

            // get the associated assignment with the book checkout
            $assignmentSql = $this->entityManager->getConnection()->prepare('SELECT id,status FROM assignment_submission a WHERE a.book_checkout_id=:id');
            $assignmentSql->bindParam('id', $inputs['id']);
            $assignmentSql->execute();
            $assignment = $assignmentSql->fetchAssociative();

            if ($assignment && is_numeric($assignment['id']) && $assignment['status'] === 'new') {
                $sql = $this->entityManager->getConnection()->prepare('UPDATE assignment_submission a SET date_to = NOW() WHERE a.id=:id AND a.date_to IS NULL');
                $sql->bindParam('id', $assignment['id']);
                $sql->execute();
                $sql = $this->entityManager->getConnection()->prepare('DELETE FROM book_checkout WHERE id=:id');
                $sql->bindParam('id', $inputs['id']);
                $sql->execute();
            } else {
                $sql = $this->entityManager->getConnection()->prepare('UPDATE book_checkout b SET date_to = NOW() WHERE b.id=:id AND b.date_to IS NULL');
                $sql->bindParam('id', $inputs['id']);
                $sql->execute();
            }

            return $this->transform(
                $book,
                new BookCheckoutTransformer()
            );
        } catch (NonUniqueResultException | NoResultException $e) {
            throw new ServiceRetrieveFailureException('The book checkout could not be retrieved to return.  Perhaps it was already returned?');
        } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $e) {
            throw new ServiceUpdateFailureException('An error occurred while trying to return the book.');
        }
    }

    /**
     * Get the book from the provided checkout inputs
     * @param array $inputs The input array for the checkout
     * @throws ServiceEntityNotFoundException If the book could not be found
     * @return Book The book associated with the checkout
     */
    private function getCheckoutBook(array $inputs): Book
    {
        if (!isset($inputs['book']) || !is_array($inputs['book']) || !isset($inputs['book']['id'])) {
            throw new ServiceEntityNotFoundException('No valid identifier was provided for the book');
        }
        try {
            /** @var Book $book */
            $book = $this->retrieveEntity(Book::class, new RepositoryIdentifier($inputs['book']['id']));
            return $book;
        } catch (\Throwable $e) {
            throw new ServiceEntityNotFoundException('The book could not be found.');
        }
    }

    /**
     * Get the enrollment from the provided checkout inputs
     * @param array $inputs The input array for the checkout
     * @throws ServiceEntityNotFoundException If the enrollment could not be found
     * @return Enrollment The enrollment associated with the checkout
     */
    private function getCheckoutEnrollment(array $inputs): Enrollment
    {
        if (!isset($inputs['enrollment']) || !is_array($inputs['enrollment']) || !isset($inputs['enrollment']['id'])) {
            throw new ServiceEntityNotFoundException('No valid identifier was provided for the enrollment.');
        }
        try {
            /** @var Enrollment $enrollment */
            $enrollment = $this->entityManager->getRepository(Enrollment::class)->findOneBy(
                ['id' => $inputs['enrollment']['id']]
            );
            return $enrollment;
        } catch (\Throwable $e) {
            throw new ServiceEntityNotFoundException('The enrollment could not be found.');
        }
    }
}
