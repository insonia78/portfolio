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
use App\Models\Entities\Primary\Assignment;
use App\Models\Entities\Secondary\AssignmentSection;
use App\Models\Entities\Secondary\Question;
use App\Transformers\AssignmentTransformer;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\NonUniqueResultException;
use Exception;
use Symfony;

/**
 * Class AssignmentService
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @package App\Services
 */
class AssignmentService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        'title' => 'required|string',
        'description' => 'string|nullable'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'level' => \App\Services\LevelService::class,
        'book' => \App\Services\BookService::class
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
//        'questions' => \App\Services\QuestionService::class,
        'files' => \App\Services\AssignmentFileService::class,
        'sections' => \App\Services\AssignmentSectionService::class
    ];

    /**
     * Retrieve a assignment from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="assignment-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of assignment
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }
        $identifier = (isset($inputs['id'])) ? new RepositoryIdentifier($inputs['id']) : new RepositoryIdentifier($inputs['title'], 'title', FILTER_SANITIZE_STRING);

        // get the assignment
        $assignment = $this->retrieveEntity(
            Assignment::class,
            $identifier
        );

        // if there is a date provided, a custom lookup must be done to get the assignment as it existed in a specific point of time
        if (isset($inputs['date']) && $inputs['date'] instanceof DateTime) {
            $assignment = $this->getVersion($assignment, $inputs['date']);
        }

        return $this->transform(
            $assignment,
            new AssignmentTransformer(),
            ['questions', 'sections', 'sections.questions', 'sections.questions.answers', 'level', 'level.subject', 'book', 'files']
        );
    }

    /**
     * Retrieves the version of the given assignment that existed at the given time
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     *
     * @param Assignment $assignment The assignment for which the version should be retrieved
     * @param DateTime $time  The time at which the version should be retrieved
     * @return Assignment|null The assignment version at the given time, null if none could be found
     */
    public function getVersion(Assignment $assignment, DateTime $time): ?Assignment
    {
        try {
            // get the assignment at the given time
            try {
                /** @var Assignment $assignment */
                $assignment = $this->updateEntityToVersionAtTime($assignment, $time);
            } catch (Exception $e) {
                return null;
            }

            // update assignment sections to specified version
            $sections = $assignment->getSections();
            $assignmentSections = new ArrayCollection();
            foreach ($sections as $section) {
                try {
                    /** @var AssignmentSection $section */
                    $section = $this->updateEntityToVersionAtTime($section, $time);
                } catch (Exception $e) {
                    continue;
                }

                // if the updated section has already been captured (this can happen if there were multiple versions of the same entity passed in), skip it
                if (
                    $assignmentSections->exists(function ($key, AssignmentSection $sec) use ($section) {
                        return $section->getId() === $sec->getId();
                    })
                ) {
                    continue;
                }

                // update section questions to specified version
                $questions = $section->getQuestions();
                $sectionQuestions = new ArrayCollection();
                foreach ($questions as $question) {
                    try {
                        /** @var Question $question */
                        $question = $this->updateEntityToVersionAtTime($question, $time);
                    } catch (Exception $e) {
                        continue;
                    }

                    // if the updated section has already been captured (this can happen if there were multiple versions of the same entity passed in), skip it
                    if (
                        $sectionQuestions->exists(function ($key, Question $ques) use ($question) {
                            return $question->getId() === $ques->getId();
                        })
                    ) {
                        continue;
                    }

                    // update possible answers for question
                    $answers = $question->getAnswers();
                    $questionAnswers = new ArrayCollection();
                    foreach ($answers as $answer) {
                        try {
                            $answer = $this->updateEntityToVersionAtTime($answer, $time);
                            $questionAnswers->add($answer);
                        } catch (Exception $e) {
                            continue;
                        }
                    }
                    $question->setAnswers($questionAnswers);
                    $sectionQuestions->add($question);
                }
                $section->setQuestions($sectionQuestions);
                $assignmentSections->add($section);
            }
            $assignment->setSections($assignmentSections);
            return $assignment;
        } catch (NonUniqueResultException $e) {
            return null;
        }
    }

    /**
     * Retrieve all assignments
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="assignment-view")
     */
    public function getAll(array $inputs = []): array
    {

        // convert special filters
        if (!isset($inputs['queryOptions']) || !isset($inputs['queryOptions']['filters'])) {
            $inputs['queryOptions']['filters'] = [];
        }
        $filterCount = sizeof($inputs['queryOptions']['filters']);
        for ($i = 0; $i < $filterCount; $i++) {
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'subject') {
                $inputs['queryOptions']['filters'][$i]['field'] = 's.id';
            }
            if ($inputs['queryOptions']['filters'][$i]['field'] === 'level') {
                $inputs['queryOptions']['filters'][$i]['field'] = 'l.id';
            }
        }

        // convert special sorts
        if (isset($inputs['queryOptions']['sort'])) {
            if ($inputs['queryOptions']['sort']['field'] === 'subject') {
                $inputs['queryOptions']['sort']['field'] = 's.name,l.name';
            }
        }

        return $this->transform(
            $this->retrieveCollection(
                Assignment::class,
                $inputs['queryOptions'] ?? [],
                [
                    new CollectionRelation('level', 'l'),
                    new CollectionRelation('l.subject', 's')
                ]
            ),
            new AssignmentTransformer(),
            ['level', 'level.subject', 'book']
        );
    }

    /**
     * Create a new assignment
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="assignment-create")
     */
    public function create(array $inputs): array
    {
        // check for uploaded files and process if they exist
        if (array_key_exists('files', $inputs) && is_array($inputs['files'])) {
            $inputs['files'] = $this->uploadAndFormatFileList($inputs['files'], 'assignments');
        }

        return $this->transform(
            $this->insert($inputs, new Assignment()),
            new AssignmentTransformer()
        );
    }

    /**
     * Update a assignment with the given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity
     *
     * @Access(permission="assignment-update")
     */
    public function update(array $inputs): array
    {
        // check for uploaded files and process if they exist
        if (array_key_exists('files', $inputs) && is_array($inputs['files'])) {
            $inputs['files'] = $this->uploadAndFormatFileList($inputs['files'], 'assignments');
        }

        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(Assignment::class, new RepositoryIdentifier($inputs['id'])), 3),
            new AssignmentTransformer()
        );
    }

    /**
     * Deletes a given assignment
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="assignment-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(Assignment::class, new RepositoryIdentifier($inputs['id']))
        );
    }

    /**
     * Attempts to upload any provided files and then merge them into the existing files list with retrieved upload data
     *
     * @param array $files The newly uploaded files provided for the request
     * @return array The formatted file list
     */
//    private function uploadAndFormatFileList(array $files): array {
//        $returnFiles = [];
//        foreach ($files as $i => $file) {
//            $returnFiles[$i] = $files[$i];
//            unset($returnFiles[$i]['file']);
//            if (array_key_exists('file', $file) && $file['file'] instanceof UploadedFile) {
//                $returnFiles[$i]['path'] = Storage::put('assignments', $file['file']);
//                $returnFiles[$i]['mimetype'] = $file['file']->getMimeType();
//                $returnFiles[$i]['size'] = $file['file']->getSize();
//            }
//        }
//
//        return $returnFiles;
//    }
}
