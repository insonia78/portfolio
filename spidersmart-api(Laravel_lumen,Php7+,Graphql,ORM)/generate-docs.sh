php artisan api:docs --output-file docs/rest/restdoc.md --use-controller=App\\Http\\Controllers\\BaseController
# aglio -i docs/rest/restdoc.md -o docs/rest/restdoc.html
php sami.phar update config/docs.php
