<?php

namespace App\Exceptions;

/**
 * Class AuthorizationException
 * @SuppressWarnings(PHPMD.ExitExpression)
 * @package App\Exceptions
 */
class AuthorizationException extends \Exception
{

    /**
     * This exception should only return an error message and die immediately, there is no app-level handling available.
     *
     * @param string $message The exception message
     * @return void
     */
    public function __construct($message = null)
    {
        http_response_code(403);
        die($message);
    }
}
