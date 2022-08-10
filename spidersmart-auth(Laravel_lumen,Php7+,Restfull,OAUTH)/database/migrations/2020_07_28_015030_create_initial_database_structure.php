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
        Schema::create('permission', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100)->notNullable();
            $table->string('description', 255)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('role', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 100)->notNullable();
            $table->string('description', 255)->nullable();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('previous_id')->unsigned()->nullable()->index();
        });
        Schema::create('role_permission', function (Blueprint $table) {
            $table->integer('role_id')->unsigned()->index();
            $table->integer('permission_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });
        Schema::create('user_auth', function (Blueprint $table) {
            $table->integer('id')->unsigned()->index();
            $table->enum('type', ['user', 'administrator', 'director', 'teacher', 'student', 'guardian'])->index();
            $table->string('username', 100)->unique()->notNullable();
            $table->string('password', 100)->notNullable();
            $table->boolean('is_active')->default(true);
        });
        Schema::create('user_role', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->index();
            $table->integer('role_id')->unsigned()->index();
            $table->timestamp('date_from')->useCurrent();
            $table->timestamp('date_to')->nullable();
        });

        // set foreign keys for tables
        Schema::table('role_permission', function (Blueprint $table) {
            $table->foreign('role_id')
                ->references('id')->on('role')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('permission_id')
                ->references('id')->on('permission')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('user_auth', function (Blueprint $table) {
            $table->foreign(['type', 'id'])
                ->references(['type', 'id'])->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
        Schema::table('user_role', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('user')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreign('role_id')
                ->references('id')->on('role')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });


        // insert required configuration or static data
        DB::table('permission')->insert([
            [
                'id' => 1,
                'title' => 'admincp-access',
                'description' => 'Can access the Admin CP.'
            ],
            [
                'id' => 2,
                'title' => 'studentcp-access',
                'description' => 'Can access the Student CP.'
            ],
            [
                'id' => 3,
                'title' => 'virtual-access',
                'description' => 'Can access controls related to virtual offerings.'
            ],
            [
                'id' => 4,
                'title' => 'administrator-view',
                'description' => 'Can view administrative users.'
            ],
            [
                'id' => 5,
                'title' => 'assignment-view',
                'description' => 'Can view assignments.'
            ],
            [
                'id' => 6,
                'title' => 'assignment-create',
                'description' => 'Can create new assignments.'
            ],
            [
                'id' => 7,
                'title' => 'assignment-update',
                'description' => 'Can update assignments.'
            ],
            [
                'id' => 8,
                'title' => 'assignment-delete',
                'description' => 'Can delete (expire) assignments.'
            ],
            [
                'id' => 9,
                'title' => 'assignment-submit',
                'description' => 'Can submit assignments and assignment revisions.'
            ],
            [
                'id' => 10,
                'title' => 'assignment-assign',
                'description' => 'Can assign assignments to students.'
            ],
            [
                'id' => 11,
                'title' => 'assignment-review',
                'description' => 'Can review assignments.'
            ],
            [
                'id' => 12,
                'title' => 'assignment-complete',
                'description' => 'Can complete assignments.'
            ],
            [
                'id' => 13,
                'title' => 'author-view',
                'description' => 'Can view authors.'
            ],
            [
                'id' => 14,
                'title' => 'author-create',
                'description' => 'Can create new authors.'
            ],
            [
                'id' => 15,
                'title' => 'author-update',
                'description' => 'Can update authors.'
            ],
            [
                'id' => 16,
                'title' => 'author-delete',
                'description' => 'Can delete (expire) authors.'
            ],
            [
                'id' => 17,
                'title' => 'book-view',
                'description' => 'Can view books.'
            ],
            [
                'id' => 18,
                'title' => 'book-create',
                'description' => 'Can create new books.'
            ],
            [
                'id' => 19,
                'title' => 'book-update',
                'description' => 'Can update books.'
            ],
            [
                'id' => 20,
                'title' => 'book-delete',
                'description' => 'Can delete (expire) books.'
            ],
            [
                'id' => 21,
                'title' => 'book-checkout',
                'description' => 'Can checkout books.'
            ],
            [
                'id' => 22,
                'title' => 'book-return',
                'description' => 'Can return checked out books.'
            ],
            [
                'id' => 23,
                'title' => 'center-view',
                'description' => 'Can view centers.'
            ],
            [
                'id' => 24,
                'title' => 'center-create',
                'description' => 'Can create new centers.'
            ],
            [
                'id' => 25,
                'title' => 'center-update',
                'description' => 'Can update centers.'
            ],
            [
                'id' => 26,
                'title' => 'center-delete',
                'description' => 'Can delete (expire) centers.'
            ],
            [
                'id' => 27,
                'title' => 'center-manage-books',
                'description' => 'Can manage a center\'s book inventory.'
            ],
            [
                'id' => 28,
                'title' => 'director-view',
                'description' => 'Can view directors.'
            ],
            [
                'id' => 29,
                'title' => 'director-create',
                'description' => 'Can create new directors.'
            ],
            [
                'id' => 30,
                'title' => 'director-update',
                'description' => 'Can update directors.'
            ],
            [
                'id' => 31,
                'title' => 'director-delete',
                'description' => 'Can delete (expire) directors.'
            ],
            [
                'id' => 32,
                'title' => 'director-impersonate',
                'description' => 'Can impersonate directors.'
            ],
            [
                'id' => 33,
                'title' => 'genre-view',
                'description' => 'Can view genres.'
            ],
            [
                'id' => 34,
                'title' => 'genre-create',
                'description' => 'Can create new genres.'
            ],
            [
                'id' => 35,
                'title' => 'genre-update',
                'description' => 'Can update genres.'
            ],
            [
                'id' => 36,
                'title' => 'genre-delete',
                'description' => 'Can delete (expire) genres.'
            ],
            [
                'id' => 37,
                'title' => 'guardian-view',
                'description' => 'Can view guardians.'
            ],
            [
                'id' => 38,
                'title' => 'guardian-create',
                'description' => 'Can create new guardians.'
            ],
            [
                'id' => 39,
                'title' => 'guardian-update',
                'description' => 'Can update guardians.'
            ],
            [
                'id' => 40,
                'title' => 'guardian-delete',
                'description' => 'Can delete (expire) guardians.'
            ],
            [
                'id' => 41,
                'title' => 'level-view',
                'description' => 'Can view levels.'
            ],
            [
                'id' => 42,
                'title' => 'level-create',
                'description' => 'Can create new levels.'
            ],
            [
                'id' => 43,
                'title' => 'level-update',
                'description' => 'Can update levels.'
            ],
            [
                'id' => 44,
                'title' => 'level-delete',
                'description' => 'Can delete (expire) levels.'
            ],
            [
                'id' => 45,
                'title' => 'publisher-view',
                'description' => 'Can view publishers.'
            ],
            [
                'id' => 46,
                'title' => 'publisher-create',
                'description' => 'Can create new publishers.'
            ],
            [
                'id' => 47,
                'title' => 'publisher-update',
                'description' => 'Can update publishers.'
            ],
            [
                'id' => 48,
                'title' => 'publisher-delete',
                'description' => 'Can delete (expire) publishers.'
            ],
            [
                'id' => 49,
                'title' => 'resource-view',
                'description' => 'Can view resources.'
            ],
            [
                'id' => 50,
                'title' => 'resource-create',
                'description' => 'Can create new resources.'
            ],
            [
                'id' => 51,
                'title' => 'resource-update',
                'description' => 'Can update resources.'
            ],
            [
                'id' => 52,
                'title' => 'resource-delete',
                'description' => 'Can delete (expire) resources.'
            ],
            [
                'id' => 53,
                'title' => 'subject-view',
                'description' => 'Can view subjects.'
            ],
            [
                'id' => 54,
                'title' => 'subject-create',
                'description' => 'Can create new subjects.'
            ],
            [
                'id' => 55,
                'title' => 'subject-update',
                'description' => 'Can update subjects.'
            ],
            [
                'id' => 56,
                'title' => 'subject-delete',
                'description' => 'Can delete (expire) subjects.'
            ],
            [
                'id' => 57,
                'title' => 'student-view',
                'description' => 'Can view all students.'
            ],
            [
                'id' => 58,
                'title' => 'student-create',
                'description' => 'Can create new students.'
            ],
            [
                'id' => 59,
                'title' => 'student-update',
                'description' => 'Can update students.'
            ],
            [
                'id' => 60,
                'title' => 'student-delete',
                'description' => 'Can delete (expire) students.'
            ],
            [
                'id' => 61,
                'title' => 'student-assign',
                'description' => 'Can assign students to teachers.'
            ],
            [
                'id' => 62,
                'title' => 'student-impersonate',
                'description' => 'Can impersonate students.'
            ],
            [
                'id' => 63,
                'title' => 'teacher-view',
                'description' => 'Can view teachers.'
            ],
            [
                'id' => 64,
                'title' => 'teacher-create',
                'description' => 'Can create new teachers.'
            ],
            [
                'id' => 65,
                'title' => 'teacher-update',
                'description' => 'Can update teachers.'
            ],
            [
                'id' => 66,
                'title' => 'teacher-delete',
                'description' => 'Can delete (expire) teachers.'
            ],
            [
                'id' => 67,
                'title' => 'teacher-impersonate',
                'description' => 'Can impersonate teachers.'
            ],
            [
                'id' => 68,
                'title' => 'student-view-assigned',
                'description' => 'Can view students who are assigned to the logged in user.'
            ]
        ]);
        DB::table('role')->insert([
            [
                'id' => 1,
                'title' => 'administrator',
                'description' => 'User with full administrative rights to perform any action.'
            ],
            [
                'id' => 2,
                'title' => 'director',
                'description' => 'Center directors and managers.  Rights to manage their centers, teachers, and students.'
            ],
            [
                'id' => 3,
                'title' => 'student',
                'description' => 'Students who have rights to access the student panel and perform book/assignment checkout and submission actions.'
            ],
            [
                'id' => 4,
                'title' => 'teacher',
                'description' => 'Teachers who have rights to manage their students.'
            ]
        ]);
        DB::table('role_permission')->insert([
            // administrator
            [ 'role_id' => 1, 'permission_id' => 1 ],
            [ 'role_id' => 1, 'permission_id' => 2 ],
            [ 'role_id' => 1, 'permission_id' => 3 ],
            [ 'role_id' => 1, 'permission_id' => 4 ],
            [ 'role_id' => 1, 'permission_id' => 5 ],
            [ 'role_id' => 1, 'permission_id' => 6 ],
            [ 'role_id' => 1, 'permission_id' => 7 ],
            [ 'role_id' => 1, 'permission_id' => 8 ],
            [ 'role_id' => 1, 'permission_id' => 9 ],
            [ 'role_id' => 1, 'permission_id' => 10 ],
            [ 'role_id' => 1, 'permission_id' => 11 ],
            [ 'role_id' => 1, 'permission_id' => 12 ],
            [ 'role_id' => 1, 'permission_id' => 13 ],
            [ 'role_id' => 1, 'permission_id' => 14 ],
            [ 'role_id' => 1, 'permission_id' => 15 ],
            [ 'role_id' => 1, 'permission_id' => 16 ],
            [ 'role_id' => 1, 'permission_id' => 17 ],
            [ 'role_id' => 1, 'permission_id' => 18 ],
            [ 'role_id' => 1, 'permission_id' => 19 ],
            [ 'role_id' => 1, 'permission_id' => 20 ],
            [ 'role_id' => 1, 'permission_id' => 21 ],
            [ 'role_id' => 1, 'permission_id' => 22 ],
            [ 'role_id' => 1, 'permission_id' => 23 ],
            [ 'role_id' => 1, 'permission_id' => 24 ],
            [ 'role_id' => 1, 'permission_id' => 25 ],
            [ 'role_id' => 1, 'permission_id' => 26 ],
            [ 'role_id' => 1, 'permission_id' => 27 ],
            [ 'role_id' => 1, 'permission_id' => 28 ],
            [ 'role_id' => 1, 'permission_id' => 29 ],
            [ 'role_id' => 1, 'permission_id' => 30 ],
            [ 'role_id' => 1, 'permission_id' => 31 ],
            [ 'role_id' => 1, 'permission_id' => 32 ],
            [ 'role_id' => 1, 'permission_id' => 33 ],
            [ 'role_id' => 1, 'permission_id' => 34 ],
            [ 'role_id' => 1, 'permission_id' => 35 ],
            [ 'role_id' => 1, 'permission_id' => 36 ],
            [ 'role_id' => 1, 'permission_id' => 37 ],
            [ 'role_id' => 1, 'permission_id' => 38 ],
            [ 'role_id' => 1, 'permission_id' => 39 ],
            [ 'role_id' => 1, 'permission_id' => 40 ],
            [ 'role_id' => 1, 'permission_id' => 41 ],
            [ 'role_id' => 1, 'permission_id' => 42 ],
            [ 'role_id' => 1, 'permission_id' => 43 ],
            [ 'role_id' => 1, 'permission_id' => 44 ],
            [ 'role_id' => 1, 'permission_id' => 45 ],
            [ 'role_id' => 1, 'permission_id' => 46 ],
            [ 'role_id' => 1, 'permission_id' => 47 ],
            [ 'role_id' => 1, 'permission_id' => 48 ],
            [ 'role_id' => 1, 'permission_id' => 49 ],
            [ 'role_id' => 1, 'permission_id' => 50 ],
            [ 'role_id' => 1, 'permission_id' => 51 ],
            [ 'role_id' => 1, 'permission_id' => 52 ],
            [ 'role_id' => 1, 'permission_id' => 53 ],
            [ 'role_id' => 1, 'permission_id' => 54 ],
            [ 'role_id' => 1, 'permission_id' => 55 ],
            [ 'role_id' => 1, 'permission_id' => 56 ],
            [ 'role_id' => 1, 'permission_id' => 57 ],
            [ 'role_id' => 1, 'permission_id' => 58 ],
            [ 'role_id' => 1, 'permission_id' => 59 ],
            [ 'role_id' => 1, 'permission_id' => 60 ],
            [ 'role_id' => 1, 'permission_id' => 61 ],
            [ 'role_id' => 1, 'permission_id' => 62 ],
            [ 'role_id' => 1, 'permission_id' => 63 ],
            [ 'role_id' => 1, 'permission_id' => 64 ],
            // director
            [ 'role_id' => 2, 'permission_id' => 1 ],
            [ 'role_id' => 2, 'permission_id' => 5 ],
            [ 'role_id' => 2, 'permission_id' => 10 ],
            [ 'role_id' => 2, 'permission_id' => 11 ],
            [ 'role_id' => 2, 'permission_id' => 12 ],
            [ 'role_id' => 2, 'permission_id' => 13 ],
            [ 'role_id' => 2, 'permission_id' => 17 ],
            [ 'role_id' => 2, 'permission_id' => 21 ],
            [ 'role_id' => 2, 'permission_id' => 23 ],
            [ 'role_id' => 2, 'permission_id' => 25 ],
            [ 'role_id' => 2, 'permission_id' => 27 ],
            [ 'role_id' => 2, 'permission_id' => 32 ],
            [ 'role_id' => 2, 'permission_id' => 40 ],
            [ 'role_id' => 2, 'permission_id' => 44 ],
            [ 'role_id' => 2, 'permission_id' => 52 ],
            [ 'role_id' => 2, 'permission_id' => 56 ],
            [ 'role_id' => 2, 'permission_id' => 57 ],
            [ 'role_id' => 2, 'permission_id' => 58 ],
            [ 'role_id' => 2, 'permission_id' => 59 ],
            [ 'role_id' => 2, 'permission_id' => 60 ],
            [ 'role_id' => 2, 'permission_id' => 61 ],
            [ 'role_id' => 2, 'permission_id' => 62 ],
            [ 'role_id' => 2, 'permission_id' => 63 ],
            [ 'role_id' => 2, 'permission_id' => 64 ],
            // student
            [ 'role_id' => 3, 'permission_id' => 2 ],
            [ 'role_id' => 3, 'permission_id' => 9 ],
            [ 'role_id' => 3, 'permission_id' => 21 ],
            [ 'role_id' => 3, 'permission_id' => 23 ],
            // teacher
            [ 'role_id' => 4, 'permission_id' => 1 ],
            [ 'role_id' => 4, 'permission_id' => 10 ],
            [ 'role_id' => 4, 'permission_id' => 11 ],
            [ 'role_id' => 4, 'permission_id' => 12 ],
            [ 'role_id' => 4, 'permission_id' => 68 ]
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
        Schema::table('user_role', function (Blueprint $table) {
            $table->dropForeign('user_role_user_id_foreign');
            $table->dropForeign('user_role_role_id_foreign');
        });
        Schema::table('user_auth', function (Blueprint $table) {
            $table->dropForeign('user_auth_user_id_foreign');
        });
        Schema::table('role_permission', function (Blueprint $table) {
            $table->dropForeign('role_permission_role_id_foreign');
            $table->dropForeign('role_permission_permission_id_foreign');
        });

        // drop tables
        Schema::dropIfExists('permission');
        Schema::dropIfExists('role');
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('user_auth');
        Schema::dropIfExists('user_permission');
    }
}
