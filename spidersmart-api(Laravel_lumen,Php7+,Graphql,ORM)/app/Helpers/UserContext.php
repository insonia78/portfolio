<?php

namespace App\Helpers;

class UserContext
{
    /**
     * @var int The users id
     */
    private $id = null;

    /**
     * @var string[] The list of roles for the current user
     */
    private $roles = [];

    /**
     * @var string[] The list of permissions for the current user
     */
    private $permissions = [];

    /**
     * @var string The current token for the user
     */
    private $token = null;

    /**
     * @var bool Whether the user is impersonating another
     */
    private $isImpersonating = false;

    /**
     * Permissions constructor.
     * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
     *
     * @param int|null $id The id of the user
     * @param string[] $roles The roles which should exist
     * @param string[] $permissions The permissions which should exist
     * @param string|null $token The token of the user
     * @param bool $isImpersonating Whether the user is impersonating another
     */
    public function __construct(?int $id = null, array $roles = [], array $permissions = [], ?string $token = null, bool $isImpersonating = false)
    {
        $this->id = $id;
        $this->roles = $roles;
        $this->permissions = $permissions;
        $this->token = $token;
        $this->isImpersonating = $isImpersonating;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string[]
     */
    public function getRoles(): array
    {
        return $this->roles;
    }

    /**
     * @param string[] $roles
     */
    public function setRoles(array $roles): void
    {
        $this->roles = $roles;
    }

    /**
     * @return string[]
     */
    public function getPermissions(): array
    {
        return $this->permissions;
    }

    /**
     * @param string[] $permissions
     */
    public function setPermissions(array $permissions = [])
    {
        $this->permissions = $permissions;
    }

    /**
     * @return string|null
     */
    public function getToken(): ?string
    {
        return $this->token;
    }

    /**
     * @param string|null $token
     */
    public function setToken(?string $token): void
    {
        $this->token = $token;
    }

    /**
     * @return bool
     */
    public function isImpersonating(): bool
    {
        return $this->isImpersonating;
    }

    /**
     * @param bool $isImpersonating
     */
    public function setIsImpersonating(bool $isImpersonating): void
    {
        $this->isImpersonating = $isImpersonating;
    }
}
