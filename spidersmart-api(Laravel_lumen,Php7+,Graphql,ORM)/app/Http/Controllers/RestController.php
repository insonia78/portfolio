<?php

namespace App\Http\Controllers;

use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use Dingo\Api\Exception\DeleteResourceFailedException;
use Dingo\Api\Exception\UpdateResourceFailedException;
use Dingo\Api\Exception\StoreResourceFailedException;
use Dingo\Api\Http\Request;
use Dingo\Api\Http\Response;
use Dingo\Api\Routing\Helpers;
use FastRoute\BadRouteException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Lcobucci\JWT\Parser;

/**
 * Class RestController
 * @package App\Http\Controllers
 */
class RestController extends BaseController
{
    use Helpers;

    /**
     * @var array The parameters being passed to the request
     */
    private $parameters = [];

    /**
     * RestController constructor.
     *
     * @param Request $request The request to process
     * @throws BadRouteException  If there is no resolver in the route
     */
    public function __construct(Request $request)
    {
        // ensure that there is a resolver set in the route and prepare the service with it
        if (!is_array($request->route()[1]) || !array_key_exists('resolver', $request->route()[1])) {
            throw new BadRouteException('Missing resolver in route.');
        }
        $resolver = $request->route()[1]['resolver'];
        $this->prepareServiceFromResolver($resolver);

        // define parameters for this request by merging route path parameters and query variables
        // $request->route()[2] will always be all variables passed through path
        // @see https://stackoverflow.com/questions/48369687/getting-route-parameters-in-lumen
        $this->parameters = array_merge($request->route()[2], $request->input());
    }

    /**
     * Process a retrieval request
     *
     * @return Response relevant response based upon result of action
     */
    public function retrieve()
    {
        try {
            return new Response($this->service->{$this->methodName}($this->parameters));
        } catch (ServiceEntityNotFoundException $e) {
            throw new NotFoundHttpException($e->getMessage());
        }
    }

    /**
     * Process a create request
     *
     * @param Request $request The request to process
     * @return mixed relevant response based upon result of action
     */
    public function create(Request $request)
    {
        try {
            $entity = $this->service->{$this->methodName}($this->parameters);
        } catch (ServiceValidationFailureException $e) {
            throw new StoreResourceFailedException($e->getMessage(), $e->getErrors());
        } catch (ServiceCreateFailureException $e) {
            throw new StoreResourceFailedException($e->getMessage());
        } catch (\Exception $e) {
            throw new StoreResourceFailedException($e->getMessage());
        }
        return $this->response->created($request->fullUrl() . '/' . $entity['id']);
    }

    /**
     * Process a retrieval request
     *
     * @return mixed relevant response based upon result of action
     */
    public function update()
    {
        try {
            $this->service->{$this->methodName}($this->parameters);
        } catch (ServiceEntityNotFoundException $e) {
            throw new NotFoundHttpException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            throw new UpdateResourceFailedException($e->getMessage(), $e->getErrors());
        } catch (ServiceUpdateFailureException $e) {
            throw new UpdateResourceFailedException($e->getMessage());
        } catch (\Exception $e) {
            throw new UpdateResourceFailedException($e->getMessage());
        }
        return $this->response->noContent();
    }

    /**
     * Process a retrieval request
     *
     * @return mixed relevant response based upon result of action
     */
    public function delete()
    {
        try {
            $this->service->{$this->methodName}($this->parameters);
        } catch (ServiceEntityNotFoundException $e) {
            throw new NotFoundHttpException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            throw new DeleteResourceFailedException($e->getMessage(), $e->getErrors());
        } catch (ServiceExpireFailureException $e) {
            throw new DeleteResourceFailedException($e->getMessage());
        } catch (\Exception $e) {
            throw new DeleteResourceFailedException($e->getMessage());
        }
        return $this->response->noContent();
    }

    /**
     * Handles logout
     *
     * @param Request @request The request
     * @todo Remove this from here??  LOGOUT should be called directly from auth!
     *
     *
    public function logout(Request $request)
    {

        try {
            $tokenHeader = $request->header("authorization");
            $client = new \GuzzleHttp\Client(['headers' => ['authorization' => 'Bearer ' . $tokenHeader]]);

            //dd((new Parser())->parse($tokenHeader));
            $id = (new Parser())->parse((string)$tokenHeader)->getClaim('jti');

            $response = $client->delete('http://localhost:8080/api/logout/' . $id);

            return $this->response->noContent();
        } catch (Exception $e) {
            return response("there is an error", 401);
        }
        //  return response("Success",200);
    }*/
}
