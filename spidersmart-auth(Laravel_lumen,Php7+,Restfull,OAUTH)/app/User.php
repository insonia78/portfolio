<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Laravel\Passport\HasApiTokens;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use HasApiTokens;
    use Authenticatable;
    use Authorizable;

    /**
     * Name of the authentication table
     *
     * @var string
     */
    protected $table = 'user_auth';

    /**
     * Removing time stamp
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'type',
        'username',
//        'password'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'require_password_change'
    ];

    /**
     * Define method to find user for passport login
     * @SuppressWarnings(PHPMD.ExitExpression)
     * @todo: There should be a better way to perform this interaction than hijacking the passport user identifier lookup comparison function
     *          Also, even in this approach, it should use exception handling to manage error states rather than exit expressions
     *
     * @param string $username
     * @return mixed
     */
    public function findForPassport(string $username)
    {
        // strip out any email address from username
        $username = (strpos($username, '@') !== false) ? explode('@', $username)[0] : $username;

        /** @phpstan-ignore-next-line */
        $user = (new User())->where('username', $username)->where('is_active', true)->first();
        // if the require password change is set and in the future - the user MUST change their password before logging in
        if ($user && Carbon::now()->lt($user->require_password_change)) {
            $newPassword = request()->input('newPassword', null);
            $confirmNewPassword = request()->input('confirmNewPassword', null);

            // if password/confirm password fields don't exist or don't match, return a response
            if (strlen($newPassword) < 1 || strlen($confirmNewPassword) < 1) {
                http_response_code(409);
                die('Password must be reset.');
            } elseif ($newPassword !== $confirmNewPassword) {
                http_response_code(400);
                die();
            }

            $user->password = app('hash')->make($newPassword);
            $user->require_password_change = null;
            $user->save();
            http_response_code(205);
            die();
        }

        return $user;
    }
}
