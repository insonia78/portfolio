<?php

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    /*
     * Base URL must be set this way to correctly receive responses from unit tests against routes
     */
    protected $baseUrl = 'http://127.0.0.1';

    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }

    public function graphql(string $query)
    {
        return $this->post('/graphql', [
           'query' => $query
        ]);
    }
}
