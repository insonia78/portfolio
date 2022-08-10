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
use App\Helpers\CollectionResult;
use App\Helpers\RepositoryFilter;
use App\Helpers\RepositoryIdentifier;
use App\Models\Derived\AssignmentSubmissionView;
use App\Models\Entities\Relation\Enrollment;
use App\Models\Entities\Secondary\AssignmentSubmission;
use App\Transformers\AssignmentSubmissionTransformer;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DBALException;
use Doctrine\DBAL\Driver\Exception;
use Illuminate\Support\Facades\Log;
use PDO;
use Symfony;

/**
 * Class AssignmentSubmissionService
 * @package App\Services
 */
class AssignmentSubmissionService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'status' => 'required|in:new,draft,submitted,pending_revision,revision_draft,review_draft,revised,complete',
        'comments' => 'string|nullable',
        'bookCheckoutId' => 'int|nullable'
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'answers' => \App\Services\AssignmentSubmissionAnswerService::class
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'assignment' => \App\Services\AssignmentService::class,
        'enrollment' => \App\Services\EnrollmentService::class,
    ];

    private $draftStatuses = ['draft', 'review_draft', 'revision_draft'];


    /**
     * Retrieve an assignment submission from given input data
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="assignment-review")
     */
    public function getAll(array $inputs = []): array
    {
        // ensure that there is a valid lookup parameter
        if (
            (!isset($inputs['enrollments']) || sizeof($inputs['enrollments']) < 1 || !isset($inputs['enrollments'][0]['id']))
            && (!isset($inputs['centers']) || sizeof($inputs['centers']) < 1 || !isset($inputs['centers'][0]['id']))
            && (!isset($inputs['students']) || sizeof($inputs['students']) < 1 || !isset($inputs['students'][0]['id']))
            && (!isset($inputs['teacher']) || !isset($inputs['teacher']['id']))
        ) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // inject appropriate restriction as filter into query options
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }

        // even if an enrollment is expired (a previous version of the enrollment), assignments should still be visible for it
        /** @phpstan-ignore-next-line */
        $this->entityManager->getFilters()->getFilter('soft-deleteable')->disableForEntity(Enrollment::class);

        if (isset($inputs['enrollments']) && sizeof($inputs['enrollments']) > 0 && isset($inputs['enrollments'][0]['id'])) {
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
        } elseif (isset($inputs['teacher']) && isset($inputs['teacher']['id'])) {
            // get all assigned students for this teacher
            try {
                $sql = $this->entityManager->getConnection()->prepare('SELECT ts.student_id FROM teacher_student ts WHERE ts.teacher_id=:id');
                $sql->bindValue('id', $inputs['teacher']['id']);
                $sql->execute();
                $result = $sql->fetchAllNumeric();
                $studentIds = array_column($result, 0);
            } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $e) {
                throw new ServiceRetrieveFailureException('An error occurred while trying to lookup this teacher\'s student\'s submissions.');
            }

            $inputs['queryOptions']['filters'] = array_merge($inputs['queryOptions']['filters'], [
                ['field' => 'e.userId', 'value' => $studentIds]
            ]);
        }

        // convert special filters
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'title') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'a.title';
            }
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'student') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'e.userId';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'center') {
                $inputs['queryOptions']['sort']['field'] = 'c.name';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'student') {
                $inputs['queryOptions']['sort'] = [];
            }
            if ($inputs['queryOptions']['sort']['field'] === 'title') {
                $inputs['queryOptions']['sort']['field'] = 'a.title';
            }
            if ($inputs['queryOptions']['sort']['field'] === 'level') {
                $inputs['queryOptions']['sort']['field'] = 'l.name';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                AssignmentSubmission::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('enrollment', 'e'),
                    new CollectionRelation('e.center', 'c'),
                //                    new CollectionRelation('e.user', 'u'),
                    new CollectionRelation('assignment', 'a'),
                    new CollectionRelation('a.level', 'l')
                ]
            ),
            new AssignmentSubmissionTransformer(),
            ['assignment', 'assignment.level', 'assignment.level.subject', 'assignment.book', 'assignment.files', 'enrollment', 'enrollment.center', 'enrollment.user', 'lastNonDraft']
        );
    }

    /**
     * Retrieve an assignment submission from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="assignment-review")
     */
    public function get(array $inputs = []): array
    {
        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        // get the submission
        /** @var AssignmentSubmission $submission */
        $submission = $this->retrieveEntity(AssignmentSubmission::class, new RepositoryIdentifier($inputs['id']));

        // get the date when the assignment was assigned (as opposed to the most recent update on it)
        /** @var AssignmentSubmission $originalSubmission */
        $originalSubmission = $this->updateEntityToOriginalVersion($submission);

        // set assignment to the version when submission was started
        $assignmentService = new AssignmentService();
        $assignment = $assignmentService->getVersion($originalSubmission->getAssignment(), $originalSubmission->getDateFrom());
        $submission->setAssignment($assignment);

        // check if assignment is in draft state, and if so populate last non-draft state as well
        if (in_array($submission->getStatus(), $this->draftStatuses)) {
            $lastNonDraft = $this->getLastNonDraft($submission);
            $submission->setLastNonDraft($lastNonDraft);
        }

        return $this->transform(
            $submission,
            new AssignmentSubmissionTransformer(),
            [
                'assignment',
                'assignment.questions',
                'assignment.sections',
                'assignment.sections.questions',
                'assignment.sections.questions.answers',
                'assignment.level',
                'assignment.level.subject',
                'assignment.book',
                'assignment.files',
                'answers',
                'answers.question',
                'lastNonDraft',
                'lastNonDraft.answers',
                'lastNonDraft.answers.question',
                'enrollment'
            ]
        );
    }

    /**
     * Create a new assignment submission
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="assignment-assign")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new AssignmentSubmission()),
            new AssignmentSubmissionTransformer(),
            [
                'assignment',
                'assignment.questions',
                'assignment.sections',
                'assignment.sections.questions',
                'assignment.sections.questions.answers',
                'assignment.level',
                'assignment.level.subject',
                'assignment.book'
            ]
        );
    }

    /**
     * Save a given assignment submission
     *
     * @param array $inputs
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the save operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="assignment-submit")
     */
    public function save(array $inputs): array
    {
        try {
            // each answer requires the submission id reference and answer id reference for the comparison function in assignment submission service
            if (array_key_exists('answers', $inputs) && is_array($inputs['answers'])) {
                $inputs['answers'] = array_map(function ($ans) use ($inputs) {
                    $query = $this->entityManager->getConnection()->prepare('SELECT id FROM assignment_submission_answer WHERE assignment_submission_id = :submission_id AND question_id = :question_id AND date_to IS NULL');
                    $query->bindValue('submission_id', $inputs['id']);
                    $query->bindValue('question_id', $ans['question']['id']);
                    $query->execute();
                    $ans['id'] = $query->fetchOne();
                    $ans['id'] = ($ans['id']) ? $ans['id'] : null;
                    $ans['submission_id'] = $inputs['id'];
                    return $ans;
                }, $inputs['answers']);
            }

            return $this->transform(
                $this->modify($inputs, $this->retrieveEntity(AssignmentSubmission::class, new RepositoryIdentifier($inputs['id']))),
                new AssignmentSubmissionTransformer(),
                [
                    'assignment',
                    'assignment.questions',
                    'assignment.sections',
                    'assignment.sections.questions',
                    'assignment.sections.questions.answers',
                    'assignment.level',
                    'assignment.level.subject',
                    'assignment.book'
                ]
            );
        } catch (DBALException $e) {
            throw new ServiceEntityNotFoundException($e);
        } catch (ServiceRetrieveFailureException $e) {
            throw new ServiceEntityNotFoundException($e);
        }
    }

    /**
     * Retrieves the last non-draft submission from a given submission
     * @param AssignmentSubmission $submission The current submission from which to find the last non-draft
     * @return AssignmentSubmissionView|null The last non-draft submission if found, null if not
     */
    private function getLastNonDraft(AssignmentSubmission $submission): ?AssignmentSubmissionView
    {
        try {
            // find the first non-draft version of the submission and set details about it
            $query = $this->entityManager->getConnection()->prepare('WITH RECURSIVE cte AS (
                            SELECT id, status, date_from, date_to, previous_id FROM assignment_submission WHERE id=:id
                            UNION ALL
                            SELECT t.id, t.status, t.date_from, t.date_to, t.previous_id
                            FROM cte c
                            inner join assignment_submission t on t.id = c.previous_id
                        ) SELECT * FROM cte WHERE status NOT IN ("' . implode('","', $this->draftStatuses) . '") ORDER BY date_from DESC');
            $query->bindValue('id', $submission->getId());
            $query->execute();
            if ($query->rowCount() > 0) {
                $result = $query->fetchAll()[0];
                $nonDraft = new AssignmentSubmissionView();
                $nonDraft->fromArray($result);

                // retrieve the answers from that were active while the submission was in the last non-draft state
                $query = $this->entityManager->createQuery('SELECT a FROM App\Models\Entities\Secondary\AssignmentSubmissionAnswer a WHERE a.assignmentSubmissionId = :assignment_submission_id AND a.dateFrom < :date_to AND a.dateTo > :date_from');
                $query->setParameter('assignment_submission_id', $submission->getId());
                $query->setParameter('date_from', $nonDraft->getDateFrom());
                $query->setParameter('date_to', $nonDraft->getDateTo());
                $answers = $query->getResult();
                $nonDraft->setAnswers($answers);
                return $nonDraft;
            }
            return null;
        } catch (DBALException $e) {
            Log::error("Exception while retrieving last non draft from submission {$submission->getId()}: {$e->getMessage()}");
            return null;
        }
    }
}
