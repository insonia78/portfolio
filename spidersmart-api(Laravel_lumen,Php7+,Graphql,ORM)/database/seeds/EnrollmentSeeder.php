<?php

use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('enrollment')->delete();

        // handle center director enrollments
        $eid = 1;
        DB::table('enrollment')->insert([
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 2,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 2,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 2,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 3,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 4,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 4,
                'user_id' => 5,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 6,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
        ]);

        // handle center teacher enrollments
        DB::table('enrollment')->insert([
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 7,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 8,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 9,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 9,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 10,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 10,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 11,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 4,
                'user_id' => 12,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 4,
                'user_id' => 12,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 13,
                'level_id' => null,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 13,
                'level_id' => null,
                'tuition_rate_id' => null
            ]
        ]);

        // handle center student enrollments
        DB::table('enrollment')->insert([
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 14,
                'level_id' => 1,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 15,
                'level_id' => 6,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 15,
                'level_id' => 18,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 16,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 17,
                'level_id' => 9,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 17,
                'level_id' => 29,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 18,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 18,
                'level_id' => 17,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 18,
                'level_id' => 26,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 19,
                'level_id' => 2,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 1,
                'user_id' => 20,
                'level_id' => 3,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 21,
                'level_id' => 3,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 21,
                'level_id' => 16,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 22,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 22,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 23,
                'level_id' => 7,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 23,
                'level_id' => 28,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 23,
                'level_id' => 2,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 24,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 25,
                'level_id' => 5,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 25,
                'level_id' => 17,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 25,
                'level_id' => 27,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 26,
                'level_id' => 10,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 27,
                'level_id' => 31,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 28,
                'level_id' => 32,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 29,
                'level_id' => 3,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 29,
                'level_id' => 14,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 2,
                'user_id' => 30,
                'level_id' => 6,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 30,
                'level_id' => 7,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 31,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 31,
                'level_id' => 16,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 32,
                'level_id' => 30,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 33,
                'level_id' => 29,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 34,
                'level_id' => 8,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 35,
                'level_id' => 3,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 3,
                'user_id' => 36,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 4,
                'user_id' => 37,
                'level_id' => 5,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 4,
                'user_id' => 38,
                'level_id' => 7,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 38,
                'level_id' => 28,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 39,
                'level_id' => 8,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 40,
                'level_id' => 4,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 41,
                'level_id' => 6,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 42,
                'level_id' => 6,
                'tuition_rate_id' => null
            ],
            [
                'id' => $eid++,
                'center_id' => 5,
                'user_id' => 43,
                'level_id' => 5,
                'tuition_rate_id' => null
            ]
        ]);
    }
}
