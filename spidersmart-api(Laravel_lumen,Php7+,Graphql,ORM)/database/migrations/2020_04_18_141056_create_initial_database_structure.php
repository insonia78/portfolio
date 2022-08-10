<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInitialDatabaseStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // create all tables
        Schema::create('assignment', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('level_id')->unsigned()->nullable()->index();
            $table->integer('book_id')->unsigned()->nullable()->index();
            $table->string('title', 255);
            $table->string('description', 100)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('assignment_file', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assignment_id')->unsigned()->nullable()->index();
            $table->enum('role', ['answer_key', 'assignment', 'attachment'])->default('attachment');
        });
        Schema::create('assignment_submission', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('enrollment_id')->unsigned()->index();
            $table->integer('assignment_id')->unsigned()->index();
            $table->integer('book_checkout_id')->unsigned()->nullable()->index();
            $table->enum('status', ['new', 'draft', 'submitted', 'review_draft', 'pending_revision', 'revision_draft', 'revised', 'complete'])->default('new');
            $table->text('comments')->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('assignment_submission_answer', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assignment_submission_id')->unsigned()->index();
            $table->integer('question_id')->unsigned()->index();
            $table->text('answer')->nullable();
            $table->text('correction')->nullable();
            $table->text('comments')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('author', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name',100);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('book', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('level_id')->unsigned()->nullable()->index();
            $table->string('title', 255);
            $table->string('description', 5000)->nullable();
            $table->string('isbn', 16);
            $table->string('cover_image', 100)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('book_author', function (Blueprint $table) {
            $table->integer('book_id')->unsigned();
            $table->integer('author_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->primary(['book_id', 'author_id', 'date_from']);
        });
        Schema::create('book_checkout', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('enrollment_id')->unsigned()->index();
            $table->integer('book_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('book_genre', function (Blueprint $table) {
            $table->integer('book_id')->unsigned();
            $table->integer('genre_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->primary(['book_id', 'genre_id', 'date_from']);
        });
        Schema::create('book_publisher', function (Blueprint $table) {
            $table->integer('book_id')->unsigned();
            $table->integer('publisher_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->primary(['book_id', 'publisher_id', 'date_from']);
        });
        Schema::create('center', function (Blueprint $table) {
            $table->increments('id');
            $table->string('label', 100);
            $table->string('name', 100);
            $table->string('street_address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('country', 3)->nullable();
            $table->double('latitude', 10, 6)->nullable();
            $table->double('longitude', 10, 6)->nullable();
            $table->string('timezone', 25)->nullable();
            $table->string('email', 255);
            $table->boolean('is_visible')->default(true);
            $table->boolean('use_inventory')->default(true);
            $table->smallInteger('book_checkout_limit')->default(1);
            $table->enum('book_checkout_frequency', ['weekly','bi_weekly','semi_monthly','quad_weekly','monthly','bi_monthly','quarterly'])->default('weekly');
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('center_hour_range', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('center_id')->unsigned()->index();
            $table->char('day', 1);
            $table->time('start_time', 0);
            $table->time('end_time', 0);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('center_book', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('center_id')->unsigned()->index();
            $table->integer('book_id')->unsigned()->index();
            $table->smallInteger('quantity')->default(0);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('center_subject', function (Blueprint $table) {
            $table->integer('center_id')->unsigned();
            $table->integer('subject_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->primary(['center_id', 'subject_id', 'date_from']);
        });
        Schema::create('director', function (Blueprint $table) {
            $table->integer('id')->unsigned()->primary();
        });
        Schema::create('enrollment', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('center_id')->unsigned()->nullable()->index();
            $table->integer('user_id')->unsigned()->index();
            $table->integer('level_id')->unsigned()->nullable()->index();
            $table->integer('tuition_rate_id')->unsigned()->nullable()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('evaluation', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('enrollment_id')->unsigned()->index();
            $table->string('title',255);
            $table->enum('rating', ['poor', 'satisfactory', 'good', 'very good', 'excellent']);
            $table->string('comments', 1000);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('family', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('family_address', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('family_id')->unsigned()->index();
            $table->string('title', 255);
            $table->string('street_address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 3)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('family_contact', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('family_id')->unsigned()->index();
            $table->string('title', 255);
            $table->enum('type', ['mobile_phone', 'home_phone', 'work_phone', 'email']);
            $table->string('description', 1000)->nullable();
            $table->string('value', 100);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('family_user', function (Blueprint $table) {
            $table->integer('family_id')->unsigned()->index();
            $table->integer('user_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->primary(['family_id', 'user_id', 'date_from']);
        });
        Schema::create('file', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('type', ['resource', 'assignment', 'level']);
            $table->string('name', 255);
            $table->string('description', 1000)->nullable();
            $table->string('mimetype', 255);
            $table->string('path', 1000);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('genre', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('guardian', function (Blueprint $table) {
            $table->integer('id')->unsigned()->primary();
        });
        Schema::create('level', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('subject_id')->unsigned()->index();
            $table->string('name', 100);
            $table->string('description', 1000)->nullable();
            $table->enum('rule', ['standard', 'college'])->default('college');
            $table->smallInteger('vocab_lines')->unsigned()->default(2);
            $table->smallInteger('short_answer_lines')->unsigned()->default(3);
            $table->smallInteger('essay_lines')->unsigned()->default(30);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('level_file', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('level_id')->unsigned()->nullable()->index();
            $table->enum('role', ['answer_key', 'assessment'])->default('assessment');
        });
        Schema::create('publisher', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('question', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assignment_id')->unsigned()->index();
            $table->integer('assignment_section_id')->unsigned()->nullable()->index();
            $table->enum('type', ['vocab', 'short_answer', 'essay', 'multiple_choice', 'multiple_answer']);
            $table->text('question');
            $table->text('answer')->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('question_answer', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('question_id')->unsigned()->index();
            $table->text('answer');
            $table->boolean('is_correct')->default(false);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('assignment_section', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assignment_id')->unsigned()->index();
            $table->string('title', 100)->nullable();
            $table->text('instructions')->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('student', function (Blueprint $table) {
            $table->integer('id')->unsigned()->primary();
            $table->date('dob')->nullable();
            $table->enum('gender', ['M', 'F'])->nullable();
            $table->string('school', 255)->nullable();
        });
        Schema::create('subject', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->string('display_name', 100)->nullable();
            $table->string('display_icon', 100)->nullable();
            $table->string('description', 1000)->nullable();
            $table->boolean('has_books')->default(false);
            $table->boolean('has_articles')->default(false);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('teacher', function (Blueprint $table) {
            $table->integer('id')->unsigned()->primary();
        });
        Schema::create('teacher_student', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('teacher_id')->unsigned();
            $table->integer('student_id')->unsigned();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('tuition_rate', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100);
            $table->string('description', 1000)->nullable();
            $table->decimal('amount', 5, 2);
            $table->enum('pay_period', ['WEEK', 'BIWK', 'SMMO', 'FRWK', 'MONT', 'QTER', 'SMYR', 'YEAR']);
            $table->integer('pay_occurrences')->default(0);
            $table->enum('book_period', ['WEEK', 'BIWK', 'SMMO', 'FRWK', 'MONT', 'QTER', 'SMYR', 'YEAR']);
            $table->smallInteger('book_limit')->default(0);
            $table->enum('assignment_period', ['WEEK', 'BIWK', 'SMMO', 'FRWK', 'MONT', 'QTER', 'SMYR', 'YEAR']);
            $table->smallInteger('assignment_limit')->default(0);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('user', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('type', ['user', 'administrator', 'director', 'teacher', 'student', 'guardian'])->index();
            $table->string('prefix', 25)->nullable();
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('last_name', 100);
            $table->string('suffix', 25)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('user_address', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->string('title', 255);
            $table->string('street_address', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 3)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('user_contact', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index();
            $table->string('title', 255);
            $table->enum('type', ['mobile_phone', 'home_phone', 'work_phone', 'email']);
            $table->string('description', 1000)->nullable();
            $table->string('value', 100);
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });

        // set foreign keys for tables
        Schema::table('assignment', function (Blueprint $table) {
            $table->foreign('level_id')
                ->references('id')->on('level')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('previous_id')
                ->references('id')->on('assignment')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('assignment_file', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('file')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('assignment_id')
                ->references('id')->on('assignment')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('assignment_submission', function (Blueprint $table) {
            $table->foreign('enrollment_id')
                ->references('id')->on('enrollment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('assignment_id')
                ->references('id')->on('assignment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('book_checkout_id')
                ->references('id')->on('book_checkout')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('previous_id')
                ->references('id')->on('assignment_submission')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('assignment_submission_answer', function (Blueprint $table) {
            $table->foreign('assignment_submission_id')
                ->references('id')->on('assignment_submission')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('question_id')
                ->references('id')->on('question')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('author', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('author')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('book', function (Blueprint $table) {
            $table->foreign('level_id')
                ->references('id')->on('level')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('previous_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('book_author', function (Blueprint $table) {
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('author_id')
                ->references('id')->on('author')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('book_checkout', function (Blueprint $table) {
            $table->foreign('enrollment_id')
                ->references('id')->on('enrollment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('book_genre', function (Blueprint $table) {
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('genre_id')
                ->references('id')->on('genre')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('book_publisher', function (Blueprint $table) {
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('publisher_id')
                ->references('id')->on('publisher')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('center', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('center')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('center_hour_range', function (Blueprint $table) {
            $table->foreign('center_id')
                ->references('id')->on('center')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('center_book', function (Blueprint $table) {
            $table->foreign('center_id')
                ->references('id')->on('center')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('book_id')
                ->references('id')->on('book')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('center_subject', function (Blueprint $table) {
            $table->foreign('center_id')
                ->references('id')->on('center')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('subject_id')
                ->references('id')->on('subject')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('director', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('enrollment', function (Blueprint $table) {
            $table->foreign('center_id')
                ->references('id')->on('center')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('user_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('level_id')
                ->references('id')->on('level')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('tuition_rate_id')
                ->references('id')->on('tuition_rate')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('evaluation', function (Blueprint $table) {
            $table->foreign('enrollment_id')
                ->references('id')->on('enrollment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('family_address', function (Blueprint $table) {
            $table->foreign('family_id')
                ->references('id')->on('family')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('family_contact', function (Blueprint $table) {
            $table->foreign('family_id')
                ->references('id')->on('family')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('family_user', function (Blueprint $table) {
            $table->foreign('family_id')
                ->references('id')->on('family')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('user_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('file', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('file')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('genre', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('genre')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('guardian', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('level', function (Blueprint $table) {
            $table->foreign('subject_id')
                ->references('id')->on('subject')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('previous_id')
                ->references('id')->on('level')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('level_file', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('file')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('level_id')
                ->references('id')->on('level')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('publisher', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('publisher')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('question', function (Blueprint $table) {
            $table->foreign('assignment_id')
                ->references('id')->on('assignment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('assignment_section_id')
                ->references('id')->on('assignment_section')
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->foreign('previous_id')
                ->references('id')->on('question')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('question_answer', function (Blueprint $table) {
            $table->foreign('question_id')
                ->references('id')->on('question')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('previous_id')
                ->references('id')->on('question_answer')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('assignment_section', function (Blueprint $table) {
            $table->foreign('assignment_id')
                ->references('id')->on('assignment')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('previous_id')
                ->references('id')->on('assignment_section')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('student', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('subject', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('subject')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('teacher', function (Blueprint $table) {
            $table->foreign('id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('teacher_student', function (Blueprint $table) {
            $table->foreign('teacher_id')
                ->references('id')->on('teacher')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('student_id')
                ->references('id')->on('student')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('tuition_rate', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('tuition_rate')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('user', function (Blueprint $table) {
            $table->foreign('previous_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('set null');
        });
        Schema::table('user_address', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('user_contact', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });

        // insert required configuration or static data
        DB::table('subject')->insert([
            [
               'id' => 1,
               'name' => 'Reading & Writing',
               'description' => 'Program built around reading books and writing essays.'
            ],
            [
               'id' => 2,
               'name' => 'Math',
               'description' => 'Program teaching mathematics at all levels.'
            ],
            [
                'id' => 3,
                'name' => 'Current Events',
                'description' => 'Program built around reading articles and writing essays.'
            ],
            [
                'id' => 4,
                'name' => 'Test Preparation',
                'description' => 'Program built preparation for specific tests.'
            ],
            [
                'id' => 5,
                'name' => 'Beginning Reading',
                'description' => 'Program built to introduce students to reading books.'
            ],
            [
                'id' => 6,
                'name' => 'Masterpiece Short Stories',
                'description' => 'Program built around reading short stories and writing essays.'
            ],
            [
                'id' => 7,
                'name' => 'Wisdom Kids',
                'description' => ''
            ],
            [
                'id' => 8,
                'name' => 'Subject Tutoring',
                'description' => 'Tutoring for subjects other than math and English such as history, languages, or sciences.'
            ]
        ]);
        DB::table('level')->insert([
            [
                'id' => 1,
                'subject_id' => 1,
                'name' => '1'
            ],
            [
                'id' => 2,
                'subject_id' => 1,
                'name' => '2'
            ],
            [
                'id' => 3,
                'subject_id' => 1,
                'name' => '3'
            ],
            [
                'id' => 4,
                'subject_id' => 1,
                'name' => '4'
            ],
            [
                'id' => 5,
                'subject_id' => 1,
                'name' => '5'
            ],
            [
                'id' => 6,
                'subject_id' => 1,
                'name' => '6'
            ],
            [
                'id' => 7,
                'subject_id' => 1,
                'name' => '7'
            ],
            [
                'id' => 8,
                'subject_id' => 1,
                'name' => '8'
            ],
            [
                'id' => 9,
                'subject_id' => 1,
                'name' => '9'
            ],
            [
                'id' => 10,
                'subject_id' => 1,
                'name' => '10'
            ],
            [
                'id' => 11,
                'subject_id' => 1,
                'name' => '11'
            ],
            [
                'id' => 12,
                'subject_id' => 1,
                'name' => '12'
            ],
            [
                'id' => 13,
                'subject_id' => 2,
                'name' => '1'
            ],
            [
                'id' => 14,
                'subject_id' => 2,
                'name' => '2'
            ],
            [
                'id' => 15,
                'subject_id' => 2,
                'name' => '3'
            ],
            [
                'id' => 16,
                'subject_id' => 2,
                'name' => '4'
            ],
            [
                'id' => 17,
                'subject_id' => 2,
                'name' => '5'
            ],
            [
                'id' => 18,
                'subject_id' => 2,
                'name' => '6'
            ],
            [
                'id' => 19,
                'subject_id' => 2,
                'name' => '7'
            ],
            [
                'id' => 20,
                'subject_id' => 2,
                'name' => '8'
            ],
            [
                'id' => 21,
                'subject_id' => 2,
                'name' => '9'
            ],
            [
                'id' => 22,
                'subject_id' => 2,
                'name' => '10'
            ],
            [
                'id' => 23,
                'subject_id' => 2,
                'name' => '11'
            ],
            [
                'id' => 24,
                'subject_id' => 2,
                'name' => '12'
            ],
            [
                'id' => 25,
                'subject_id' => 3,
                'name' => '2'
            ],
            [
                'id' => 26,
                'subject_id' => 3,
                'name' => '3-4'
            ],
            [
                'id' => 27,
                'subject_id' => 3,
                'name' => '5-6'
            ],
            [
                'id' => 28,
                'subject_id' => 3,
                'name' => '7-8'
            ],
            [
                'id' => 29,
                'subject_id' => 3,
                'name' => '9-12'
            ],
            [
                'id' => 30,
                'subject_id' => 5,
                'name' => 'ER1'
            ],
            [
                'id' => 31,
                'subject_id' => 5,
                'name' => 'ER2'
            ],
            [
                'id' => 32,
                'subject_id' => 5,
                'name' => 'ER3'
            ],
            [
                'id' => 33,
                'subject_id' => 5,
                'name' => 'ER4'
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // remove foreign keys
        Schema::table('user_contact', function (Blueprint $table) {
            $table->dropForeign('user_contact_user_id_foreign');
        });
        Schema::table('user_address', function (Blueprint $table) {
            $table->dropForeign('user_address_user_id_foreign');
        });
        Schema::table('user', function (Blueprint $table) {
            $table->dropForeign('user_previous_id_foreign');
        });
        Schema::table('tuition_rate', function (Blueprint $table) {
            $table->dropForeign('tuition_rate_previous_id_foreign');
        });
        Schema::table('teacher_student', function (Blueprint $table) {
            $table->dropForeign('teacher_student_teacher_id_foreign');
            $table->dropForeign('teacher_student_student_id_foreign');
        });
        Schema::table('teacher', function (Blueprint $table) {
            $table->dropForeign('teacher_id_foreign');
        });
        Schema::table('subject', function (Blueprint $table) {
            $table->dropForeign('subject_previous_id_foreign');
        });
        Schema::table('student', function (Blueprint $table) {
            $table->dropForeign('student_id_foreign');
        });
        Schema::table('assignment_section', function (Blueprint $table) {
            $table->dropForeign('assignment_section_assignment_id_foreign');
        });
        Schema::table('question_answer', function (Blueprint $table) {
            $table->dropForeign('question_answer_question_id_foreign');
        });
        Schema::table('question', function (Blueprint $table) {
            $table->dropForeign('question_assignment_id_foreign');
            $table->dropForeign('question_assignment_section_id_foreign');
        });
        Schema::table('publisher', function (Blueprint $table) {
            $table->dropForeign('publisher_previous_id_foreign');
        });
        Schema::table('level_file', function (Blueprint $table) {
            $table->dropForeign('level_file_id_foreign');
            $table->dropForeign('level_file_level_id_foreign');
        });
        Schema::table('level', function (Blueprint $table) {
            $table->dropForeign('level_subject_id_foreign');
            $table->dropForeign('level_previous_id_foreign');
        });
        Schema::table('guardian', function (Blueprint $table) {
            $table->dropForeign('guardian_id_foreign');
        });
        Schema::table('genre', function (Blueprint $table) {
            $table->dropForeign('genre_previous_id_foreign');
        });
        Schema::table('file', function (Blueprint $table) {
            $table->dropForeign('file_previous_id_foreign');
        });
        Schema::table('family_user', function (Blueprint $table) {
            $table->dropForeign('family_user_family_id_foreign');
            $table->dropForeign('family_user_user_id_foreign');
        });
        Schema::table('family_contact', function (Blueprint $table) {
            $table->dropForeign('family_contact_family_id_foreign');
        });
        Schema::table('family_address', function (Blueprint $table) {
            $table->dropForeign('family_address_family_id_foreign');
        });
        Schema::table('evaluation', function (Blueprint $table) {
            $table->dropForeign('evaluation_enrollment_id_foreign');
        });
        Schema::table('enrollment', function (Blueprint $table) {
            $table->dropForeign('enrollment_center_id_foreign');
            $table->dropForeign('enrollment_user_id_foreign');
            $table->dropForeign('enrollment_level_id_foreign');
            $table->dropForeign('enrollment_tuition_rate_id_foreign');
        });
        Schema::table('director', function (Blueprint $table) {
            $table->dropForeign('director_id_foreign');
        });
        Schema::table('center_subject', function (Blueprint $table) {
            $table->dropForeign('center_subject_center_id_foreign');
            $table->dropForeign('center_subject_subject_id_foreign');
        });
        Schema::table('center_book', function (Blueprint $table) {
            $table->dropForeign('center_book_center_id_foreign');
            $table->dropForeign('center_book_book_id_foreign');
        });
        Schema::table('center_hour_range', function (Blueprint $table) {
            $table->dropForeign('center_hour_range_center_id_foreign');
        });
        Schema::table('center', function (Blueprint $table) {
            $table->dropForeign('center_previous_id_foreign');
        });
        Schema::table('book_publisher', function (Blueprint $table) {
            $table->dropForeign('book_publisher_book_id_foreign');
            $table->dropForeign('book_publisher_publisher_id_foreign');
        });
        Schema::table('book_genre', function (Blueprint $table) {
            $table->dropForeign('book_genre_book_id_foreign');
            $table->dropForeign('book_genre_genre_id_foreign');
        });
        Schema::table('book_checkout', function (Blueprint $table) {
            $table->dropForeign('book_checkout_enrollment_id_foreign');
            $table->dropForeign('book_checkout_book_id_foreign');
        });
        Schema::table('book_author', function (Blueprint $table) {
            $table->dropForeign('book_author_book_id_foreign');
            $table->dropForeign('book_author_author_id_foreign');
        });
        Schema::table('book', function (Blueprint $table) {
            $table->dropForeign('book_level_id_foreign');
            $table->dropForeign('book_previous_id_foreign');
        });
        Schema::table('author', function (Blueprint $table) {
            $table->dropForeign('author_previous_id_foreign');
        });
        Schema::table('assignment_submission_answer', function (Blueprint $table) {
            $table->dropForeign('assignment_submission_answer_assignment_submission_id_foreign');
            $table->dropForeign('assignment_submission_answer_question_id_foreign');
        });
        Schema::table('assignment_submission', function (Blueprint $table) {
            $table->dropForeign('assignment_submission_enrollment_id_foreign');
            $table->dropForeign('assignment_submission_assignment_id_foreign');
            $table->dropForeign('assignment_submission_book_checkout_id_foreign');
        });
        Schema::table('assignment_file', function (Blueprint $table) {
            $table->dropForeign('assignment_file_id_foreign');
            $table->dropForeign('assignment_file_assignment_id_foreign');
        });
        Schema::table('assignment', function (Blueprint $table) {
            $table->dropForeign('assignment_level_id_foreign');
            $table->dropForeign('assignment_book_id_foreign');
            $table->dropForeign('assignment_previous_id_foreign');
        });

        // drop tables
        Schema::dropIfExists('assignment');
        Schema::dropIfExists('assignment_file');
        Schema::dropIfExists('assignment_section');
        Schema::dropIfExists('assignment_submission');
        Schema::dropIfExists('assignment_submission_answer');
        Schema::dropIfExists('author');
        Schema::dropIfExists('book');
        Schema::dropIfExists('book_author');
        Schema::dropIfExists('book_checkout');
        Schema::dropIfExists('book_genre');
        Schema::dropIfExists('book_publisher');
        Schema::dropIfExists('center');
        Schema::dropIfExists('center_hour_range');
        Schema::dropIfExists('center_book');
        Schema::dropIfExists('center_subject');
        Schema::dropIfExists('director');
        Schema::dropIfExists('enrollment');
        Schema::dropIfExists('evaluation');
        Schema::dropIfExists('family');
        Schema::dropIfExists('family_address');
        Schema::dropIfExists('family_contact');
        Schema::dropIfExists('family_user');
        Schema::dropIfExists('file');
        Schema::dropIfExists('genre');
        Schema::dropIfExists('guardian');
        Schema::dropIfExists('level');
        Schema::dropIfExists('level_file');
        Schema::dropIfExists('publisher');
        Schema::dropIfExists('question');
        Schema::dropIfExists('question_answer');
        Schema::dropIfExists('student');
        Schema::dropIfExists('subject');
        Schema::dropIfExists('teacher');
        Schema::dropIfExists('teacher_student');
        Schema::dropIfExists('tuition_rate');
        Schema::dropIfExists('user');
        Schema::dropIfExists('user_address');
        Schema::dropIfExists('user_contact');
    }
}
