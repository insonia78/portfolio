<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Laravel\Lumen\Http\Redirector;
use Laravel\Lumen\Http\ResponseFactory;
use Laravel\Lumen\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Lcobucci\JWT\Parser;

class TokenController extends Controller
{
    /**
     * This will revoke a token provided in a cookie
     * @param Request $request
     * @return RedirectResponse|Redirector
     */
    public function logoutFromCookie(Request $request)
    {
        $redirect = '/' . (($request->query('redirect')) ?  '?redirect=' . $request->query('redirect') : '');
        if (!$request->hasCookie('auth')) {
            // no cookie exists, go back to login
            return redirect($redirect, 302, [], env('APP_SSL'));
        }
        try {
            $tokenId = (new Parser())->parse($request->cookie('auth'))->getHeader('jti');
            DB::table('oauth_access_tokens')->where('id', '=', $tokenId)->update(['revoked' => 1]);
            DB::table('oauth_refresh_tokens')->where('access_token_id', '=', $tokenId)->update(['revoked' => 1]);
            // token was successfully revoked, so delete cookie
            setcookie('auth', null, time() - 1000, '/', '.' . env('APP_DOMAIN'));
            // finally redirect back to login page
            return redirect($redirect, 302, [], env('APP_SSL'));
        } catch (\Exception $e) {
            return redirect($redirect, 302, [], env('APP_SSL'));
        }
    }


    /**
     * This will revoke a token provided in an auth header
     * @param Request $request
     * @return Response|ResponseFactory
     */
    public function logoutFromHeader(Request $request)
    {
        try {
            $tokenId = (new Parser())->parse($request->header('authorization'))->getHeader('jti');
            DB::table('oauth_access_tokens')->where('id', '=', $tokenId)->update(['revoked' => 1]);
            DB::table('oauth_refresh_tokens')->where('access_token_id', '=', $tokenId)->update(['revoked' => 1]);
            return response('Token was successfully revoked.', 200);
        } catch (\InvalidArgumentException $e) {
            return response('No token was sent to logout. Are you sure you\'re logged in?', 401);
        } catch (\Exception $e) {
            return response('Unauthorized', 401);
        }
    }
}
