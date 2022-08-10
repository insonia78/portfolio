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
use App\Helpers\RepositoryIdentifier;
use App\Helpers\UserContext;
use App\Models\Entities\Primary\User;
use App\Transformers\UserTransformer;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\MessageBag;

/**
 * Class UserService
 * @package App\Services
 */
class UserService extends BaseService implements CrudService, BusinessModelService
{
    /**
     * @inheritDoc
     */
    protected $rules = [
        //'type' => 'required|in:user,administrator,director,teacher,student,guardian',
        'prefix' => 'alpha|nullable',
        'firstName' => 'alpha|required',
        'middleName' => 'alpha|nullable',
        'lastName' => 'alpha|required',
        'suffix' => 'alpha|nullable'
    ];

    /**
     * @inheritDoc
     */
    protected $ownedAssociations = [
        'addresses' => \App\Services\UserAddressService::class,
        'contacts' => \App\Services\UserContactService::class
    ];

    /**
     * @inheritDoc
     */
    protected $filterCriteria = [
        'center' => 'criteriaCenter'
    ];

    /**
     * Retrieve a user from given input data
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @return array The data returned for the entity
     *
     * @Access(permission="user-view")
     */
    public function get(array $inputs = []): array
    {
        // show "deleted" information to show full history of center
        if (isset($inputs['showDeleted']) && $inputs['showDeleted'] == 'true') {
            $this->entityManager->getFilters()->disable('soft-deleteable');
        }

        // support lookup by id or label
        if (!isset($inputs['id'])) {
            throw new ServiceEntityNotFoundException('No identifier was provided to find the entity.');
        }

        return $this->transform(
            $this->retrieveEntity(
                User::class,
                new RepositoryIdentifier($inputs['id'])
            ),
            new UserTransformer(),
            ['addresses', 'enrollments', 'enrollments.center', 'enrollments.level', 'enrollments.level.subject', 'contacts']
        );
    }

    /**
     * Retrieve all users
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entities could not be retrieved
     * @return array An array of returned entities
     *
     * @Access(permission="user-view")
     */
    public function getAll(array $inputs = []): array
    {
        return $this->transform(
            $this->retrieveCollection(
                User::class,
                $inputs['queryOptions'] ?? []
            ),
            new UserTransformer()
        );
    }

    /**
     * Create a new user
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceCreateFailureException If the create operation failed
     * @throws ServiceEntityNotFoundException If the entity model could not be found to create the entity
     * @return array The newly created entity data
     *
     * @Access(permission="user-create")
     */
    public function create(array $inputs): array
    {
        return $this->transform(
            $this->insert($inputs, new User()),
            new UserTransformer()
        );
    }

    /**
     * Updates a user with given information
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceValidationFailureException If the provided inputs are invalid
     * @throws ServiceUpdateFailureException If the update operation failed
     * @return array The updated entity data
     *
     * @Access(permission="user-update")
     */
    public function update(array $inputs): array
    {
        return $this->transform(
            $this->modify($inputs, $this->retrieveEntity(User::class, new RepositoryIdentifier($inputs['id']))),
            new UserTransformer()
        );
    }

    /**
     * Deletes a given user
     *
     * @param array $inputs The data provided for the request
     * @throws ServiceRetrieveFailureException If the entity could not be retrieved
     * @throws ServiceEntityNotFoundException If the entity was not found
     * @throws ServiceExpireFailureException If the expire operation failed
     * @return void
     *
     * @Access(permission="user-delete")
     */
    public function delete(array $inputs)
    {
        $this->expire(
            $this->retrieveEntity(User::class, new RepositoryIdentifier($inputs['id']))
        );
    }

    /**
     * Retrieves authentication details for the user
     * @SuppressWarnings(PHPMD.ElseExpression)
     * @param int $id The id of the user for which auth details should be retrieved
     * @throws ServiceRetrieveFailureException If there was an issue retrieving the profile data
     * @return Object|null User authentication details
     */
    protected function getAuthProfile(int $id): ?object
    {
        try {
            if (env('DISABLE_AUTHORIZATION') === true) {
                $client = new Client();
            } else {
                $token = app(UserContext::class)->getToken();
                $client = new Client(['headers' => ['authorization' => $token]]);
            }

            $response = $client->get(env('AUTH_URL') . '/account/' . $id);

            if ($response->getStatusCode() !== intval(200)) {
                throw new ServiceRetrieveFailureException('There was an issue retrieving the authentication details.');
            }
            return json_decode($response->getBody()->getContents());
        } catch (GuzzleException | Exception $e) {
            Log::error('Failed to retrieve authentication details for user with ID: ' . $id . ': ' . $e->getMessage());
            throw new ServiceRetrieveFailureException('There was an issue retrieving the authentication details.');
        }
    }

    /**
     * Attempts to create an authentication profile for the user
     * @SuppressWarnings(PHPMD.ElseExpression)
     *
     * @param array $inputs The user data to use when creating the profile
     * @throws ServiceValidationFailureException If there was an issue with the given profile data
     * @throws ServiceCreateFailureException If there was an issue creating the profile despite good data
     */
    protected function createAuthProfile(array $inputs)
    {
        try {
            if (env('DISABLE_AUTHORIZATION') === true) {
                $client = new Client();
            } else {
                $token = app(UserContext::class)->getToken();
                $client = new Client(['headers' => ['authorization' => $token]]);
            }

            $response = $client->post(env('AUTH_URL') . '/account', [
                'form_params' => $inputs
            ]);
            if ($response->getStatusCode() !== intval(201)) {
                throw new ServiceCreateFailureException('There was an issue creating the login profile.');
            }
        } catch (RequestException $e) {
            if ($e->getResponse()->getStatusCode() === intval(422)) {
                $errors = json_decode($e->getResponse()->getBody()->getContents());
                $errorMessages = new MessageBag();
                if (is_object($errors) && sizeof(get_object_vars($errors)) > 0) {
                    foreach ($errors as $field => $error) {
                        foreach ($error as $fieldError) {
                            $errorMessages->add($field, $fieldError);
                        }
                    }
                }
                throw new ServiceValidationFailureException('There was an issue creating the login profile.', $errorMessages);
            }
            throw new ServiceCreateFailureException('There was an issue creating the login profile.');
        } catch (GuzzleException | Exception $e) {
            throw new ServiceCreateFailureException('There was an issue creating the login profile.');
        }
    }

    /**
     * Attempts to update the authentication profile details for the user
     * @SuppressWarnings(PHPMD.ElseExpression)
     *
     * @param array $inputs The updated authentication details
     * @throws ServiceValidationFailureException If there was an issue with the given profile data
     * @throws ServiceUpdateFailureException If there was an issue creating the profile despite good data
     */
    protected function updateAuthProfile(array $inputs)
    {
        // generate body data
        $data = [
            'type' => $inputs['type']
        ];
        $updateableProperties = ['username', 'password'];
        foreach ($updateableProperties as $property) {
            if (array_key_exists($property, $inputs) && !empty($inputs[$property]) && !is_null($inputs[$property])) {
                $data[$property] = $inputs[$property];
            }
        }

        // active needs to be handled separately since it is a boolean value
        if (array_key_exists('active', $inputs)) {
            $data['active'] = $inputs['active'];
        }

        try {
            if (env('DISABLE_AUTHORIZATION') === true) {
                $client = new Client();
            } else {
                $token = app(UserContext::class)->getToken();
                $client = new Client(['headers' => ['authorization' => $token]]);
            }

            $response = $client->put(env('AUTH_URL') . '/account/' . $inputs['id'], [
                'form_params' => $data
            ]);

            if ($response->getStatusCode() !== intval(204)) {
                throw new ServiceUpdateFailureException('There was an issue updating the login profile.');
            }
        } catch (RequestException $e) {
            if ($e->getResponse()->getStatusCode() === intval(422)) {
                $errors = json_decode($e->getResponse()->getBody()->getContents());
                $errorMessages = new MessageBag();
                if (is_object($errors) && sizeof(get_object_vars($errors)) > 0) {
                    foreach ($errors as $field => $error) {
                        foreach ($error as $fieldError) {
                            $errorMessages->add($field, $fieldError);
                        }
                    }
                }
                throw new ServiceValidationFailureException('There was an issue updating the login profile.', $errorMessages);
            }
            throw new ServiceUpdateFailureException('There was an issue updating the login profile.');
        } catch (GuzzleException | Exception $e) {
            throw new ServiceUpdateFailureException('There was an issue updating the login profile.');
        }
    }
}
