<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFulltextIndexes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement('CREATE FULLTEXT INDEX title_fulltext ON assignment(`title`)');
        DB::statement('CREATE FULLTEXT INDEX description_fulltext ON assignment(`description`)');
        DB::statement('CREATE FULLTEXT INDEX name_fulltext ON author(`name`)');
        DB::statement('CREATE FULLTEXT INDEX title_fulltext ON book(`title`)');
        DB::statement('CREATE FULLTEXT INDEX description_fulltext ON book(`description`)');
        DB::statement('CREATE FULLTEXT INDEX name_fulltext ON genre(`name`)');
        DB::statement('CREATE FULLTEXT INDEX name_fulltext ON publisher(`name`)');
        DB::statement('CREATE FULLTEXT INDEX first_name_fulltext ON user(`first_name`)');
        DB::statement('CREATE FULLTEXT INDEX middle_name_fulltext ON user(`middle_name`)');
        DB::statement('CREATE FULLTEXT INDEX last_name_fulltext ON user(`last_name`)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('ALTER TABLE assignment DROP INDEX `title_fulltext`');
        DB::statement('ALTER TABLE assignment DROP INDEX `description_fulltext`');
        DB::statement('ALTER TABLE author DROP INDEX `name_fulltext`');
        DB::statement('ALTER TABLE book DROP INDEX `title_fulltext`');
        DB::statement('ALTER TABLE book DROP INDEX `description_fulltext`');
        DB::statement('ALTER TABLE genre DROP INDEX `name_fulltext`');
        DB::statement('ALTER TABLE publisher DROP INDEX `name_fulltext`');
        DB::statement('ALTER TABLE user DROP INDEX `first_name_fulltext`');
        DB::statement('ALTER TABLE user DROP INDEX `middle_name_fulltext`');
        DB::statement('ALTER TABLE user DROP INDEX `last_name_fulltext`');
    }
}
