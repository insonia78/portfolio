<?php

namespace App\Models\Entities\Secondary;

use App\Contracts\IdentifiableModel;
use App\Contracts\ExpiresModel;
use App\Models\Entities\Primary\Center;
use App\Traits\ModelEntity;
use App\Traits\ModelExpires;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\Table(name="center_hour_range")
 * @Gedmo\SoftDeleteable(fieldName="dateTo", timeAware=false)
 * @SuppressWarnings(PHPMD.StaticAccess)
 */
class CenterHourRange implements IdentifiableModel
{
    use ModelEntity;
    use ModelExpires;

    /**
     * @ORM\ManyToOne(targetEntity="\App\Models\Entities\Primary\Center", inversedBy="hours")
     * @ORM\JoinColumn(name="center_id", referencedColumnName="id")
     */
    protected $center;

    /**
     * @ORM\Column(type="string", length=1, options={"fixed" = true})
     */
    protected $day;

    /**
     * @ORM\Column(type="time")
     */
    protected $startTime;

    /**
     * @ORM\Column(type="time")
     */
    protected $endTime;

    /**
     * @return Center
     */
    public function getCenter(): ?Center
    {
        return $this->center;
    }

    /**
     * @param Center $center
     */
    public function setCenter(Center $center): void
    {
        $this->center = $center;
    }

    /**
     * @return string
     */
    public function getDay(): ?string
    {
        return $this->day;
    }

    /**
     * @param string $day
     */
    public function setDay(string $day): void
    {
        $this->day = $day;
    }

    /**
     * @return \DateTime
     */
    public function getStartTime(): ?\DateTime
    {
        return $this->startTime;
    }

    /**
     * @param string $startTime
     */
    public function setStartTime(string $startTime): void
    {
        $this->startTime = \DateTime::createFromFormat('H:i', $startTime);
    }

    /**
     * @return \DateTime
     */
    public function getEndTime(): ?\DateTime
    {
        return $this->endTime;
    }

    /**
     * @param string $endTime
     */
    public function setEndTime(string $endTime): void
    {
        $this->endTime = \DateTime::createFromFormat('H:i', $endTime);
    }
}
