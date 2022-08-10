<?php

namespace App\Exceptions;

use Illuminate\Support\MessageBag;

/**
 * Class ServiceValidationFailureException
 * @package App\Exceptions
 */
class ServiceValidationFailureException extends \Exception
{
    /**
     * MessageBag errors.
     *
     * @var \Illuminate\Support\MessageBag
     */
    protected $errors;

    /**
     * Create a new resource exception instance.
     *
     * @param string $message The exception message
     * @param \Illuminate\Support\MessageBag|array $errors Any validation errors returned
     * @param \Exception $previous The triggering exception
     * @param int $code The exception code
     *
     * @return void
     */
    public function __construct($message = null, $errors = null, \Exception $previous = null, $code = 0)
    {
        $this->errors = new MessageBag();
        if (!is_null($errors)) {
            $this->errors = is_array($errors) ? new MessageBag($errors) : $errors;
        }

        parent::__construct($message, $code, $previous);
    }

    /**
     * Get the errors message bag.
     *
     * @return \Illuminate\Support\MessageBag
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Determine if message bag has any errors.
     *
     * @return bool
     */
    public function hasErrors()
    {
        return !$this->errors->isEmpty();
    }
}
