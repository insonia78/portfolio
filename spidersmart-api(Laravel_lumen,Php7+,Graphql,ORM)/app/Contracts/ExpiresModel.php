<?php

namespace App\Contracts;

/**
 * Interface ExpiresModel
 * @package App\Contracts
 */
interface ExpiresModel
{
    /**
     * Retrieve created date
     * @return \DateTime The created date
     */
    public function getDateFrom(): ?\DateTime;

    /**
     * Set created date
     *
     * @param \DateTime $dateFrom The created date
     * @return void
     */
    public function setDateFrom(\DateTime $dateFrom);

    /**
     * Retrieve expiration date
     * @return \DateTime The created date
     */
    public function getDateTo(): ?\DateTime;

    /**
     * Set expiration date
     *
     * @param \DateTime $dateFrom The created date
     * @return void
     */
    public function setDateTo(\DateTime $dateFrom);
}
