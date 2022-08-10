<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Laravel\Lumen\Http\Redirector;
use Laravel\Lumen\Http\ResponseFactory;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Lcobucci\JWT\Parser;

class AccountController extends Controller
{
    /** @var string[] The list of account types which can be created or modified */
    private static $accountTypes = ['student', 'teacher', 'director'];

    /**
     * Retrieves data about a given user account
     * @param int $id The id of the account for which details should be retrieved
     * @param Request $request
     * @throws ModelNotFoundException
     * @return JsonResponse|Response
     */
    public function get(int $id, Request $request)
    {
        // ensure user is valid
        $user = User::query()->findOrFail($id);

        // ensure user has permissions to perform this action
        if (env('DISABLE_AUTHORIZATION') !== true) {
            try {
                $permissions = (new Parser())->parse($request->header('authorization'))->getClaim('permissions');
                /* @phpstan-ignore-next-line */
                if (!in_array($user->type . '-view', $permissions)) {
                    return response('Forbidden.', 403);
                }
            } catch (InvalidArgumentException $e) {
                return response('Unauthorized.', 403);
            }
        }

        return response()->json($user, 200);
    }


    /**
     * Creates a new user account
     * @param Request $request
     * @throws ValidationException
     * @return JsonResponse|Response
     * @todo Once upgraded to PHP 8, use union return type to match return
     */
    public function create(Request $request)
    {
        // ensure that the type is something we can handle
        if (!in_array($request->input('type', null), self::$accountTypes)) {
            return response('Bad Request.', 400);
        }

        // ensure user has permissions to perform this action
        if (env('DISABLE_AUTHORIZATION') !== true) {
            try {
                $permissions = (new Parser())->parse($request->header('authorization'))->getClaim('permissions');
                if (!in_array($request->input('type') . '-create', $permissions)) {
                    return response('Forbidden.', 403);
                }
            } catch (InvalidArgumentException $e) {
                return response('Unauthorized.', 403);
            }
        }

        //validate incoming request
        $this->validate($request, [
            'id' => 'required|integer|unique:user_auth,id|exists:user,id',
            'type' => 'required',
            'roles' => 'required',
            'username' => 'required|unique:user_auth,username',
            'password' => 'required',
        ], [
            'id.exists' => 'The provided user does not exist.',
            'id.unique' => 'The provided user already has an account.',
            'username.unique' => 'A user with that username already exists.'
        ]);

        try {
            $user = new User();
            /* @phpstan-ignore-next-line */
            $user->id = $request->input('id');
            /* @phpstan-ignore-next-line */
            $user->username = $request->input('username');
            /* @phpstan-ignore-next-line */
            $user->password = app('hash')->make($request->input('password'));
            /* @phpstan-ignore-next-line */
            $user->type = $request->input('type');
            $user->save();

            // add role associations
            $roles = [];
            $rolesInput = (!is_array($request->input('roles'))) ? explode(',', $request->input('roles')) : $request->input('roles');
            foreach ($rolesInput as $role) {
                $roles[] = [
                    'user_id' => $request->input('id'),
                    'role_id' => $role
                ];
            }
            DB::table('user_role')->insert($roles);

            //return successful response
            return response('Created.', 201);
        } catch (\Exception $e) {
            //return error message
            Log::error('An error occurred when attempting to create user authentication profile for user [' . $request->input('id') . ']: ' . $e->getMessage());
            return response()->json(['message' => 'The user authentication profile could not be created.'], 400);
        }
    }

    /**
     * Updates an account with the given details
     * @param int $id The id of the account to update
     * @param Request $request
     * @throws ValidationException
     * @throws ModelNotFoundException
     * @return JsonResponse|Response
     * @todo Once upgraded to PHP 8, use union return type to match return
     */
    public function update(int $id, Request $request)
    {
        // ensure that the type is something we can handle
        if (!in_array($request->input('type', null), self::$accountTypes)) {
            return response('Bad Request.', 400);
        }

        // ensure user has permissions to perform this action
        if (env('DISABLE_AUTHORIZATION') !== true) {
            try {
                $permissions = (new Parser())->parse($request->header('authorization'))->getClaim('permissions');
                if (!in_array($request->input('type') . '-update', $permissions)) {
                    return response('Forbidden.', 403);
                }
            } catch (InvalidArgumentException $e) {
                return response('Unauthorized.', 403);
            }
        }

        // ensure user is valid
        $user = User::query()->findOrFail($id);


        // ensure that given data is valid
        $validations = [];
        $validationMessages = [];

        // if username has changed
        if (!is_null($request->input('username', null))) {
            $validations['username'] = 'required|unique:user_auth,username,' . $id . ',id';
            $validationMessages['username.unique'] = 'A user with that username already exists.';
        }
        $this->validate($request, $validations, $validationMessages);

        try {
            if (!is_null($request->input('username', null))) {
                /* @phpstan-ignore-next-line */
                $user->username = $request->input('username');
            }
            if (!is_null($request->input('password', null))) {
                /* @phpstan-ignore-next-line */
                $user->password = app('hash')->make($request->input('password'));
            }
            $user->save();

            // TODO: HANDLE CHANGES IN ROLE ASSOCIATIONS HERE IF THAT IS CONTROLLABLE IN THIS PATH

            //return successful response
            return response('No Content.', 204);
        } catch (\Exception $e) {
            //return error message
            Log::error('An error occurred when attempting to create user authentication profile for user [' . $request->input('id') . ']: ' . $e->getMessage());
            return response()->json(['message' => 'The user authentication profile could not be created.'], 400);
        }
    }
}
