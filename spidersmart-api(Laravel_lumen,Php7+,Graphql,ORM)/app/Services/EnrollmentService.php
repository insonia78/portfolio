<?php

namespace App\Services;

use App\Contracts\BusinessModelService;
use App\Helpers\RepositoryFilter;
use App\Models\Entities\Relation\Enrollment;
use App\Transformers\EnrollmentTransformer;
use Illuminate\Support\Facades\Log;

/**
 * Class EnrollmentService
 * @package App\Services
 */
class EnrollmentService extends BaseService implements BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
//        'type' => 'required|string'
    ];

    /**
     * @inheritDoc
     */
    protected $relationships = [
        'center' => \App\Services\CenterService::class,
        'level' => \App\Services\LevelService::class,
        'books' => \App\Services\BookService::class,
        'assignments' => \App\Services\AssignmentSubmissionService::class
    ];

    /**
     * Returns the ids of all versions of the given enrollment
     * @param Enrollment $enrollment The enrollment for which history should be returned
     * @return array A list of ids for historical versions of this enrollment
     */
    public function getVersions(Enrollment $enrollment): array
    {
        // get all assigned students for this teacher
        try {
            $sql = $this->entityManager->getConnection()->prepare('SELECT e.id FROM enrollment e JOIN level l ON e.level_id=l.id WHERE e.user_id=:userid AND e.center_id=:centerid AND l.subject_id = :subjectid AND e.id <> :currentid ORDER BY e.date_from DESC');
            $sql->bindValue('currentid', $enrollment->getId());
            $sql->bindValue('userid', $enrollment->getUserId());
            $sql->bindValue('centerid', $enrollment->getCenter()->getId());
            $sql->bindValue('subjectid', $enrollment->getLevel()->getSubject()->getId());
            $sql->execute();
            $result = $sql->fetchAllNumeric();
            return array_column($result, 0);
        } catch (\Doctrine\DBAL\Exception | \Doctrine\DBAL\Driver\Exception $e) {
            Log::error('An error occurred while trying to lookup enrollment history for enrollment (ID: ' . $enrollment->getId() . '): ' . $e->getMessage());
            return [];
        }
    }
}
