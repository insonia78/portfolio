<?php

namespace App\Providers;

use DateTime;
use Dusterio\LumenPassport\LumenPassport;
use Carbon\Carbon;
use Laravel\Passport\Passport;
use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

//use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     * @SuppressWarnings(PHPMD.StaticAccess)
     *
     * @return void
     */
    public function boot()
    {
        LumenPassport::tokensExpireIn(Carbon::now()->addMinutes(480), 2);
        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->input('api_token')) {
                /** @phpstan-ignore-next-line */
                return User::where('api_token', $request->input('api_token'))->first();
            }
        });
    }
}
