<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // note: the order of the seeding is important!  It must go books->assignments->centers->users->enrollments!!
        $this->command->info('Seeding books, authors, publishers, genres, and all relationships...');
        $this->call('BookSeeder');
        $this->command->info('Books, authors, publishers, genres, and all relationships seeded!');

        $this->command->info('Seeding assignments, question categories, questions, and answers...');
        $this->call('AssignmentSeeder');
        $this->command->info('Assignments, question categories, questions, and answers seeded!');

        $this->command->info('Seeding centers and center book inventories...');
        $this->call('CenterSeeder');
        $this->command->info('Centers and center book inventories seeded!');

        $this->command->info('Seeding students, teachers, and directors, along with addresses and contacts...');
        $this->call('UserSeeder');
        $this->command->info('Students, teachers, and directors, along with addresses and contacts seeded!');

        $this->command->info('Seeding enrollments...');
        $this->call('EnrollmentSeeder');
        $this->command->info('Enrollments seeded!');
    }
}
