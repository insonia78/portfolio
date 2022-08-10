<?php

namespace App\Helpers;

class RepositoryFilter
{
    /**
     * @var string The table upon which the filter should be performed
     */
    private $table = null;

    /**
     * @var string The field upon which this filter should be performed
     */
    private $field;

    /**
     * @var string The value to which the filter will compare
     */
    private $value;

    /**
     * @var string|null The comparison used to filter
     */
    private $comparison;

    /**
     * @var string|null The comparison mode to use, only applicable to certain comparisons
     */
    private $comparisonMode;

    /**
     * @var int The relative weights of fields provided when using a match comparison, all undefined weights will be set to 10
     */
    private $fieldWeight;

    /**
     * RepositoryFilter constructor.
     * @param string|null $table The table upon which the filter should be performed
     * @param string|null $field The field upon which the filter should be performed
     * @param string|array $value The value which should be used for filtering
     * @param string|null $comparison The type of comparison to use
     * @param int $fieldWeight The relative weights of fields provided when using a match comparison
     * @param string|null $comparisonMode The comparison mode to use, only applicable to certain comparison types
     *        If comparison is contains/!contains, available modes are: direct, tokenized
     *        If comparison is matches, available modes are: natural, boolean, expanded
     */
    public function __construct(?string $table, ?string $field, $value, ?string $comparison = null, int $fieldWeight = 10, ?string $comparisonMode = null)
    {
        $this->table = $table;
        $this->field = $field;
        $this->value = $value;
        if (is_null($comparison)) {
            $comparison = (is_array($value)) ? 'in' : '=';
        }
        $this->comparison = $comparison;
        $this->fieldWeight = $fieldWeight;
        $comparisonMode = (is_null($comparisonMode) && $comparison === 'matches') ? 'natural' : $comparisonMode;
        $comparisonMode = (is_null($comparisonMode) && ($comparison === 'contains' || $comparison === '!contains')) ? 'direct' : $comparisonMode;
        $this->comparisonMode = $comparisonMode;
    }

    /**
     * @return string|null
     */
    public function getTable(): ?string
    {
        return $this->table;
    }

    /**
     * @param string|null $table
     */
    public function setTable(?string $table): void
    {
        $this->table = $table;
    }

    /**
     * @return string|null
     */
    public function getField(): ?string
    {
        return $this->field;
    }

    /**
     * @param string|null $field
     */
    public function setField(?string $field)
    {
        $this->field = $field;
    }

    /**
     * @return string|null
     */
    public function getComparison(): ?string
    {
        return $this->comparison;
    }

    /**
     * @param string|null $comparison
     */
    public function setComparison(?string $comparison)
    {
        $this->comparison = $comparison;
    }

    /**
     * @return string|null
     */
    public function getComparisonMode(): ?string
    {
        return $this->comparisonMode;
    }

    /**
     * @param string|null $comparisonMode
     */
    public function setComparisonMode(?string $comparisonMode): void
    {
        $this->comparisonMode = $comparisonMode;
    }

    /**
     * @return int
     */
    public function getFieldWeight(): int
    {
        return $this->fieldWeight;
    }

    /**
     * @param int $fieldWeight
     */
    public function setFieldWeight(int $fieldWeight)
    {
        $this->fieldWeight = $fieldWeight;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }

    /**
     * @param mixed $value
     */
    public function setValue($value)
    {
        $this->value = $value;
    }
}
