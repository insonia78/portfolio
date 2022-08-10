<?php

namespace App\Auth\Model;

use Exception;
use Laravel\Passport\Bridge\AccessToken as PassportAccessToken;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Token;
use League\OAuth2\Server\CryptKey;
use Illuminate\Support\Facades\DB;

class AccessToken extends PassportAccessToken
{
    private $privateKey;

    /**
     * Generate a string representation from the access token
     */
    public function __toString(): string
    {
        return (string) $this->buildJWT();
    }

    /**
     * Set the private key used to encrypt this access token.
     * @param CryptKey $privateKey
     */
    public function setPrivateKey(CryptKey $privateKey)
    {
        $this->privateKey = $privateKey;
    }

    /**
     * Returns the list of permissions for the user
     * @return array
     */
    private function getPermissions(): array
    {
        try {
            $response = DB::table('permission')
                ->join('role_permission', 'role_permission.permission_id', '=', 'permission.id')
                ->join('role', 'role_permission.role_id', '=', 'role.id')
                ->join('user_role', 'user_role.role_id', '=', 'role.id')
                ->where('user_role.user_id', '=', $this->getUserIdentifier())
                ->get('permission.title');
            return $response->map(function ($val) {
                return $val->title;
            })->toArray();
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Returns the list of roles for the user
     * @return array
     */
    private function getRoles(): array
    {
        try {
            $response = DB::table('user_role')
                ->where('user_role.user_id', '=', $this->getUserIdentifier())
                ->get('user_role.role_id');
            return $response->map(function ($val) {
                return $val->role_id;
            })->toArray();
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Returns the landing page for the user
     * @return string
     */
    private function getLandingPage(): string
    {
        try {
            $response = DB::table('user_auth')
                ->where('id', '=', $this->getUserIdentifier())
                ->first();
            return ($response->type === 'student') ? 'student' : 'admin';
        } catch (Exception $e) {
            return 'admin';
        }
    }

    /**
     * Build a JWT token from the existing key
     * @return Token
     */
    private function buildJWT(): Token
    {
        return (new Builder())
            ->permittedFor($this->getClient()->getIdentifier())
            ->identifiedBy($this->getIdentifier(), true)
            ->issuedAt(time())
            ->canOnlyBeUsedAfter(time())
            ->expiresAt($this->getExpiryDateTime()->getTimestamp())
            ->relatedTo($this->getUserIdentifier())
            ->withClaim('tokenId', $this->getIdentifier())
            ->withClaim('isImpersonating', false)
            ->withClaim('landingPage', $this->getLandingPage())
            ->withClaim('roles', $this->getRoles())
            ->withClaim('permissions', $this->getPermissions())
            ->withClaim('scopes', $this->getScopes())
//            ->sign(new Sha256(), new Key($this->privateKey->getKeyPath(), $this->privateKey->getPassPhrase()))
            ->getToken(new Sha256(), new Key($this->privateKey->getKeyPath(), $this->privateKey->getPassPhrase()));
    }
}
