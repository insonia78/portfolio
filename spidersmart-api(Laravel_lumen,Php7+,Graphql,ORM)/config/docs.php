<?php

use Sami\Sami;
use Symfony\Component\Finder\Finder;

$iterator = Finder::create()
    ->files()
    ->name('*.php')
    ->exclude('Jobs')
    ->in('app');

return new Sami($iterator, array(
    'title' => 'SpiderSmart API Documentation',
    'build_dir' => 'docs/api'
));
