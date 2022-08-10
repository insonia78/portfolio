<?php

namespace App\Http\Controllers;

use App\Exceptions\ServiceCreateFailureException;
use App\Exceptions\ServiceEntityNotFoundException;
use App\Exceptions\ServiceExpireFailureException;
use App\Exceptions\ServiceUpdateFailureException;
use App\Exceptions\ServiceValidationFailureException;
use Illuminate\Support\MessageBag;
use Dingo\Api\Http\Response;
use ReflectionObject;

/**
 * Class GraphQLController
 * @package App\Http\Controllers
 */
class GraphQLController extends BaseController
{
    /**
     * @var int Determines how many nested layers in return field query are supported
     */
    private const RETURN_FIELD_DEPTH = 5;
    /**
     * @var string|null The name of the field in the schema which is being invoked
     */
    private $fieldName = null;
    /**
     * @var string|null The type of operation being performed (this helps determine the format of output)
     */
    private $operation = null;
    /**
     * @var array The fields which are to be returned from the current mutation upon success
     */
    private $returnFields = [];
    /**
     * @var array The parameters provided to the query or mutation
     */
    private $parameters = [];
    /**
     * @var int The total count of results sent back
     */
    private $resultCount = 0;
    /**
     * @var boolean Whether the response data is a collection
     */
    private $isResponseCollection = false;
    /**
     * @var array The constraints provided to the query or mutation
     */
    private $constraints = [];
    /**
     * @var mixed Expected return type of the field being resolved
     */
    private $returnType = null;

    /**
     * Initialize the state of the request
     *
     * @param string $resolver The resolver which was resolves the operation
     * @param array $args The arguments which are passed to the operation
     * @param \GraphQL\Type\Definition\ResolveInfo $info Information about the resolver
     * @return void
     */
    public function __construct($resolver, array $args, $info)
    {
        // prepare service from given resolver
        $this->prepareServiceFromResolver($resolver);

        // define parameters and the fields which should be returned
        $this->parameters = $args;
        $this->returnFields = $info->getFieldSelection($this::RETURN_FIELD_DEPTH);
        $this->operation = $info->operation->operation;
        $this->fieldName = $info->fieldName;
        $this->returnType = $info->returnType;
        $this->constraints = (array_key_exists('queryOptions', $args)) ? $args['queryOptions'] : [];
    }

    /**
     * Process a retrieval query on a single entity
     *
     * @return array
     */
    public function retrieve(): array
    {
        try {
            return $this->generateResponse(
                $this->service->{$this->methodName}($this->parameters)
            );
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process a retrieval query on a collection
     *
     * @return array
     */
    public function retrieveCollection(): array
    {
        $this->isResponseCollection = true;
        try {
            $result = $this->service->{$this->methodName}($this->parameters);
            $this->resultCount = (array_key_exists('count', $result)) ? $result['count'] : $this->resultCount;
            return $this->generateResponse($result['data']);
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process a create mutation
     *
     * @return array
     */
    public function create(): array
    {
        try {
            $entity = $this->service->{$this->methodName}($this->parameters);
            return $this->generateResponse(
                $this->convertEntityToArray($entity)
            );
        } catch (ServiceValidationFailureException $e) {
            return $this->handleException($e->getMessage(), $e->getErrors());
        } catch (ServiceCreateFailureException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process an update mutation
     *
     * @return array
     */
    public function update(): array
    {
        try {
            $entity = $this->service->{$this->methodName}($this->parameters);
            return $this->generateResponse(
                $this->convertEntityToArray($entity)
            );
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            return $this->handleException($e->getMessage(), $e->getErrors());
        } catch (ServiceUpdateFailureException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process a delete mutation
     *
     * @return array
     */
    public function delete(): array
    {
        try {
            $this->service->{$this->methodName}($this->parameters);
            return $this->generateResponse(null);
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            return $this->handleException($e->getMessage(), $e->getErrors());
        } catch (ServiceExpireFailureException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process a mutation which doesn't modify any entity but only creates a relation
     *
     * @return array
     */
    public function relate(): array
    {
        try {
            $entity = $this->service->{$this->methodName}($this->parameters);
            return $this->generateResponse(
                $this->convertEntityToArray($entity)
            );
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            return $this->handleException($e->getMessage(), $e->getErrors());
        } catch (ServiceCreateFailureException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Process a mutation which doesn't modify any entity but only removes a relation
     *
     * @return array
     */
    public function dissociate(): array
    {
        try {
            $this->service->{$this->methodName}($this->parameters);
            return $this->generateResponse(null);
        } catch (ServiceEntityNotFoundException $e) {
            return $this->handleException($e->getMessage());
        } catch (ServiceValidationFailureException $e) {
            return $this->handleException($e->getMessage(), $e->getErrors());
        } catch (ServiceExpireFailureException $e) {
            return $this->handleException($e->getMessage());
        } catch (\Exception $e) {
            return $this->handleException($e->getMessage());
        }
    }

    /**
     * Transforms a returned model instance into an array containing the output of instances getters
     * @SuppressWarnings(PHPMD.ElseExpression)
     *
     * @param \App\Contracts\IdentifiableModel|array $entity The entity from which return data will be generated
     * @return array An array representation of the data from the entity
     */
    private function convertEntityToArray($entity = null): array
    {
        if (is_array($entity)) {
            return $entity;
        }
        $data = [];
        $ref = new ReflectionObject($entity);
        foreach ($ref->getMethods() as $method) {
            if (substr($method->name, 0, 3) == 'get') {
                $propName = strtolower(substr($method->name, 3, 1)) . substr($method->name, 4);
                $propVal = $method->invoke($entity);

                // in the case of a nested mutation result, a property could be a collection of results
                // this is returned as a Doctrine Persistent Collection
                if ($propVal instanceof \Doctrine\ORM\PersistentCollection) {
                    $propRelations = $method->invoke($entity)->unwrap()->toArray();
                    foreach ($propRelations as $relation) {
                        $data[$propName][] = $this->convertEntityToArray($relation);
                    }
                } else {
                    $data[$propName] = $method->invoke($entity);
                }
            }
        }
        return $data;
    }

    /**
     * Handles exception states and generates a properly formatted GraphQL error response
     *
     * @param string $message The overall error message
     * @param MessageBag|null $errors The list of validation errors returned from the action, if any
     * @return array
     */
    private function handleException($message, MessageBag $errors = null): array
    {
        $errorList = [['message' => $message]];
        if (!is_null($errors) && $errors instanceof MessageBag) {
            $errorList = [];
            foreach ($errors->getMessages() as $field => $messages) {
                foreach ($messages as $msg) {
                    $error = [
                        'message' => $msg
                    ];
                    if (!is_int($field)) {
                        $error['extensions'] = [
                            'field' => $field
                        ];
                    }
                    array_push($errorList, $error);
                }
            }
        }
        return $this->generateResponse(null, $errorList);
    }

    /**
     * Generates a proper response based on operation and error status
     * @SuppressWarnings(PHPMD.ExitExpression)
     *
     * @param array|null $data The data to return in the response
     * @param array $errorList A list of errors which exist for this operation
     * @return array
     */
    private function generateResponse($data = null, array $errorList = [])
    {
        // if this is a query and there's an error, the data will not match the correct format and will return a
        // schema validation error, so issue the response and die to show the actual error
        if (is_array($errorList) && sizeof($errorList) > 0) {
            $response = [
                "success" => false,
                "data" => $data,
                "errors" => $errorList,
                "metadata" => [
                    'count' => 0,
                    'queryOptions' => $this->constraints
                ]
            ];
            Response::create(json_encode($response), 200, [
                'Content-Type' => 'application/json'
            ])->send();
            die();
        }

        // return different response format for mutations
        if ($this->operation == 'mutation') {
            return [
                "success" => true,
                "data" => $data
            ];
        }

        // if this is a collection response, return data/metadata format
        if ($this->isResponseCollection) {
            return [
                "data" => $data,
                "metadata" => [
                    'count' => $this->resultCount,
                    'queryOptions' => $this->constraints
                ]
            ];
        }

        // otherwise, this is a single entity retrieval response, just return that
        return $data;
    }
}
