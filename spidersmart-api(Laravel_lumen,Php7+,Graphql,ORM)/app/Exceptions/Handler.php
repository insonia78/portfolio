<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception The exception to report
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     * @SuppressWarnings(PHPMD.UndefinedVariable)
     * @SuppressWarnings(PHPMD.ShortVariable)
     *
     * @param  Request $request The request which resulted in this exception
     * @param  Exception $e The exception to render
     * @return Response|JsonResponse
     */
    public function render($request, Exception $e)
    {
        /**
         * @var Response|JsonResponse $parentResponse
         */
        $parentResponse = parent::render($request, $e);
        if (env('APP_DEBUG', false) || $parentResponse instanceof JsonResponse) {
            return $parentResponse;
        }

        return new JsonResponse([
            'message' => $e instanceof HttpException
                ? $e->getMessage()
                : Response::$statusTexts[$parentResponse->getStatusCode()],
        ], $parentResponse->getStatusCode());
    }
}
