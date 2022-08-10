<?php

namespace App\Helpers;

class RepositoryIdentifier
{
    /** @const Filter codes for validate filters */
    private const FILTER_VALIDATE = [
        FILTER_VALIDATE_INT,
        FILTER_VALIDATE_BOOLEAN,
        FILTER_VALIDATE_FLOAT,
        FILTER_VALIDATE_REGEXP,
        FILTER_VALIDATE_DOMAIN,
        FILTER_VALIDATE_URL,
        FILTER_VALIDATE_EMAIL,
        FILTER_VALIDATE_IP,
        FILTER_VALIDATE_MAC
    ];
    /** @const Filter codes for sanitize filters */
    private const FILTER_SANITIZE = [
        FILTER_DEFAULT,
        FILTER_UNSAFE_RAW,
        FILTER_SANITIZE_ADD_SLASHES,
        FILTER_SANITIZE_STRING,
        FILTER_SANITIZE_STRIPPED,
        FILTER_SANITIZE_ENCODED,
        FILTER_SANITIZE_SPECIAL_CHARS,
        FILTER_SANITIZE_FULL_SPECIAL_CHARS,
        FILTER_SANITIZE_EMAIL,
        FILTER_SANITIZE_URL,
        FILTER_SANITIZE_NUMBER_INT,
        FILTER_SANITIZE_NUMBER_FLOAT,
        FILTER_SANITIZE_MAGIC_QUOTES
    ];
    /**
     * @var string The value of the identifier
     */
    private $id;
    /**
     * @var string The object property which is the identifier
     */
    private $field;
    /**
     * @var int The type of validation to be performed to validate the field
     */
    private $type;

    /**
     * RepositoryIdentifier constructor.
     * @param string $id The value of the identifier
     * @param string $field The object property which is the identifier
     * @param int $type The type of validation to be performed to validate the field
     */
    public function __construct($id, $field = 'id', $type = FILTER_VALIDATE_INT)
    {
        $this->id = $id;
        $this->field = $field;
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getField()
    {
        return $this->field;
    }

    /**
     * @param mixed $field
     */
    public function setField($field)
    {
        $this->field = $field;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * Validate the repository identifier id against the validation type
     *
     * @return bool
     */
    public function validate()
    {
        // perform either validate or sanitize action based on the type code
        if (in_array($this->type, self::FILTER_VALIDATE)) {
            return (filter_var($this->id, $this->type) !== false);
        } elseif (in_array($this->type, self::FILTER_SANITIZE)) {
            return (filter_var($this->id, $this->type) === $this->id);
        }
        // if neither a sanitize or validate filter is applied, fail validation
        return false;
    }
}
