<?php

namespace App\Http\Controllers;

use App\Helpers\UserContext;
use Dingo\Api\Http\Request;
use Doctrine\ORM\EntityManager;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Lcobucci\JWT\Parser;
use stdClass;

class UserContextController extends BaseController
{
    public function details(): \Illuminate\Http\JsonResponse
    {
        $response = new stdClass();

        // set user id
        $response->id = app(UserContext::class)->getId();

        // get permissions and roles
        $response->roles = app(UserContext::class)->getRoles();
        $response->permissions = app(UserContext::class)->getPermissions();
        $response->isImpersonating = app(UserContext::class)->isImpersonating();

        // get accessible centers
        $entityManager = app()->make(EntityManager::class);
        $query = $entityManager->getConnection()->prepare('SELECT c.id AS id, c.label AS label, c.name AS name FROM center c JOIN enrollment e ON c.id = e.center_id WHERE e.date_to IS NULL AND c.date_to IS NULL AND e.user_id=:id');
        $query->bindValue('id', app(UserContext::class)->getId());
        $query->execute();
        $accessibleCenters = $query->fetchAll();
        $response->centers = [];
        foreach ($accessibleCenters as $i => $accessibleCenter) {
            // get available subjects for center
            $query = $entityManager->getConnection()->prepare('SELECT s.id AS id, s.name AS name FROM subject s JOIN center_subject c ON c.subject_id=s.id WHERE c.center_id = ' . $accessibleCenter['id']);
            $query->execute();
            $subjects = $query->fetchAll();
            $subjectCount = sizeof($subjects);
            for ($j = 0; $j < $subjectCount; $j++) {
                $query = $entityManager->getConnection()->prepare('SELECT l.id AS id, l.name AS name FROM level l WHERE l.subject_id = ' . $subjects[$j]['id']);
                $query->execute();
                $subjects[$j]['levels'] = $query->fetchAll();
            }

            $response->centers[$i] = new stdClass();
            $response->centers[$i]->id = $accessibleCenter['id'];
            $response->centers[$i]->label = $accessibleCenter['label'];
            $response->centers[$i]->name = $accessibleCenter['name'];
            $response->centers[$i]->subjects = $subjects;
        }

        return response()->json($response);
    }
}
