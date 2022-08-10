<?php

namespace App\Traits;

use DateTime;

/**
 * Trait ModelExpires
 * Adds expiration traits for models
 * @package App\Traits
 */
trait ModelExpires
{
    /**
     * @ORM\Column(type="datetime")
     */
    protected $dateFrom;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $dateTo;

    /**
     * @return DateTime
     */
    public function getDateFrom(): ?DateTime
    {
        return $this->dateFrom;
    }

    /**
     * @param DateTime|null $dateFrom
     */
    public function setDateFrom(?DateTime $dateFrom)
    {
        $this->dateFrom = $dateFrom;
    }

    /**
     * @return DateTime
     */
    public function getDateTo(): ?DateTime
    {
        return $this->dateTo;
    }

    /**
     * @param DateTime|null $dateTo
     */
    public function setDateTo(?DateTime $dateTo)
    {
        if (!is_null($dateTo)) {
            $this->dateTo = $dateTo;
        }
    }
}
