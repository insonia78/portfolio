<?php

namespace App\Exceptions;

/**
 * Class AuthenticationException
 * @SuppressWarnings(PHPMD.ExitExpression)
 * @package App\Exceptions
 */
class AuthenticationException extends \Exception
{

    /**
     * This exception should only return an error message and die immediately, there is no app-level handling available.
     *
     * @param string $message The exception message
     * @return void
     */
    public function __construct($message = null)
    {
        http_response_code(401);
        die($message);
    }
}
