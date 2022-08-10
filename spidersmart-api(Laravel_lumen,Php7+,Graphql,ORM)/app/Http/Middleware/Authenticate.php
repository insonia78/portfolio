<?php

namespace App\Http\Middleware;

use App\Exceptions\AuthenticationException;
use App\Helpers\UserContext;
use Closure;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Lcobucci\JWT\Parser;

class Authenticate
{
    /**
     * The total number of tries to attempt to validate a token before giving up
     */
//    private $TOKEN_VALIDATE_TRIES = 3;

    /**
     * The authentication guard factory instance.
     *
     * @var Auth
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param Auth $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     * @throws AuthenticationException
     */
    public function handle(Request $request, Closure $next)
    {
        if (env('DISABLE_AUTHORIZATION') === true) {
            return $next($request);
        }

        // temporarily bypass extra token validation check here - ONLY TEMPORARY - SEE NOTE BELOW
        try {
            $token = $request->header("authorization");
            $userContext = app(UserContext::class);
            $tokenDetails = (new Parser())->parse($token);
            // NOTE: sub is defined by the relatedTo method
            // @see https://github.com/lcobucci/jwt/blob/4.1.x/src/Token/Builder.php#L68
            // @see https://github.com/lcobucci/jwt/blob/4.1.x/src/Token/RegisteredClaims.php#L76
            $userContext->setId($tokenDetails->getClaim('sub'));
            $userContext->setRoles($tokenDetails->getClaim('roles'));
            $userContext->setPermissions($tokenDetails->getClaim('permissions'));
            $userContext->setIsImpersonating($tokenDetails->getClaim('isImpersonating'));

            $userContext->setToken($token);
            return $next($request);
        } catch (GuzzleException $e) {
            throw new AuthenticationException('Authentication token could not be validated.  Are you sure you\'re logged in?');
        } catch (\Exception $e) {
            throw new AuthenticationException('An unexpected error occurred when trying to verify authentication token. Please try again.');
        }

        /*
         * NOTE!!!
         * For some reason in the production environment this check will fail sporadically on valid tokens
         * It seems to happen when the token is checked the first time after being issued so for example
         * User logs in, gets redirected to panel, immediately gets told login is invalid.  If they hit refresh in the browser,
         * things are ok - but if they follow the message, they just get looped forever
         *
         * Seems to be an issue with the automatic route generated with oauth/tokens
         * Can probably most easily be solved by rolling our own validation route and using that instead
         *

        // sometimes token validation fails even for a valid token on the first attempt to validate it since issue
        // this may be a timing issue, so attempt to validate more than once before concluding that the token is actually invalid
        for ($i = 0; $i < $this->TOKEN_VALIDATE_TRIES; $i++) {
            if ($this->isTokenValid($token)) {
                $userContext = app(UserContext::class);
                $tokenDetails = (new Parser())->parse($token);
                // NOTE: sub is defined by the relatedTo method
                // @see https://github.com/lcobucci/jwt/blob/4.1.x/src/Token/Builder.php#L68
                // @see https://github.com/lcobucci/jwt/blob/4.1.x/src/Token/RegisteredClaims.php#L76
                $userContext->setId($tokenDetails->getClaim('sub'));
                $userContext->setRoles($tokenDetails->getClaim('roles'));
                $userContext->setPermissions($tokenDetails->getClaim('permissions'));
                $userContext->setIsImpersonating($tokenDetails->getClaim('isImpersonating'));
                $userContext->setToken($token);
                return $next($request);
            }
        }

        // at this point, all attempts have failed, so it must really be invalid - throw an error
        throw new AuthenticationException('Authentication token could not be validated.  Are you sure you\'re logged in?');
        */
    }
/*
    private function isTokenValid(string $token): bool
    {
        try {
            $client = new Client(['headers' => ['authorization' => 'Bearer ' . $token]]);
            $response = $client->get(env('AUTH_URL') . '/oauth/tokens');
            return ($response->getStatusCode() == '200');
        } catch (GuzzleException $e) {
            Log::error('Token Validation Exception Occurred: ' . $e->getMessage());
            return false;
        } catch (\Exception $e) {
            Log::error('Token Validation Exception Occurred: ' . $e->getMessage());
            return false;
        }
    }*/
}
