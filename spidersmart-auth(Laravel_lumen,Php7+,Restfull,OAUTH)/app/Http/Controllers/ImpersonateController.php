<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Token;
use League\OAuth2\Server\CryptKey;
use App\User;
use Lcobucci\JWT\Builder;
use Laravel\Lumen\Routing\Controller as BaseController;
use DateTimeZone;

/**
 * Impersonate Controller Class creates a impersonation token
 */
class ImpersonateController extends BaseController
{
    private const STUDENT_ROLE_ID = 3;

    /**
     * @var string[] The list of permissions which will allow impersonate actions to occur
     */
    private $impersonationPermissions = ['student-impersonate', 'teacher-impersonate', 'director-impersonate'];

    /**
     * Creates the token for impersonation
     * @param Request $request
     * @return JsonResponse|Response The authentication token for the impersonated user
     */
    public function impersonate(Request $request)
    {
        // ensure that the id exists
        $id = $request->input('id', null);
        if (is_null($id)) {
            return response('Bad Request.', 400);
        }

        // get token details
        $token = (new Parser())->parse($request->header("authorization"));

        // ensure user has permissions to perform this action
        if (env('DISABLE_AUTHORIZATION') !== true) {
            $permissions = $token->getClaim('permissions');
            if (sizeof(array_intersect($this->impersonationPermissions, $permissions)) < 1) {
                return response('Forbidden.', 403);
            }
        }

        // ensure the user to impersonate exists
        User::query()->findOrFail($id);

        // generate impersonation ids list
        $impersonatorIds = ($token->hasClaim('impersonatorId')) ? $token->getClaim('impersonatorId') : [];
        array_push($impersonatorIds, $token->getClaim('sub'));

        try {
            $this->revokeImpersonatorToken($token->getClaim('jti'));
            $jti = $this->generateJti();
            $refreshToken = $this->generateRefreshToken();
            $this->insertJtiToOauthAccessToken($jti, $id);
            $this->insertJtiToOauthRefreshToken($jti, $refreshToken);
        } catch (Exception $e) {
            Log::error('Exception occurred during impersonation for user ' . $token->getClaim('sub') . ' impersonating ' . $id . ': ' . $e->getMessage());
            return response('An error occurred while starting impersonation.', 500);
        }

        // set redirect based on type of user
        $roles = $this->getRoles($id);
        // STUDENT role is 3
        // @todo  Replace this with a database-driven solution... maybe each role has a redirect field or something??
        // @todo If they do, how to handle multiple roles???
        $redirectPrefix = (env('APP_SSL')) ? 'https://' : 'http://';
        $redirectSubdomain = (sizeof($roles) > 0 && $roles[0] === self::STUDENT_ROLE_ID) ? 'student' : 'admin';
        $redirect = $redirectPrefix . $redirectSubdomain . '.' . env('APP_DOMAIN');

        $newToken = (new Builder())
            ->permittedFor(env('AUTH_CLIENT_ID'))
            ->identifiedBy($jti, true)
            ->issuedAt(time())
            ->canOnlyBeUsedAfter(time())
            ->expiresAt(time() + 28800)
            ->relatedTo($id)
            ->withClaim('isImpersonating', true)
            ->withClaim('impersonatorId', $impersonatorIds)
            ->withClaim('roles', $this->getRoles($id))
            ->withClaim('permissions', $this->getPermissions($id))
            ->withClaim('scopes', '[*]')
            ->getToken(new Sha256(), new Key('file://' . storage_path() . '/oauth-private.key', null));
        return response()->json([
            'access_token' => (string) $newToken,
            'domain' => env('APP_DOMAIN'),
            'redirect' => $redirect
        ]);
    }

    /**
     * Deactivates impersonation token and re-establishes original user
     * @param Request $request
     * @return JsonResponse|Response The authentication token validating the original user
     */
    public function stopImpersonation(Request $request)
    {
        // get token details
        $token = (new Parser())->parse($request->header("authorization"));
        $userIdentifier = $token->getClaim('jti');
        $trueId = $token->getClaim('impersonatorId')[0];

        try {
            $this->revokeImpersonatorToken($userIdentifier);
            $jti = $this->generateJti();
            $refreshToken = $this->generateRefreshToken();
            $this->insertJtiToOauthAccessToken($jti, $trueId);
            $this->insertJtiToOauthRefreshToken($jti, $refreshToken);
        } catch (Exception $e) {
            Log::error('Exception occurred during stop impersonation for user ' . $trueId . ' impersonating ' . $userIdentifier . ': ' . $e->getMessage());
            return response('An error occurred while starting impersonation.', 500);
        }

        $newToken = (new Builder())
            ->permittedFor(env('AUTH_CLIENT_ID'))
            ->identifiedBy($jti, true)
            ->issuedAt(time())
            ->canOnlyBeUsedAfter(time())
            ->expiresAt(time() + 28800)
            ->relatedTo($trueId)
            ->withClaim('isImpersonating', false)
            ->withClaim('roles', $this->getRoles($trueId))
            ->withClaim('permissions', $this->getPermissions($trueId))
            ->withClaim('scopes', '[*]')
            ->sign(new Sha256(), new Key('file://' . storage_path() . '/oauth-private.key', null))
            ->getToken();

        $redirectPrefix = (env('APP_SSL')) ? 'https://' : 'http://';
        return response()->json([
            'access_token' => (string) $newToken,
            'domain' => env('APP_DOMAIN'),
            'redirect' => $redirectPrefix . 'admin.' . env('APP_DOMAIN')
        ]);
    }

    /**
     * Returns the list of roles for the user
     * @param int|null $id The id of the user for which roles should be retrieved
     * @return array The roles of the given user
     */
    private function getRoles($id = null): array
    {
        try {
            $response = DB::table('user_role')
                ->where('user_role.user_id', '=', $id)
                ->get('user_role.role_id');
            return $response->map(function ($val) {
                return $val->role_id;
            })->toArray();
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Returns the list of permissions for the user
     * @param int|null $id The id of the user for which permissions should be retrieved
     * @return array The permissions of the given user
     */
    private function getPermissions($id = null): array
    {
        try {
            $response = DB::table('permission')
                ->join('role_permission', 'role_permission.permission_id', '=', 'permission.id')
                ->join('role', 'role_permission.role_id', '=', 'role.id')
                ->join('user_role', 'user_role.role_id', '=', 'role.id')
                ->where('user_role.user_id', '=', $id)
                ->get('permission.title');
            return $response->map(function ($val) {
                return $val->title;
            })->toArray();
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Generates jti
     * @return string The JTI string
     */
    private function generateJti(): string
    {
        return dechex(date("oW", strtotime("1970-01-01")) * time()) . dechex(date("Ymd") * time() * 1000) . dechex(time() * 1000) . dechex(time() * time());
    }

    /**
     * Generates refresh token
     * @return string The token string
     */
    private function generateRefreshToken(): string
    {
        return dechex(time() * time()) . dechex(time() * 1000) . dechex(date("Ymd") * time() * 1000) . dechex(date("oW", strtotime("1970-01-01")) * time());
    }

    /**
     * Inserts jti token to oauth_access_tokens table
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param string $jti The jti to use for the token id
     * @param int $id The user id
     * @throws Exception If the query fails to update the token table
     */
    private function insertJtiToOauthAccessToken(string $jti, int $id)
    {
        $clientId = env('AUTH_CLIENT_ID');
        $scope = env('AUTH_CLIENT_SCOPE');
        DB::statement("INSERT INTO oauth_access_tokens(id,user_id,client_id,name,scopes,revoked,created_at,updated_at,expires_at) VALUES('{$jti}',{$id},{$clientId},NULL,'{$scope}',0,NOW(),NOW(),NOW() + INTERVAL ':10' DAY_HOUR)");
    }

    /**
     * Inserts refreshToken token to oauth_refresh_tokens table
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @param string $jti The jti to use for the token id
     * @param string $refreshToken
     * @throws Exception If the query fails to update the token table
     */
    private function insertJtiToOauthRefreshToken(string $jti, string $refreshToken)
    {
        DB::statement("INSERT INTO oauth_refresh_tokens(id,access_token_id,revoked,expires_at) VALUES('{$jti}','{$refreshToken}',0,NOW() + INTERVAL ':10' DAY_HOUR)");
    }

    /**
     * Revoke Token from oauth_access_tokens and oauth_refresh_tokens
     * @param string $jti
     * @throws Exception If the query fails to revoke the tokens
     */
    private function revokeImpersonatorToken(string $jti)
    {
        DB::table('oauth_access_tokens')->where('id', '=', $jti)->update(['revoked' => 1]);
        DB::table('oauth_refresh_tokens')->where('access_token_id', '=', $jti)->update(['revoked' => 1]);
    }
}
